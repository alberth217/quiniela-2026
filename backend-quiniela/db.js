const { Pool } = require('pg');
require('dotenv').config();

// Configuración inteligente:
// Si existe DATABASE_URL (Render), úsala. Si no, usa las variables locales.
const poolConfig = {
  connectionString: 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f',
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(poolConfig);

module.exports = pool;