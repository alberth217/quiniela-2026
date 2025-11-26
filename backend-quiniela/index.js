const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Importamos la conexión

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir datos JSON del frontend

// RUTA DE PRUEBA (para ver si funciona)
app.get('/', (req, res) => {
    res.send('¡Servidor de la Quiniela funcionando!');
});

// RUTA DE REGISTRO DE USUARIO (ACTUALIZADA)
app.post('/registro', async (req, res) => {
    try {
        // Ahora recibimos también el apellido
        const { nombre, apellido, email, password } = req.body;

        // Verificamos si el usuario ya existe
        const userExist = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        // Insertamos nombre, apellido, email y password
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

// --- RUTA DE LOGIN ---
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscamos si el usuario existe por su email
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

        // Si no hay filas, es que el email no existe
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Usuario no registrado" });
        }

        const usuario = result.rows[0];

        // 2. Verificamos si la contraseña coincide
        // (Nota: Para un proyecto real futuro, aquí deberíamos comparar contraseñas encriptadas)
        if (password !== usuario.password) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // 3. ¡Éxito! Devolvemos los datos del usuario
        res.json(usuario);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor");
    }
});
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });

    // RUTA PARA OBTENER PARTIDOS
app.get('/partidos', async (req, res) => {
    try {
        // Consultamos todos los partidos ordenados por id
        const result = await pool.query("SELECT * FROM partidos ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener partidos");
    }
});

// 1. RUTA PARA LEER (Esta es la que ya tienes, déjala así)
app.get('/predicciones', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM predicciones ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener predicciones");
    }
});

// 2. 👇 RUTA PARA GUARDAR (ESTA ES LA QUE TE FALTA) 👇
app.post('/predicciones', async (req, res) => {
    try {
        const { usuario_id, partido_id, tipo_prediccion, seleccion } = req.body;

        // Validación básica
        if (!usuario_id || !partido_id || !seleccion) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // Usamos "ON CONFLICT" para:
        // - Insertar si es nueva.
        // - Actualizar si el usuario ya había pronosticado ese partido.
        const query = `
            INSERT INTO predicciones (usuario_id, partido_id, tipo_prediccion, seleccion)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (usuario_id, partido_id) 
            DO UPDATE SET tipo_prediccion = EXCLUDED.tipo_prediccion, seleccion = EXCLUDED.seleccion, fecha_registro = CURRENT_TIMESTAMP
            RETURNING *;
        `;
        
        const result = await pool.query(query, [usuario_id, partido_id, tipo_prediccion, seleccion]);
        
        // Devolvemos la predicción guardada
        res.json(result.rows[0]);

    } catch (err) {
        console.error("Error guardando predicción:", err.message);
        res.status(500).json({ message: "Error interno al guardar" });
    }
});