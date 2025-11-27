const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// RUTA DE PRUEBA
app.get('/', (req, res) => {
    res.send('¡Servidor de la Quiniela funcionando!');
});

// RUTA DE REGISTRO
app.post('/registro', async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;
        const userExist = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }
        const nuevoUsuario = await pool.query(
            "INSERT INTO usuarios (nombre, apellido, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [nombre, apellido, email, password]
        );
        res.json(nuevoUsuario.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
});

// RUTA DE LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Usuario no registrado" });
        }
        const usuario = result.rows[0];
        if (password !== usuario.password) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
        res.json(usuario);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor");
    }
});

// RUTA PARA OBTENER PARTIDOS
app.get('/partidos', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM partidos ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener partidos");
    }
});

// --- PREDICCIONES ---

// 1. RUTA PARA LEER
app.get('/predicciones', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM predicciones ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener predicciones");
    }
});

// 2. RUTA PARA GUARDAR
app.post('/predicciones', async (req, res) => {
    try {
        const { usuario_id, partido_id, tipo_prediccion, seleccion } = req.body;

        // Validación básica
        if (!usuario_id || !partido_id || !seleccion) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // Usamos "ON CONFLICT" para actualizar si ya existe
        const query = `
            INSERT INTO predicciones (usuario_id, partido_id, tipo_prediccion, seleccion)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (usuario_id, partido_id) 
            DO UPDATE SET tipo_prediccion = EXCLUDED.tipo_prediccion, seleccion = EXCLUDED.seleccion, fecha_registro = CURRENT_TIMESTAMP
            RETURNING *;
        `;

        const result = await pool.query(query, [usuario_id, partido_id, tipo_prediccion, seleccion]);
        res.json(result.rows[0]);

    } catch (err) {
        console.error("Error guardando predicción:", err.message);
        res.status(500).json({ message: "Error interno al guardar" });
    }
});

// --- NUEVAS RUTAS (REQUERIMIENTO) ---

// 1. ADMIN: Actualizar resultado de partido
app.put('/admin/partidos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { goles_a, goles_b } = req.body;

        if (goles_a === undefined || goles_b === undefined) {
            return res.status(400).json({ message: "Faltan los goles" });
        }

        const result = await pool.query(
            "UPDATE partidos SET goles_a = $1, goles_b = $2, estado = 'finalizado' WHERE id = $3 RETURNING *",
            [goles_a, goles_b, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Partido no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al actualizar partido");
    }
});

// 2. RANKING: Calcular puntos
app.get('/ranking', async (req, res) => {
    try {
        // Obtenemos usuarios, predicciones y partidos finalizados
        const usuariosRes = await pool.query("SELECT id, nombre FROM usuarios");
        const prediccionesRes = await pool.query("SELECT * FROM predicciones");
        const partidosRes = await pool.query("SELECT * FROM partidos WHERE estado = 'finalizado'");

        const usuarios = usuariosRes.rows;
        const predicciones = prediccionesRes.rows;
        const partidos = partidosRes.rows;

        // Mapa de partidos para acceso rápido
        const partidosMap = {};
        partidos.forEach(p => partidosMap[p.id] = p);

        // Calcular puntos por usuario
        const ranking = usuarios.map(user => {
            let puntos = 0;
            const misPredicciones = predicciones.filter(p => p.usuario_id === user.id);

            misPredicciones.forEach(pred => {
                const partido = partidosMap[pred.partido_id];
                if (!partido) return; // Partido no finalizado o no existe

                const golesA = partido.goles_a;
                const golesB = partido.goles_b;

                // Lógica de Puntos
                let resultadoReal = '';
                if (golesA > golesB) resultadoReal = 'Local';
                else if (golesA < golesB) resultadoReal = 'Visita';
                else resultadoReal = 'Empate';

                // Caso 1: Predicción 1X2
                if (pred.tipo_prediccion === '1X2') {
                    if (pred.seleccion === resultadoReal) {
                        puntos += 1; // Acierto simple
                    }
                }
                // Caso 2: Predicción Marcador Exacto
                else if (pred.tipo_prediccion === 'Marcador') {
                    const [predA, predB] = pred.seleccion.split('-').map(Number);

                    if (predA === golesA && predB === golesB) {
                        puntos += 3; // Pleno exacto
                    } else {
                        // Verificar si acertó al menos el resultado (ganador)
                        let resultadoPredicho = '';
                        if (predA > predB) resultadoPredicho = 'Local';
                        else if (predA < predB) resultadoPredicho = 'Visita';
                        else resultadoPredicho = 'Empate';

                        if (resultadoPredicho === resultadoReal) {
                            puntos += 1; // Acierto parcial
                        }
                    }
                }
            });

            return {
                id: user.id,
                nombre: user.nombre,
                puntos: puntos
            };
        });

        // Ordenar por puntos descendente
        ranking.sort((a, b) => b.puntos - a.puntos);

        // Asignar posición
        const rankingConPosicion = ranking.map((item, index) => ({
            posicion: index + 1,
            ...item
        }));

        res.json(rankingConPosicion);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al calcular ranking");
    }
});

// 3. MIS PUNTOS: Historial detallado
app.get('/mis-puntos/:usuario_id', async (req, res) => {
    try {
        const { usuario_id } = req.params;

        const prediccionesRes = await pool.query("SELECT * FROM predicciones WHERE usuario_id = $1", [usuario_id]);
        const partidosRes = await pool.query("SELECT * FROM partidos"); // Traemos todos para mostrar info del partido

        const predicciones = prediccionesRes.rows;
        const partidos = partidosRes.rows;
        const partidosMap = {};
        partidos.forEach(p => partidosMap[p.id] = p);

        const historial = predicciones.map(pred => {
            const partido = partidosMap[pred.partido_id];

            let puntosGanados = 0;
            let estadoPrediccion = 'Pendiente'; // Pendiente, Acertado, Fallado, Pleno

            if (partido && partido.estado === 'finalizado') {
                const golesA = partido.goles_a;
                const golesB = partido.goles_b;

                let resultadoReal = '';
                if (golesA > golesB) resultadoReal = 'Local';
                else if (golesA < golesB) resultadoReal = 'Visita';
                else resultadoReal = 'Empate';

                if (pred.tipo_prediccion === '1X2') {
                    if (pred.seleccion === resultadoReal) {
                        puntosGanados = 1;
                        estadoPrediccion = 'Acertado';
                    } else {
                        estadoPrediccion = 'Fallado';
                    }
                } else if (pred.tipo_prediccion === 'Marcador') {
                    const [predA, predB] = pred.seleccion.split('-').map(Number);
                    if (predA === golesA && predB === golesB) {
                        puntosGanados = 3;
                        estadoPrediccion = 'Pleno';
                    } else {
                        let resultadoPredicho = '';
                        if (predA > predB) resultadoPredicho = 'Local';
                        else if (predA < predB) resultadoPredicho = 'Visita';
                        else resultadoPredicho = 'Empate';

                        if (resultadoPredicho === resultadoReal) {
                            puntosGanados = 1;
                            estadoPrediccion = 'Acertado';
                        } else {
                            estadoPrediccion = 'Fallado';
                        }
                    }
                }
            }

            return {
                ...pred,
                partido: partido ? {
                    equipo_a: partido.equipo_a,
                    equipo_b: partido.equipo_b,
                    goles_a: partido.goles_a,
                    goles_b: partido.goles_b,
                    estado: partido.estado
                } : null,
                puntos: puntosGanados,
                estado_resultado: estadoPrediccion
            };
        });

        res.json(historial);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener historial");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});