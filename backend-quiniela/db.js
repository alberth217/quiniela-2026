const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f';

const isProduction = process.env.RENDER || false; // RENDER es true en el entorno de despliegue

const poolConfig = {
  connectionString,
};

// Lógica de SSL:
// - Si estamos en PRODUCCIÓN (Render), asumimos conexión interna (sin SSL explícito).
// - Si estamos en LOCAL y conectamos a Render, necesitamos SSL.
if (!isProduction && connectionString.includes('render.com')) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

console.log(`🔌 Configurando DB:
  - Entorno: ${isProduction ? 'Producción (Render)' : 'Local'}
  - URL (Masked): ${connectionString.replace(/:[^:/@]+@/, ':****@')}
  - SSL Habilitado: ${poolConfig.ssl ? 'SÍ' : 'NO'}
`);

const pool = new Pool(poolConfig);

module.exports = pool;