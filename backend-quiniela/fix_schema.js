const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
    connectionString: process.env.DATABASE_URL || 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f',
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(poolConfig);

async function fixSchema() {
    const client = await pool.connect();
    try {
        console.log('🔧 Verificando y reparando esquema de base de datos...');
        await client.query('BEGIN');

        // Agregar columnas de goles si no existen
        await client.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='partidos' AND column_name='goles_a') THEN
                    ALTER TABLE partidos ADD COLUMN goles_a INTEGER;
                    RAISE NOTICE 'Columna goles_a agregada';
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='partidos' AND column_name='goles_b') THEN
                    ALTER TABLE partidos ADD COLUMN goles_b INTEGER;
                    RAISE NOTICE 'Columna goles_b agregada';
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='partidos' AND column_name='logo_a') THEN
                    ALTER TABLE partidos ADD COLUMN logo_a VARCHAR(255);
                    RAISE NOTICE 'Columna logo_a agregada';
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='partidos' AND column_name='logo_b') THEN
                    ALTER TABLE partidos ADD COLUMN logo_b VARCHAR(255);
                    RAISE NOTICE 'Columna logo_b agregada';
                END IF;
            END
            $$;
        `);

        await client.query('COMMIT');
        console.log('✅ Esquema verificado y actualizado correctamente.');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error actualizando esquema:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

fixSchema();
