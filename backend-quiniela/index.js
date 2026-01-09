const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

const allowedOrigins = [
    'https://quiniela-2026.pages.dev',
    'https://alberth217-quiniela-2026-m5gd.vercel.app',
    'https://quiniela-2026.vercel.app',
    'http://localhost:5173'
];

// LOGS DE INICIO
console.log("--- SERVIDOR REINICIADO (DEBUG ROUTING V4) ---");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "CONFIGURADA" : "FALTA");

// 1. MANEJO MANUAL DE OPTIONS (CORS PREFLIGHT)
// Esto asegura que Vercel/Navegador reciban un 200 OK con los headers correctos en el preflight
app.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', 'https://quiniela-2026.pages.dev');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
});

// 2. CONFIGURACIÓN DE CORS PARA RUTAS REALES
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const isAllowedVercel = origin.endsWith('.vercel.app');
        const isExplicitlyAllowed = allowedOrigins.includes(origin);
        if (isExplicitlyAllowed || isAllowedVercel) {
            callback(null, true);
        } else {
            console.log(`[CORS-WARN] Origen no reconocido: ${origin}`);
            callback(null, true); // Permitimos en debug para no bloquear
        }
    },
    credentials: true
}));

app.use(express.json());

// Middleware de Logs para todas las peticiones
app.use((req, res, next) => {
    console.log(`[REQ-LOG] ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
    next();
});

// RUTAS DE PRUEBA / DEBUG
app.get('/', (req, res) => {
    res.json({ status: 'active', info: 'Quiniela 2026 API' });
});

app.get('/login', (req, res) => {
    res.json({ message: 'Login endpoint is reachable via GET. Use POST for authentication.' });
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
        res.status(500).json({ message: "Error en base de datos", error: err.message });
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
        res.status(500).json({ message: "Error en servidor", error: err.message });
    }
});

// Otras rutas omitidas por brevedad...

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Run on ${PORT}`));
}

module.exports = app;
