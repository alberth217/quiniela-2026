const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ ERROR: DATABASE_URL no está definida.");
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Requerido para Neon
});

// --- DEFINICIONES DE TABLAS ---

const createUsuariosTable = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createPartidosTable = `
  CREATE TABLE IF NOT EXISTS partidos (
    id SERIAL PRIMARY KEY,
    equipo_a VARCHAR(100) NOT NULL,
    equipo_b VARCHAR(100) NOT NULL,
    fecha VARCHAR(50) NOT NULL,
    hora VARCHAR(50) NOT NULL,
    fase VARCHAR(100) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    goles_a INTEGER DEFAULT NULL,
    goles_b INTEGER DEFAULT NULL,
    logo_a VARCHAR(255),
    logo_b VARCHAR(255)
  );
`;

const createPrediccionesTable = `
  CREATE TABLE IF NOT EXISTS predicciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    partido_id INTEGER NOT NULL,
    tipo_prediccion VARCHAR(20) NOT NULL, 
    seleccion VARCHAR(20) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, partido_id) 
  );
`;

const createPosicionesTable = `
    CREATE TABLE IF NOT EXISTS posiciones (
        id SERIAL PRIMARY KEY,
        grupo VARCHAR(5) NOT NULL,
        posicion INT NOT NULL,
        equipo VARCHAR(100) NOT NULL,
        pj INT DEFAULT 0,
        g INT DEFAULT 0,
        e INT DEFAULT 0,
        p INT DEFAULT 0,
        gf INT DEFAULT 0,
        gc INT DEFAULT 0,
        dg INT DEFAULT 0,
        puntos INT DEFAULT 0,
        logo VARCHAR(255),
        UNIQUE(grupo, equipo)
    );
`;

// --- DATOS INICIALES (SEED) ---

const INITIAL_PARTIDOS = [
    { equipo_a: 'Argentina', equipo_b: 'México', fecha: '10 jun', hora: '15:00', fase: 'Fase de Grupos' },
    { equipo_a: 'Brasil', equipo_b: 'Colombia', fecha: '10 jun', hora: '18:00', fase: 'Fase de Grupos' },
    { equipo_a: 'España', equipo_b: 'Italia', fecha: '11 jun', hora: '15:00', fase: 'Fase de Grupos' },
    { equipo_a: 'Alemania', equipo_b: 'Francia', fecha: '11 jun', hora: '18:00', fase: 'Fase de Grupos' },
    { equipo_a: 'Inglaterra', equipo_b: 'Portugal', fecha: '12 jun', hora: '15:00', fase: 'Fase de Grupos' },
    { equipo_a: 'Uruguay', equipo_b: 'Chile', fecha: '12 jun', hora: '18:00', fase: 'Fase de Grupos' }
];

// Datos de grupos (simplificado para el ejemplo inicial, pero completo basado en lo que había)
const MANUAL_STANDINGS = [
    {
        "grupo": "A",
        "equipos": [
            { "pos": 1, "equipo": "México", "logo": "https://flagcdn.com/w40/mx.png" },
            { "pos": 2, "equipo": "Sudáfrica", "logo": "https://flagcdn.com/w40/za.png" },
            { "pos": 3, "equipo": "Corea del Sur", "logo": "https://flagcdn.com/w40/kr.png" },
            { "pos": 4, "equipo": "Winner Playoff Path D", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg" }
        ]
    },
    // ... Se incluyen otros grupos de ejemplo o se asume que el usuario los insertará luego
    // Por brevedad en este script inicial incluiremos solo el Grupo A como demo si no existen datos, 
    // pero el usuario puede extender esta lista.
];

async function initDB() {
    try {
        console.log('🔌 Conectando a la base de datos...');
        await client.connect();
        console.log('✅ Conexión exitosa.');

        // 1. Crear Tablas
        console.log('🔨 Creando/Verificando tablas...');
        await client.query(createUsuariosTable);
        await client.query(createPartidosTable);
        await client.query(createPrediccionesTable);
        await client.query(createPosicionesTable);
        console.log('✅ Tablas listas.');

        // 2. Insertar Partidos Iniciales
        const resPartidos = await client.query('SELECT COUNT(*) FROM partidos');
        if (parseInt(resPartidos.rows[0].count) === 0) {
            console.log('🌱 Insertando partidos iniciales...');
            for (const p of INITIAL_PARTIDOS) {
                await client.query(
                    "INSERT INTO partidos (equipo_a, equipo_b, fecha, hora, fase) VALUES ($1, $2, $3, $4, $5)",
                    [p.equipo_a, p.equipo_b, p.fecha, p.hora, p.fase]
                );
            }
            console.log('✅ Partidos insertados.');
        } else {
            console.log('ℹ️ La tabla de partidos ya tiene datos.');
        }

        // 3. Insertar Grupos (Solo si está vacío para evitar duplicados masivos sin control)
        // Nota: El script original sync_manual_standings.js es más completo para esto.
        // Aquí dejamos un placeholder o una inserción básica.
        const resPos = await client.query('SELECT COUNT(*) FROM posiciones');
        if (parseInt(resPos.rows[0].count) === 0) {
            console.log('🌱 Insertando posiciones básicas (Grupo A example)...');
            for (const grupoData of MANUAL_STANDINGS) {
                for (const team of grupoData.equipos) {
                    await client.query(
                        `INSERT INTO posiciones (grupo, posicion, equipo, logo) VALUES ($1, $2, $3, $4)
                         ON CONFLICT (grupo, equipo) DO NOTHING`,
                        [grupoData.grupo, team.pos, team.equipo, team.logo]
                    );
                }
            }
            console.log('✅ Posiciones iniciales insertadas. Ejecuta "node sync_manual_standings.js" para la carga completa si es necesario.');
        } else {
            console.log('ℹ️ La tabla de posiciones ya tiene datos.');
        }

        console.log('🎉 Inicialización de base de datos completada con éxito.');

    } catch (err) {
        console.error('❌ Error durante la inicialización:', err);
    } finally {
        await client.end();
    }
}

initDB();
