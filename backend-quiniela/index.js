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

// LOGS PARA DEPURACIÓN EN VERCEL
console.log("--- SERVIDOR OPERATIVO (SOLUCIÓN HÍBRIDA) ---");
console.log("DATABASE_URL cargada:", process.env.DATABASE_URL ? "SÍ" : "NO");

// Middleware de Logs
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
    next();
});

// Configuración de CORS simplificada
// Vercel inyectará los headers principales desde vercel.json
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const isAllowedVercel = origin.endsWith('.vercel.app');
        const isExplicitlyAllowed = allowedOrigins.includes(origin);
        if (isExplicitlyAllowed || isAllowedVercel) {
            callback(null, true);
        } else {
            // Permitimos el origen aunque no esté en la lista para evitar bloqueos durante depuración
            // Pero logueamos la advertencia
            console.log(`[CORS-WARN] Origen no listado: ${origin}`);
            callback(null, true);
        }
    },
    credentials: true
}));

app.use(express.json());

// RUTA DE PRUEBA
app.get('/', (req, res) => {
    res.json({
        msg: '¡Backend Quiniela 2026 en Vercel!',
        status: 'ok',
        db: !!process.env.DATABASE_URL
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

// Otras rutas...
app.get('/partidos', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM partidos ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener partidos");
    }
});

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
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}

module.exports = app;
