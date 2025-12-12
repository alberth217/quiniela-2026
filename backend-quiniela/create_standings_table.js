const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
    connectionString: process.env.DATABASE_URL || 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f',
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(poolConfig);

const createTableQuery = `
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

async function createStandingsTable() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        const client = await pool.connect();

        try {
            console.log('🔨 Creando tabla "posiciones"...');
            await client.query(createTableQuery);
            console.log('✅ Tabla "posiciones" creada exitosamente.'); // Or "verified" if exists
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('❌ Error creando la tabla:', err);
    } finally {
        await pool.end();
    }
}

createStandingsTable();
