const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
    connectionString: process.env.DATABASE_URL || 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f',
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(poolConfig);

async function fixMockData() {
    const client = await pool.connect();
    try {
        console.log('🔄 Corrigiendo logos de partidos de prueba...');

        // Mapeo de correcciones (Equipo -> URL Logo)
        // IDs basados en lo observado: 
        // 1: Arg vs Mex
        // 2: Bra vs Col
        // 3: Esp vs Ita
        // 4: Ale vs Fra (Invertidos)
        // 5: Ing vs Por
        // 6: Uru vs Chi

        const updates = [
            {
                equipo_a: 'Argentina', logo_a: 'https://media.api-sports.io/football/teams/26.png',
                equipo_b: 'México', logo_b: 'https://media.api-sports.io/football/teams/16.png'
            },
            {
                equipo_a: 'Brasil', logo_a: 'https://media.api-sports.io/football/teams/6.png',
                equipo_b: 'Colombia', logo_b: 'https://media.api-sports.io/football/teams/8.png'
            },
            {
                equipo_a: 'España', logo_a: 'https://media.api-sports.io/football/teams/9.png',
                equipo_b: 'Italia', logo_b: 'https://media.api-sports.io/football/teams/768.png'
            },
            {
                equipo_a: 'Alemania', logo_a: 'https://media.api-sports.io/football/teams/25.png',
                equipo_b: 'Francia', logo_b: 'https://media.api-sports.io/football/teams/2.png'
            },
            {
                equipo_a: 'Inglaterra', logo_a: 'https://media.api-sports.io/football/teams/10.png',
                equipo_b: 'Portugal', logo_b: 'https://media.api-sports.io/football/teams/27.png'
            },
            {
                equipo_a: 'Uruguay', logo_a: 'https://media.api-sports.io/football/teams/7.png',
                equipo_b: 'Chile', logo_b: 'https://media.api-sports.io/football/teams/5.png'
            }
        ];

        for (const update of updates) {
            const query = `
                UPDATE partidos 
                SET logo_a = $1, logo_b = $2
                WHERE equipo_a = $3 AND equipo_b = $4
            `;
            const res = await client.query(query, [update.logo_a, update.logo_b, update.equipo_a, update.equipo_b]);
            if (res.rowCount > 0) {
                console.log(`✅ Actualizado: ${update.equipo_a} vs ${update.equipo_b}`);
            } else {
                console.log(`⚠️ No encontrado para actualizar: ${update.equipo_a} vs ${update.equipo_b}`);
            }
        }

    } catch (err) {
        console.error('❌ Error actualizando datos:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

fixMockData();
