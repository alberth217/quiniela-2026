const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ ADVERTENCIA: DATABASE_URL no está definida. Asegúrate de tener un archivo .env o variables de entorno configuradas.");
}

const poolConfig = {
  connectionString,
  ssl: {
    rejectUnauthorized: false // Requerido para Neon y la mayoría de proveedores remotos
  }
};

console.log(`🔌 Configurando DB:
  - URL definida: ${connectionString ? 'SÍ' : 'NO'}
  - SSL Habilitado: SÍ (rejectUnauthorized: false)
`);

const pool = new Pool(poolConfig);

module.exports = pool;