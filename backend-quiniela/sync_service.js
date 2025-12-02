const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la Base de Datos (Reutilizando la lógica de db.js o directa)
const poolConfig = {
    connectionString: process.env.DATABASE_URL || 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f',
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(poolConfig);

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const API_URL = 'https://api-football-v1.p.rapidapi.com/v3/fixtures';

async function syncMatches() {
    if (!RAPIDAPI_KEY) {
        console.error('❌ Error: RAPIDAPI_KEY no está definida en las variables de entorno.');
        process.exit(1);
    }

    try {
        console.log('🔄 Conectando a API-Football...');

        // Configuración de la petición
        const options = {
            method: 'GET',
            url: API_URL,
            params: {
                next: '15', // Próximos 15 partidos
                // league: '1', // Opcional: ID de la Copa del Mundo (ej. 1) o Champions. Si se omite, trae de todo el mundo.
                // timezone: 'America/La_Paz' // Ajustar si es necesario
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        const fixtures = response.data.response;

        if (!fixtures || fixtures.length === 0) {
            console.log('⚠️ No se encontraron partidos próximos.');
            return;
        }

        console.log(`✅ Se obtuvieron ${fixtures.length} partidos. Iniciando sincronización...`);

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (const item of fixtures) {
                const { fixture, teams, goals, league } = item;

                // Mapeo de datos
                const equipo_a = teams.home.name;
                const equipo_b = teams.away.name;
                const logo_a = teams.home.logo;
                const logo_b = teams.away.logo;

                // Formateo de fecha y hora
                const dateObj = new Date(fixture.date);
                // Formato DD MMM (ej. 10 jun) - Ajustado a local si es posible, o UTC
                const fecha = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                // Formato HH:mm
                const hora = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

                const fase = league.round || 'Fase de Grupos'; // Fallback

                // Estado y Goles
                let estado = 'pendiente';
                if (fixture.status.short === 'FT' || fixture.status.short === 'AET' || fixture.status.short === 'PEN') {
                    estado = 'finalizado';
                } else if (fixture.status.short === '1H' || fixture.status.short === '2H' || fixture.status.short === 'HT') {
                    estado = 'en_juego';
                }

                const goles_a = goals.home;
                const goles_b = goals.away;

                // Upsert Logic: Check if exists by teams and roughly date, or just insert if simple
                // Para evitar duplicados complejos, vamos a intentar buscar por equipos y fecha aproximada
                // O simplificar asumiendo que si coinciden los equipos es el mismo partido (riesgoso si juegan ida y vuelta pronto)
                // Mejor estrategia: Buscar por equipos.

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
                    console.log(`🔄 Actualizado: ${equipo_a} vs ${equipo_b}`);
                } else {
                    // Insertar
                    const insertQuery = `
            INSERT INTO partidos (equipo_a, equipo_b, fecha, hora, fase, estado, goles_a, goles_b, logo_a, logo_b)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `;
                    await client.query(insertQuery, [equipo_a, equipo_b, fecha, hora, fase, estado, goles_a, goles_b, logo_a, logo_b]);
                    console.log(`➕ Insertado: ${equipo_a} vs ${equipo_b}`);
                }
            }

            await client.query('COMMIT');
            console.log('✅ Sincronización completada con éxito.');

        } catch (dbError) {
            await client.query('ROLLBACK');
            console.error('❌ Error en la base de datos:', dbError);
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('❌ Error en la petición a la API:', error.message);
        if (error.response) {
            console.error('Detalles:', error.response.data);
        }
    } finally {
        await pool.end();
    }
}

syncMatches();
