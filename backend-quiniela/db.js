const { Pool } = require('pg');
require('dotenv').config();

// Configuración inteligente:
// Si existe DATABASE_URL (Render), úsala. Si no, usa las variables locales.
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Necesario para conexiones seguras en Render
      }
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

const pool = new Pool(poolConfig);

module.exports = pool;