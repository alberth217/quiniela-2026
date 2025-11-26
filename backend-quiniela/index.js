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

// 1. RUTA PARA LEER (Ya la tenías)
app.get('/predicciones', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM predicciones ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener predicciones");
    }
});

// 2. RUTA PARA GUARDAR (ESTA ES LA QUE FALTABA)
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});