const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.ohio-postgres.render.com/quiniela_db_jn3f';

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function addColumnaPago() {
    try {
        await client.connect();
        console.log('✅ Conectado a la base de datos...');

        // Check if column exists
        const res = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='usuarios' AND column_name='pago_realizado';
    `);

        if (res.rows.length === 0) {
            console.log('Adding pago_realizado column...');
            await client.query(`
            ALTER TABLE usuarios 
            ADD COLUMN pago_realizado BOOLEAN DEFAULT FALSE;
        `);
            console.log('✅ Columna pago_realizado agregada con éxito!');
        } else {
            console.log('ℹ️ La columna pago_realizado ya existe.');
        }

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.end();
    }
}

addColumnaPago();
