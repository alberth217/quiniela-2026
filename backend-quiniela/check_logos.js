const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
    connectionString: process.env.DATABASE_URL || 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f',
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(poolConfig);

async function checkLogos() {
    const client = await pool.connect();
    try {
        // Buscar el partido de Maccabi Haifa
        const res = await client.query("SELECT id, equipo_a, logo_a, equipo_b, logo_b FROM partidos WHERE equipo_a LIKE '%Maccabi%' OR equipo_b LIKE '%Maccabi%'");
        console.log('Partido Maccabi:');
        if (res.rows.length === 0) {
            console.log('No se encontró el partido.');
        } else {
            console.table(res.rows);
        }
    } catch (err) {
        console.error('Error querying database:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkLogos();
