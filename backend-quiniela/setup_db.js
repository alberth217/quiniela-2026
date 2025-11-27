const { Client } = require('pg');

const connectionString = 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f';

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

const createUsuariosTable = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createPartidosTable = `
  CREATE TABLE IF NOT EXISTS partidos (
    id SERIAL PRIMARY KEY,
    equipo_a VARCHAR(100) NOT NULL,
    equipo_b VARCHAR(100) NOT NULL,
    fecha VARCHAR(50) NOT NULL,
    hora VARCHAR(50) NOT NULL,
    fase VARCHAR(100) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    goles_a INTEGER DEFAULT NULL,
    goles_b INTEGER DEFAULT NULL
  );
`;

const createPrediccionesTable = `
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

const insertPartidosQuery = `
  INSERT INTO partidos (equipo_a, equipo_b, fecha, hora, fase) VALUES
  ('Argentina', 'México', '10 jun', '15:00', 'Fase de Grupos'),
  ('Brasil', 'Colombia', '10 jun', '18:00', 'Fase de Grupos'),
  ('España', 'Italia', '11 jun', '15:00', 'Fase de Grupos'),
  ('Alemania', 'Francia', '11 jun', '18:00', 'Fase de Grupos'),
  ('Inglaterra', 'Portugal', '12 jun', '15:00', 'Fase de Grupos'),
  ('Uruguay', 'Chile', '12 jun', '18:00', 'Fase de Grupos');
`;

async function setup() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('✅ Connected.');

        // 1. Create Usuarios
        await client.query(createUsuariosTable);
        console.log('✅ Table "usuarios" checked/created.');

        // 2. Create Partidos
        await client.query(createPartidosTable);
        console.log('✅ Table "partidos" checked/created.');

        // 3. Create Predicciones
        await client.query(createPrediccionesTable);
        console.log('✅ Table "predicciones" checked/created.');

        // 4. Insert Initial Partidos if empty
        const res = await client.query('SELECT COUNT(*) FROM partidos');
        if (parseInt(res.rows[0].count) === 0) {
            await client.query(insertPartidosQuery);
            console.log('✅ Initial matches inserted.');
        } else {
            console.log('ℹ️ Matches table already has data.');
        }

    } catch (err) {
        console.error('❌ Error during setup:', err);
    } finally {
        await client.end();
    }
}

setup();
