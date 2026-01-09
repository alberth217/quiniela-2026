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

// 1. MANEJO MANUAL DE OPTIONS (CORS PREFLIGHT)
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

// 2. CONFIGURACIÓN DE CORS
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const isAllowedVercel = origin.endsWith('.vercel.app');
        const isExplicitlyAllowed = allowedOrigins.includes(origin);
        if (isExplicitlyAllowed || isAllowedVercel) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

app.use(express.json());

// Logs básicos
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
});

// --- RUTAS ---

app.get('/', (req, res) => {
    res.json({ status: 'online', service: 'Quiniela 2026 API' });
});

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
        res.status(500).json({ message: "Error en registro" });
    }
});

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
        res.status(500).json({ message: "Error en login" });
    }
});

app.get('/partidos', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM partidos ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al obtener partidos" });
    }
});

app.get('/posiciones', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posiciones ORDER BY grupo ASC, posicion ASC");
        const grupos = {};
        result.rows.forEach(row => {
            if (!grupos[row.grupo]) grupos[row.grupo] = [];
            grupos[row.grupo].push(row);
        });
        res.json(grupos);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al obtener posiciones" });
    }
});

app.get('/predicciones', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM predicciones");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al obtener predicciones" });
    }
});

app.post('/predicciones', async (req, res) => {
    try {
        const { usuario_id, partido_id, tipo_prediccion, seleccion } = req.body;
        const query = `
            INSERT INTO predicciones (usuario_id, partido_id, tipo_prediccion, seleccion)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (usuario_id, partido_id)
            DO UPDATE SET tipo_prediccion = $3, seleccion = $4
            RETURNING *;
        `;
        const result = await pool.query(query, [usuario_id, partido_id, tipo_prediccion, seleccion]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al guardar predicción" });
    }
});

// --- RUTA RANKING ---
app.get('/ranking', async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.nombre, 
                COALESCE(SUM(
                    CASE 
                        WHEN p.estado = 'finalizado' THEN 
                            CASE 
                                WHEN pr.seleccion = (p.goles_a || '-' || p.goles_b) THEN 3
                                WHEN (
                                    (p.goles_a > p.goles_b AND split_part(pr.seleccion, '-', 1)::int > split_part(pr.seleccion, '-', 2)::int) OR
                                    (p.goles_a < p.goles_b AND split_part(pr.seleccion, '-', 1)::int < split_part(pr.seleccion, '-', 2)::int) OR
                                    (p.goles_a = p.goles_b AND split_part(pr.seleccion, '-', 1)::int = split_part(pr.seleccion, '-', 2)::int)
                                ) THEN 1
                                ELSE 0 
                            END
                        ELSE 0 
                    END
                ), 0) as puntos,
                COALESCE(COUNT(CASE WHEN p.estado = 'finalizado' AND (
                    pr.seleccion = (p.goles_a || '-' || p.goles_b) OR
                    ((p.goles_a > p.goles_b AND split_part(pr.seleccion, '-', 1)::int > split_part(pr.seleccion, '-', 2)::int) OR
                     (p.goles_a < p.goles_b AND split_part(pr.seleccion, '-', 1)::int < split_part(pr.seleccion, '-', 2)::int) OR
                     (p.goles_a = p.goles_b AND split_part(pr.seleccion, '-', 1)::int = split_part(pr.seleccion, '-', 2)::int))
                ) THEN 1 END), 0) as aciertos
            FROM usuarios u
            LEFT JOIN predicciones pr ON u.id = pr.usuario_id
            LEFT JOIN partidos p ON pr.partido_id = p.id
            GROUP BY u.id, u.nombre
            ORDER BY puntos DESC, aciertos DESC;
        `;
        const result = await pool.query(query);
        const ranking = result.rows.map((row, index) => ({
            ...row,
            posicion: index + 1
        }));
        res.json(ranking);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al obtener ranking" });
    }
});

// --- RUTA MIS PUNTOS ---
app.get('/mis-puntos/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const query = `
            SELECT pr.*, 
                   json_build_object(
                       'equipo_a', p.equipo_a,
                       'equipo_b', p.equipo_b,
                       'goles_a', p.goles_a,
                       'goles_b', p.goles_b,
                       'estado', p.estado,
                       'fecha', p.fecha
                   ) as partido,
                   CASE 
                       WHEN p.estado = 'finalizado' THEN 
                           CASE 
                               WHEN pr.seleccion = (p.goles_a || '-' || p.goles_b) THEN 3
                               WHEN (
                                   (p.goles_a > p.goles_b AND split_part(pr.seleccion, '-', 1)::int > split_part(pr.seleccion, '-', 2)::int) OR
                                   (p.goles_a < p.goles_b AND split_part(pr.seleccion, '-', 1)::int < split_part(pr.seleccion, '-', 2)::int) OR
                                   (p.goles_a = p.goles_b AND split_part(pr.seleccion, '-', 1)::int = split_part(pr.seleccion, '-', 2)::int)
                               ) THEN 1
                               ELSE 0 
                           END
                       ELSE 0 
                   END as puntos,
                   CASE 
                       WHEN p.estado = 'finalizado' THEN 
                           CASE 
                               WHEN pr.seleccion = (p.goles_a || '-' || p.goles_b) THEN 'Pleno'
                               WHEN (
                                   (p.goles_a > p.goles_b AND split_part(pr.seleccion, '-', 1)::int > split_part(pr.seleccion, '-', 2)::int) OR
                                   (p.goles_a < p.goles_b AND split_part(pr.seleccion, '-', 1)::int < split_part(pr.seleccion, '-', 2)::int) OR
                                   (p.goles_a = p.goles_b AND split_part(pr.seleccion, '-', 1)::int = split_part(pr.seleccion, '-', 2)::int)
                               ) THEN 'Acertado'
                               ELSE 'Fallado'
                           END
                       ELSE 'Pendiente'
                   END as estado_resultado
            FROM predicciones pr
            JOIN partidos p ON pr.partido_id = p.id
            WHERE pr.usuario_id = $1
            ORDER BY p.id DESC;
        `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al obtener puntos del usuario" });
    }
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Backend on ${PORT}`));
}

module.exports = app;
