require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
// const stripe = ... (Moved initialized to inside route)

const app = express();

const allowedOrigins = [
    'https://quiniela-2026.pages.dev',
    'https://quiniela-golmaster-2026.pages.dev',
    'https://alberth217-quiniela-2026-m5gd.vercel.app',
    'https://quiniela-2026.vercel.app',
    'http://localhost:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const isAllowedVercel = origin.endsWith('.vercel.app');
        const isExplicitlyAllowed = allowedOrigins.includes(origin);
        if (isExplicitlyAllowed || isAllowedVercel) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['X-Requested-With', 'content-type', 'Authorization', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// --- STRIPE WEBHOOK ---
// aun no se ve 
// IMPORTANTE: Esto debe ir ANTES de express.json()
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        if (!stripe) throw new Error("Stripe no inicializado");
        // Asegúrate de usar tu STRIPE_WEBHOOK_SECRET en .env
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const usuario_id = session.metadata.usuario_id;

        console.log(`✅ Pago recibido para usuario: ${usuario_id}`);

        // Update database
        try {
            await pool.query(
                "UPDATE usuarios SET pago_realizado = TRUE WHERE id = $1",
                [usuario_id]
            );
            console.log(`✅ Usuario ${usuario_id} marcado como PAGADO.`);
        } catch (dbError) {
            console.error('Error updating user payment status:', dbError);
            return res.status(500).send('Database Error');
        }
    }

    res.send();
});

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

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { usuario_id, monto } = req.body;

        if (!usuario_id) {
            return res.status(400).json({ message: 'Usuario ID es requerido' });
        }

        // Default amount 1000 cents = $10.00 USD
        const amount = monto ? parseInt(monto) * 100 : 1000;

        // Initialize Stripe dynamically to ensure env var is loaded
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        if (!stripe) {
            throw new Error("Stripe initialization failed");
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Inscripción Quiniela 2026',
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5173/pago-exitoso',
            cancel_url: 'http://localhost:5173/pago-fallido',
            metadata: {
                usuario_id: usuario_id.toString(),
            },
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error("Stripe Error:", err.message);
        res.status(500).json({ message: "Error al crear sesión de pago" });
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

// --- RUTA TEMPORAL PARA POBLAR GRUPOS ---
app.get('/dev/seed-groups', async (req, res) => {
    try {
        const sql = `
            INSERT INTO posiciones (grupo, posicion, equipo, logo) VALUES 
            ('A', 1, 'México', 'https://flagcdn.com/w40/mx.png'),
            ('A', 2, 'Sudáfrica', 'https://flagcdn.com/w40/za.png'),
            ('A', 3, 'Corea del Sur', 'https://flagcdn.com/w40/kr.png'),
            ('A', 4, 'Winner Playoff Path D', 'https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg'),
            ('B', 1, 'Canadá', 'https://flagcdn.com/w40/ca.png'),
            ('B', 2, 'Winner Playoff Path A', 'https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg'),
            ('B', 3, 'Catar', 'https://flagcdn.com/w40/qa.png'),
            ('B', 4, 'Suiza', 'https://flagcdn.com/w40/ch.png'),
            ('C', 1, 'Brasil', 'https://flagcdn.com/w40/br.png'),
            ('C', 2, 'Marruecos', 'https://flagcdn.com/w40/ma.png'),
            ('C', 3, 'Haití', 'https://flagcdn.com/w40/ht.png'),
            ('C', 4, 'Escocia', 'https://flagcdn.com/w40/gb-sct.png'),
            ('D', 1, 'Estados Unidos', 'https://flagcdn.com/w40/us.png'),
            ('D', 2, 'Paraguay', 'https://flagcdn.com/w40/py.png'),
            ('D', 3, 'Australia', 'https://flagcdn.com/w40/au.png'),
            ('D', 4, 'Winner Playoff Path C', 'https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg'),
            ('E', 1, 'Alemania', 'https://flagcdn.com/w40/de.png'),
            ('E', 2, 'Curacao', 'https://flagcdn.com/w40/cw.png'),
            ('E', 3, 'Costa de Marfil', 'https://flagcdn.com/w40/ci.png'),
            ('E', 4, 'Ecuador', 'https://flagcdn.com/w40/ec.png'),
            ('F', 1, 'Países Bajos', 'https://flagcdn.com/w40/nl.png'),
            ('F', 2, 'Japón', 'https://flagcdn.com/w40/jp.png'),
            ('F', 3, 'Winner Playoff Path B', 'https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg'),
            ('F', 4, 'Túnez', 'https://flagcdn.com/w40/tn.png'),
            ('G', 1, 'Bélgica', 'https://flagcdn.com/w40/be.png'),
            ('G', 2, 'Egipto', 'https://flagcdn.com/w40/eg.png'),
            ('G', 3, 'Irán', 'https://flagcdn.com/w40/ir.png'),
            ('G', 4, 'Nueva Zelanda', 'https://flagcdn.com/w40/nz.png'),
            ('H', 1, 'España', 'https://flagcdn.com/w40/es.png'),
            ('H', 2, 'Cabo Verde', 'https://flagcdn.com/w40/cv.png'),
            ('H', 3, 'Arabia Saudita', 'https://flagcdn.com/w40/sa.png'),
            ('H', 4, 'Uruguay', 'https://flagcdn.com/w40/uy.png'),
            ('I', 1, 'Francia', 'https://flagcdn.com/w40/fr.png'),
            ('I', 2, 'Senegal', 'https://flagcdn.com/w40/sn.png'),
            ('I', 3, 'Intercontinental Playoff Path 2', 'https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg'),
            ('I', 4, 'Noruega', 'https://flagcdn.com/w40/no.png'),
            ('J', 1, 'Argentina', 'https://flagcdn.com/w40/ar.png'),
            ('J', 2, 'Argelia', 'https://flagcdn.com/w40/dz.png'),
            ('J', 3, 'Austria', 'https://flagcdn.com/w40/at.png'),
            ('J', 4, 'Jordania', 'https://flagcdn.com/w40/jo.png'),
            ('K', 1, 'Portugal', 'https://flagcdn.com/w40/pt.png'),
            ('K', 2, 'Intercontinental Playoff Path 1', 'https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg'),
            ('K', 3, 'Uzbekistán', 'https://flagcdn.com/w40/uz.png'),
            ('K', 4, 'Colombia', 'https://flagcdn.com/w40/co.png'),
            ('L', 1, 'Inglaterra', 'https://flagcdn.com/w40/gb-eng.png'),
            ('L', 2, 'Croacia', 'https://flagcdn.com/w40/hr.png'),
            ('L', 3, 'Ghana', 'https://flagcdn.com/w40/gh.png'),
            ('L', 4, 'Panamá', 'https://flagcdn.com/w40/pa.png')
            ON CONFLICT (grupo, equipo) DO UPDATE SET logo = EXCLUDED.logo;
        `;
        await pool.query(sql);
        res.send("<h1>✅ Grupos del Mundial 2026 (A-L) cargados con éxito</h1>");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Backend on ${PORT}`));
}

module.exports = app;
