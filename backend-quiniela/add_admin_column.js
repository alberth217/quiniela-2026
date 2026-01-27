const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const addAdminColumn = async () => {
    try {
        // 1. Add column if it doesn't exist
        await pool.query(`
      ALTER TABLE usuarios 
      ADD COLUMN IF NOT EXISTS es_admin BOOLEAN DEFAULT FALSE;
    `);
        console.log("✅ Columna 'es_admin' agregada (o ya existía).");

        // 2. Promote ID 1 to Admin
        const res = await pool.query(`
      UPDATE usuarios 
      SET es_admin = TRUE 
      WHERE id = 1
      RETURNING *;
    `);

        if (res.rows.length > 0) {
            console.log(`🎉 Usuario ID 1 (${res.rows[0].email}) es ahora ADMIN.`);
        } else {
            console.log("⚠️ No se encontró usuario con ID 1. Verifica los datos.");
        }

    } catch (err) {
        console.error("❌ Error en migración:", err);
    } finally {
        await pool.end();
    }
};

addAdminColumn();
