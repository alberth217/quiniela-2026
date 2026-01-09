const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ ADVERTENCIA: DATABASE_URL no está definida.");
}

const poolConfig = {
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(poolConfig);

module.exports = pool;