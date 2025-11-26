const { Client } = require('pg');

// ⚠️ PEGA AQUÍ TU URL EXTERNA DE RENDER
const connectionString = 'postgresql://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.ohio-postgres.render.com/quiniela_db_jn3f'; 

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

const crearTablaQuery = `
  CREATE TABLE IF NOT EXISTS predicciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    partido_id INTEGER NOT NULL,
    tipo_prediccion VARCHAR(20) NOT NULL, 
    seleccion VARCHAR(20) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, partido_id) 
  );
`;
// Nota: UNIQUE(usuario_id, partido_id) asegura que un usuario solo tenga 1 predicción por partido.
// Si intenta guardar otra, la actualizaremos.

async function iniciar() {
  try {
    await client.connect();
    console.log('✅ Conectado...');
    await client.query(crearTablaQuery);
    console.log('✅ Tabla "predicciones" creada con éxito.');
  } catch (err) {   
    console.error('❌ Error:', err);
  } finally {
    await client.end();
  }
}

iniciar();