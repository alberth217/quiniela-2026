const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

const allowedOrigins = [
    'https://quiniela-2026.pages.dev',
    'https://quiniela-2026-beryl.vercel.app',
    'http://localhost:5173'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log(`[CORS-DEBUG] Method: ${req.method} | URL: ${req.url} | Origin: ${origin}`);

    if (allowedOrigins.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Accept');

    if (req.method === 'OPTIONS') {
        console.log(`[CORS-DEBUG] Respondiento a preflight OPTIONS`);
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// RUTA DE PRUEBA
app.get('/', (req, res) => {
    res.send('¡Servidor de la Quiniela funcionando!');
});

// RUTA DE REGISTRO
app.post('/registro', async (req, res) => {
    console.log("[DEBUG] Petición a /registro recibida");
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
        console.error("[ERROR DB] Error en registro:", err.message);
        res.status(500).json({ message: "Error interno en el servidor", error: err.message });
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
        console.error("[ERROR DB] Error en login:", err.message);
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
});

// RUTA PARA OBTENER PARTIDOS
app.get('/partidos', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM partidos ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("[ERROR DB] Error en partidos:", err.message);
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

        if (!usuario_id || !partido_id || !seleccion) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

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

// --- ADMIN ---

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

// POSICIONES
app.get('/posiciones', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posiciones ORDER BY grupo ASC, posicion ASC");
        const grupos = {};
        result.rows.forEach(row => {
            if (!grupos[row.grupo]) {
                grupos[row.grupo] = [];
            }
            grupos[row.grupo].push(row);
        });
        res.json(grupos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener posiciones");
    }
});

// RANKING
app.get('/ranking', async (req, res) => {
    try {
        const usuariosRes = await pool.query("SELECT id, nombre FROM usuarios");
        const prediccionesRes = await pool.query("SELECT * FROM predicciones");
        const partidosRes = await pool.query("SELECT * FROM partidos WHERE estado = 'finalizado'");

        const usuarios = usuariosRes.rows;
        const predicciones = prediccionesRes.rows;
        const partidos = partidosRes.rows;

        const partidosMap = {};
        partidos.forEach(p => partidosMap[p.id] = p);

        const ranking = usuarios.map(user => {
            let puntos = 0;
            const misPredicciones = predicciones.filter(p => p.usuario_id === user.id);

            misPredicciones.forEach(pred => {
                const partido = partidosMap[pred.partido_id];
                if (!partido) return;

                const golesA = partido.goles_a;
                const golesB = partido.goles_b;

                let resultadoReal = '';
                if (golesA > golesB) resultadoReal = 'Local';
                else if (golesA < golesB) resultadoReal = 'Visita';
                else resultadoReal = 'Empate';

                if (pred.tipo_prediccion === '1X2') {
                    if (pred.seleccion === resultadoReal) {
                        puntos += 1;
                    }
                }
                else if (pred.tipo_prediccion === 'Marcador') {
                    const [predA, predB] = pred.seleccion.split('-').map(Number);
                    if (predA === golesA && predB === golesB) {
                        puntos += 3;
                    } else {
                        let resultadoPredicho = '';
                        if (predA > predB) resultadoPredicho = 'Local';
                        else if (predA < predB) resultadoPredicho = 'Visita';
                        else resultadoPredicho = 'Empate';

                        if (resultadoPredicho === resultadoReal) {
                            puntos += 1;
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

        ranking.sort((a, b) => b.puntos - a.puntos);
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

// HISTORIAL
app.get('/mis-puntos/:usuario_id', async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const prediccionesRes = await pool.query("SELECT * FROM predicciones WHERE usuario_id = $1", [usuario_id]);
        const partidosRes = await pool.query("SELECT * FROM partidos");

        const predicciones = prediccionesRes.rows;
        const partidos = partidosRes.rows;
        const partidosMap = {};
        partidos.forEach(p => partidosMap[p.id] = p);

        const historial = predicciones.map(pred => {
            const partido = partidosMap[pred.partido_id];
            let puntosGanados = 0;
            let estadoPrediccion = 'Pendiente';

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

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, async () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
        try {
            const res = await pool.query('SELECT NOW()');
            console.log("✅ CONEXIÓN A BASE DE DATOS EXITOSA:", res.rows[0]);
        } catch (err) {
            console.error("❌ ERROR AL CONECTAR A BASE DE DATOS:", err.message);
        }
    });
}

module.exports = app;
