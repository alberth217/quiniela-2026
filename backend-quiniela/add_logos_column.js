const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
    connectionString: process.env.DATABASE_URL || 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f',
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(poolConfig);

async function addLogoColumns() {
    const client = await pool.connect();
    try {
        console.log('🔄 Agregando columnas de logos a la tabla partidos...');

        await client.query(`
            ALTER TABLE partidos 
            ADD COLUMN IF NOT EXISTS logo_a VARCHAR(255),
            ADD COLUMN IF NOT EXISTS logo_b VARCHAR(255);
        `);

        console.log('✅ Columnas logo_a y logo_b agregadas correctamente.');
    } catch (err) {
        console.error('❌ Error al alterar la tabla:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

addLogoColumns();
