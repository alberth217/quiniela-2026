const { Client } = require('pg');

const connectionString = 'postgresql://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.ohio-postgres.render.com/quiniela_db_jn3f'; 

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

const crearTablaQuery = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function crearTabla() {
  try {
    console.log('Intentando conectar con:', connectionString); // Para ver si la URL está bien
    await client.connect();
    console.log('✅ Conectado a la base de datos en la nube...');
    await client.query(crearTablaQuery);
    console.log('✅ ¡Tabla usuarios creada con éxito!');
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.end();
  }
}

crearTabla();