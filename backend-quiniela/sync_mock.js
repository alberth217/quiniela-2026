const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la Base de Datos
const poolConfig = {
    connectionString: process.env.DATABASE_URL || 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f',
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(poolConfig);

// Datos de prueba (Mock Data) con Logos
const mockFixtures = [
    {
        equipo_a: 'Argentina',
        equipo_b: 'Brasil',
        logo_a: 'https://media.api-sports.io/football/teams/26.png', // Argentina
        logo_b: 'https://media.api-sports.io/football/teams/6.png',  // Brasil
        fecha: '15 jun',
        hora: '20:00',
        fase: 'Fase de Grupos',
        estado: 'pendiente',
        goles_a: null,
        goles_b: null
    },
    {
        equipo_a: 'Francia',
        equipo_b: 'Alemania',
        logo_a: 'https://media.api-sports.io/football/teams/2.png',  // Francia
        logo_b: 'https://media.api-sports.io/football/teams/25.png', // Alemania
        fecha: '16 jun',
        hora: '18:00',
        fase: 'Fase de Grupos',
        estado: 'pendiente',
        goles_a: null,
        goles_b: null
    },
    {
        equipo_a: 'España',
        equipo_b: 'Portugal',
        logo_a: 'https://media.api-sports.io/football/teams/9.png',  // España
        logo_b: 'https://media.api-sports.io/football/teams/27.png', // Portugal
        fecha: '17 jun',
        hora: '21:00',
        fase: 'Fase de Grupos',
        estado: 'pendiente',
        goles_a: null,
        goles_b: null
    },
    {
        equipo_a: 'México',
        equipo_b: 'USA',
        logo_a: 'https://media.api-sports.io/football/teams/16.png', // México
        logo_b: 'https://media.api-sports.io/football/teams/2384.png', // USA
        fecha: '18 jun',
        hora: '19:00',
        fase: 'Fase de Grupos',
        estado: 'pendiente',
        goles_a: null,
        goles_b: null
    },
    {
        equipo_a: 'Inglaterra',
        equipo_b: 'Italia',
        logo_a: 'https://media.api-sports.io/football/teams/10.png', // Inglaterra
        logo_b: 'https://media.api-sports.io/football/teams/768.png', // Italia (aprox)
        fecha: '14 jun',
        hora: '15:00',
        fase: 'Fase de Grupos',
        estado: 'finalizado',
        goles_a: 2,
        goles_b: 1
    }
];

async function syncMockMatches() {
    const client = await pool.connect();

    try {
        console.log('🔄 Iniciando sincronización de datos de prueba...');
        await client.query('BEGIN');

        for (const match of mockFixtures) {
            const { equipo_a, equipo_b, logo_a, logo_b, fecha, hora, fase, estado, goles_a, goles_b } = match;

            // Verificar si existe
            const checkQuery = `
          SELECT id FROM partidos 
          WHERE (equipo_a = $1 AND equipo_b = $2) OR (equipo_a = $2 AND equipo_b = $1)
        `;
            const checkRes = await client.query(checkQuery, [equipo_a, equipo_b]);

            if (checkRes.rows.length > 0) {
                // Actualizar
                const id = checkRes.rows[0].id;
                const updateQuery = `
            UPDATE partidos 
            SET fecha = $1, hora = $2, fase = $3, estado = $4, goles_a = $5, goles_b = $6, logo_a = $7, logo_b = $8
            WHERE id = $9
          `;
                await client.query(updateQuery, [fecha, hora, fase, estado, goles_a, goles_b, logo_a, logo_b, id]);
                console.log(`🔄 Actualizado (Mock): ${equipo_a} vs ${equipo_b}`);
            } else {
                // Insertar
                const insertQuery = `
            INSERT INTO partidos (equipo_a, equipo_b, fecha, hora, fase, estado, goles_a, goles_b, logo_a, logo_b)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `;
                await client.query(insertQuery, [equipo_a, equipo_b, fecha, hora, fase, estado, goles_a, goles_b, logo_a, logo_b]);
                console.log(`➕ Insertado (Mock): ${equipo_a} vs ${equipo_b}`);
            }
        }

        await client.query('COMMIT');
        console.log('✅ Datos de prueba sincronizados correctamente.');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error sincronizando datos de prueba:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

syncMockMatches();
