const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

const allowedOrigins = [
    'https://quiniela-2026.pages.dev',
    'https://quiniela-2026-beryl.vercel.app',
    'https://quiniela-2026.vercel.app',
    'http://localhost:5173'
];

// LOG DE INICIO PARA VERIFICAR VARIABLES DE ENTORNO
console.log("--- INICIO DE SERVIDOR ---");
console.log("DATABASE_URL definida:", process.env.DATABASE_URL ? "SÍ" : "NO");

app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Si el origin termina en .vercel.app o está en nuestra lista, lo permitimos
    const isAllowedVercel = origin && origin.endsWith('.vercel.app');
    const isExplicitlyAllowed = allowedOrigins.includes(origin);

    if (isExplicitlyAllowed || isAllowedVercel || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
        res.setHeader('Access-Control-Allow-Origin', 'https://quiniela-2026.pages.dev'); // Fallback seguro
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Accept');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// RUTA DE PRUEBA
app.get('/', (req, res) => {
    res.json({
        message: '¡Servidor de la Quiniela enviando datos correctamente!',
        db_status: process.env.DATABASE_URL ? 'Connected' : 'Missing URL'
    });
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
        console.error("[ERROR DB]", err.message);
        res.status(500).json({ message: "Error interno del servidor", error: err.message });
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
        console.error("[ERROR DB]", err.message);
        res.status(500).json({ message: "Error del servidor", error: err.message });
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

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo localmente en el puerto ${PORT}`);
    });
}

module.exports = app;
