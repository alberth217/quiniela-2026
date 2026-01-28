require('dotenv').config();
const pool = require('./db');

async function addNicknameColumn() {
    try {
        console.log("Checking if 'nickname' column exists...");

        // 1. Add column if it doesn't exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='usuarios' AND column_name='nickname') THEN 
                    ALTER TABLE usuarios ADD COLUMN nickname VARCHAR(255); 
                END IF; 
            END $$;
        `);
        console.log("Column 'nickname' checked/added.");

        // 2. Backfill existing users who have no nickname
        // Default: Part of email before '@'
        const res = await pool.query(`
            UPDATE usuarios 
            SET nickname = SPLIT_PART(email, '@', 1) 
            WHERE nickname IS NULL OR nickname = '';
        `);

        console.log(`Backfilled nicknames for ${res.rowCount} users.`);

        console.log("Migration completed successfully.");
    } catch (err) {
        console.error("Error during migration:", err);
    } finally {
        pool.end();
    }
}

addNicknameColumn();
