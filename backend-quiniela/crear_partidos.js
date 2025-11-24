const { Client } = require('pg');

// ⚠️ PEGA AQUÍ TU URL EXTERNA DE RENDER (La que empieza con postgres://...)
const connectionString = 'postgresql://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.ohio-postgres.render.com/quiniela_db_jn3f'; 

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

const crearTablaQuery = `
  CREATE TABLE IF NOT EXISTS partidos (
    id SERIAL PRIMARY KEY,
    equipo_a VARCHAR(100) NOT NULL,
    equipo_b VARCHAR(100) NOT NULL,
    fecha VARCHAR(50) NOT NULL,
    hora VARCHAR(50) NOT NULL,
    fase VARCHAR(100) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente'
  );
`;

const insertarPartidosQuery = `
  INSERT INTO partidos (equipo_a, equipo_b, fecha, hora, fase) VALUES
  ('Argentina', 'México', '10 jun', '15:00', 'Fase de Grupos'),
  ('Brasil', 'Colombia', '10 jun', '18:00', 'Fase de Grupos'),
  ('España', 'Italia', '11 jun', '15:00', 'Fase de Grupos'),
  ('Alemania', 'Francia', '11 jun', '18:00', 'Fase de Grupos'),
  ('Inglaterra', 'Portugal', '12 jun', '15:00', 'Fase de Grupos'),
  ('Uruguay', 'Chile', '12 jun', '18:00', 'Fase de Grupos');
`;

async function iniciar() {
  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos...');
    
    // 1. Crear Tabla
    await client.query(crearTablaQuery);
    console.log('✅ Tabla "partidos" creada.');

    // 2. Insertar Datos (Solo si está vacía para no duplicar)
    const check = await client.query('SELECT COUNT(*) FROM partidos');
    if (parseInt(check.rows[0].count) === 0) {
        await client.query(insertarPartidosQuery);
        console.log('✅ Partidos de ejemplo insertados.');
    } else {
        console.log('ℹ️ La tabla ya tenía datos, no se insertó nada nuevo.');
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.end();
  }
}

iniciar();