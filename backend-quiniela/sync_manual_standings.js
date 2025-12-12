const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
    connectionString: process.env.DATABASE_URL || 'postgres://admin:sCDzp6H5TGIh9ZO4CUAvjMQH3QCxcPBp@dpg-d4i7m5emcj7s73cen37g-a.oregon-postgres.render.com/quiniela_db_jn3f',
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(poolConfig);

// --- AQUÍ PEGA TUS DATOS ---
const MANUAL_STANDINGS = [
    {
        "grupo": "A",
        "equipos": [
            { "pos": 1, "equipo": "México", "logo": "https://flagcdn.com/w40/mx.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Sudáfrica", "logo": "https://flagcdn.com/w40/za.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Corea del Sur", "logo": "https://flagcdn.com/w40/kr.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Winner Playoff Path D", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "B",
        "equipos": [
            { "pos": 1, "equipo": "Canadá", "logo": "https://flagcdn.com/w40/ca.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Winner Playoff Path A", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Catar", "logo": "https://flagcdn.com/w40/qa.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Suiza", "logo": "https://flagcdn.com/w40/ch.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "C",
        "equipos": [
            { "pos": 1, "equipo": "Brasil", "logo": "https://flagcdn.com/w40/br.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Marruecos", "logo": "https://flagcdn.com/w40/ma.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Haití", "logo": "https://flagcdn.com/w40/ht.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Escocia", "logo": "https://flagcdn.com/w40/gb-sct.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "D",
        "equipos": [
            { "pos": 1, "equipo": "Estados Unidos", "logo": "https://flagcdn.com/w40/us.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Paraguay", "logo": "https://flagcdn.com/w40/py.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Australia", "logo": "https://flagcdn.com/w40/au.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Winner Playoff Path C", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "E",
        "equipos": [
            { "pos": 1, "equipo": "Alemania", "logo": "https://flagcdn.com/w40/de.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Curacao", "logo": "https://flagcdn.com/w40/cw.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Costa de Marfil", "logo": "https://flagcdn.com/w40/ci.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Ecuador", "logo": "https://flagcdn.com/w40/ec.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "F",
        "equipos": [
            { "pos": 1, "equipo": "Países Bajos", "logo": "https://flagcdn.com/w40/nl.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Japón", "logo": "https://flagcdn.com/w40/jp.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Winner Playoff Path B", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Túnez", "logo": "https://flagcdn.com/w40/tn.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "G",
        "equipos": [
            { "pos": 1, "equipo": "Bélgica", "logo": "https://flagcdn.com/w40/be.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Egipto", "logo": "https://flagcdn.com/w40/eg.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Irán", "logo": "https://flagcdn.com/w40/ir.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Nueva Zelanda", "logo": "https://flagcdn.com/w40/nz.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "H",
        "equipos": [
            { "pos": 1, "equipo": "España", "logo": "https://flagcdn.com/w40/es.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Cabo Verde", "logo": "https://flagcdn.com/w40/cv.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Arabia Saudita", "logo": "https://flagcdn.com/w40/sa.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Uruguay", "logo": "https://flagcdn.com/w40/uy.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "I",
        "equipos": [
            { "pos": 1, "equipo": "Francia", "logo": "https://flagcdn.com/w40/fr.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Senegal", "logo": "https://flagcdn.com/w40/sn.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Intercontinental Playoff Path 2", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Noruega", "logo": "https://flagcdn.com/w40/no.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "J",
        "equipos": [
            { "pos": 1, "equipo": "Argentina", "logo": "https://flagcdn.com/w40/ar.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Argelia", "logo": "https://flagcdn.com/w40/dz.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Austria", "logo": "https://flagcdn.com/w40/at.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Jordania", "logo": "https://flagcdn.com/w40/jo.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "K",
        "equipos": [
            { "pos": 1, "equipo": "Portugal", "logo": "https://flagcdn.com/w40/pt.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Intercontinental Playoff Path 1", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Uzbekistán", "logo": "https://flagcdn.com/w40/uz.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Colombia", "logo": "https://flagcdn.com/w40/co.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    },
    {
        "grupo": "L",
        "equipos": [
            { "pos": 1, "equipo": "Inglaterra", "logo": "https://flagcdn.com/w40/gb-eng.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 2, "equipo": "Croacia", "logo": "https://flagcdn.com/w40/hr.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 3, "equipo": "Ghana", "logo": "https://flagcdn.com/w40/gh.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 },
            { "pos": 4, "equipo": "Panamá", "logo": "https://flagcdn.com/w40/pa.png", "pj": 0, "g": 0, "e": 0, "p": 0, "gf": 0, "gc": 0, "dg": 0, "pts": 0 }
        ]
    }
];

async function syncManualStandings() {
    if (MANUAL_STANDINGS.length === 0) {
        console.log('⚠️ No hay datos manuales definidos en la variable MANUAL_STANDINGS.');
        console.log('Por favor, edita este archivo y pega tus datos JSON.');
        await pool.end();
        return;
    }

    const client = await pool.connect();

    try {
        console.log('🔄 Iniciando sincronización manual de posiciones...');
        await client.query('BEGIN');

        // Limpiar tabla antes de insertar (Opcional: si quieres reemplazar todo siempre)
        // await client.query('TRUNCATE TABLE posiciones'); 

        for (const grupoData of MANUAL_STANDINGS) {
            const grupo = grupoData.grupo;
            console.log(`\n🏆 Procesando Grupo ${grupo}...`);

            for (const equipoData of grupoData.equipos) {
                const query = `
                    INSERT INTO posiciones (grupo, posicion, equipo, pj, g, e, p, gf, gc, dg, puntos, logo)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    ON CONFLICT (grupo, equipo) 
                    DO UPDATE SET 
                        posicion = EXCLUDED.posicion,
                        pj = EXCLUDED.pj,
                        g = EXCLUDED.g,
                        e = EXCLUDED.e,
                        p = EXCLUDED.p,
                        gf = EXCLUDED.gf,
                        gc = EXCLUDED.gc,
                        dg = EXCLUDED.dg,
                        puntos = EXCLUDED.puntos,
                        logo = EXCLUDED.logo;
                `;

                // Mapeo flexible por si las claves cambian un poco
                const values = [
                    grupo,
                    equipoData.pos || equipoData.rank || 0,
                    equipoData.equipo || equipoData.team || 'Desconocido',
                    equipoData.pj || equipoData.played || 0,
                    equipoData.g || equipoData.win || 0,
                    equipoData.e || equipoData.draw || 0,
                    equipoData.p || equipoData.lose || 0,
                    equipoData.gf || equipoData.goals_for || 0,
                    equipoData.gc || equipoData.goals_against || 0,
                    equipoData.dg || equipoData.goals_diff || 0,
                    equipoData.pts || equipoData.points || 0,
                    equipoData.logo || null
                ];

                await client.query(query, values);
                console.log(`   - ${values[2]} (${values[10]} pts)`);
            }
        }

        await client.query('COMMIT');
        console.log('\n✅ Sincronización manual completada con éxito.');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error sincronizando:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

syncManualStandings();
