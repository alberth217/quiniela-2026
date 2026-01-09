const { Pool } = require('pg');

// CARGAR URL DESDE EL ARCHIVO .ENV LOCAL SI EXISTE
const fs = require('fs');
const path = require('path');

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    try {
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/DATABASE_URL=(.*)/);
            if (match) connectionString = match[1].trim();
        }
    } catch (e) {
        console.log("No se pudo leer .env");
    }
}

if (!connectionString) {
    console.error("❌ ERROR: No se encontró DATABASE_URL");
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

const MANUAL_STANDINGS = [
    {
        "grupo": "A",
        "equipos": [
            { "pos": 1, "equipo": "México", "logo": "https://flagcdn.com/w40/mx.png" },
            { "pos": 2, "equipo": "Sudáfrica", "logo": "https://flagcdn.com/w40/za.png" },
            { "pos": 3, "equipo": "Corea del Sur", "logo": "https://flagcdn.com/w40/kr.png" },
            { "pos": 4, "equipo": "Winner Playoff Path D", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg" }
        ]
    },
    {
        "grupo": "B",
        "equipos": [
            { "pos": 1, "equipo": "Canadá", "logo": "https://flagcdn.com/w40/ca.png" },
            { "pos": 2, "equipo": "Winner Playoff Path A", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg" },
            { "pos": 3, "equipo": "Catar", "logo": "https://flagcdn.com/w40/qa.png" },
            { "pos": 4, "equipo": "Suiza", "logo": "https://flagcdn.com/w40/ch.png" }
        ]
    },
    {
        "grupo": "C",
        "equipos": [
            { "pos": 1, "equipo": "Brasil", "logo": "https://flagcdn.com/w40/br.png" },
            { "pos": 2, "equipo": "Marruecos", "logo": "https://flagcdn.com/w40/ma.png" },
            { "pos": 3, "equipo": "Haití", "logo": "https://flagcdn.com/w40/ht.png" },
            { "pos": 4, "equipo": "Escocia", "logo": "https://flagcdn.com/w40/gb-sct.png" }
        ]
    },
    {
        "grupo": "D",
        "equipos": [
            { "pos": 1, "equipo": "Estados Unidos", "logo": "https://flagcdn.com/w40/us.png" },
            { "pos": 2, "equipo": "Paraguay", "logo": "https://flagcdn.com/w40/py.png" },
            { "pos": 3, "equipo": "Australia", "logo": "https://flagcdn.com/w40/au.png" },
            { "pos": 4, "equipo": "Winner Playoff Path C", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg" }
        ]
    },
    {
        "grupo": "E",
        "equipos": [
            { "pos": 1, "equipo": "Alemania", "logo": "https://flagcdn.com/w40/de.png" },
            { "pos": 2, "equipo": "Curacao", "logo": "https://flagcdn.com/w40/cw.png" },
            { "pos": 3, "equipo": "Costa de Marfil", "logo": "https://flagcdn.com/w40/ci.png" },
            { "pos": 4, "equipo": "Ecuador", "logo": "https://flagcdn.com/w40/ec.png" }
        ]
    },
    {
        "grupo": "F",
        "equipos": [
            { "pos": 1, "equipo": "Países Bajos", "logo": "https://flagcdn.com/w40/nl.png" },
            { "pos": 2, "equipo": "Japón", "logo": "https://flagcdn.com/w40/jp.png" },
            { "pos": 3, "equipo": "Winner Playoff Path B", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg" },
            { "pos": 4, "equipo": "Túnez", "logo": "https://flagcdn.com/w40/tn.png" }
        ]
    },
    {
        "grupo": "G",
        "equipos": [
            { "pos": 1, "equipo": "Bélgica", "logo": "https://flagcdn.com/w40/be.png" },
            { "pos": 2, "equipo": "Egipto", "logo": "https://flagcdn.com/w40/eg.png" },
            { "pos": 3, "equipo": "Irán", "logo": "https://flagcdn.com/w40/ir.png" },
            { "pos": 4, "equipo": "Nueva Zelanda", "logo": "https://flagcdn.com/w40/nz.png" }
        ]
    },
    {
        "grupo": "H",
        "equipos": [
            { "pos": 1, "equipo": "España", "logo": "https://flagcdn.com/w40/es.png" },
            { "pos": 2, "equipo": "Cabo Verde", "logo": "https://flagcdn.com/w40/cv.png" },
            { "pos": 3, "equipo": "Arabia Saudita", "logo": "https://flagcdn.com/w40/sa.png" },
            { "pos": 4, "equipo": "Uruguay", "logo": "https://flagcdn.com/w40/uy.png" }
        ]
    },
    {
        "grupo": "I",
        "equipos": [
            { "pos": 1, "equipo": "Francia", "logo": "https://flagcdn.com/w40/fr.png" },
            { "pos": 2, "equipo": "Senegal", "logo": "https://flagcdn.com/w40/sn.png" },
            { "pos": 3, "equipo": "Intercontinental Playoff Path 2", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg" },
            { "pos": 4, "equipo": "Noruega", "logo": "https://flagcdn.com/w40/no.png" }
        ]
    },
    {
        "grupo": "J",
        "equipos": [
            { "pos": 1, "equipo": "Argentina", "logo": "https://flagcdn.com/w40/ar.png" },
            { "pos": 2, "equipo": "Argelia", "logo": "https://flagcdn.com/w40/dz.png" },
            { "pos": 3, "equipo": "Austria", "logo": "https://flagcdn.com/w40/at.png" },
            { "pos": 4, "equipo": "Jordania", "logo": "https://flagcdn.com/w40/jo.png" }
        ]
    },
    {
        "grupo": "K",
        "equipos": [
            { "pos": 1, "equipo": "Portugal", "logo": "https://flagcdn.com/w40/pt.png" },
            { "pos": 2, "equipo": "Intercontinental Playoff Path 1", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a1/FIFA_World_Cup_2026_logo.svg" },
            { "pos": 3, "equipo": "Uzbekistán", "logo": "https://flagcdn.com/w40/uz.png" },
            { "pos": 4, "equipo": "Colombia", "logo": "https://flagcdn.com/w40/co.png" }
        ]
    },
    {
        "grupo": "L",
        "equipos": [
            { "pos": 1, "equipo": "Inglaterra", "logo": "https://flagcdn.com/w40/gb-eng.png" },
            { "pos": 2, "equipo": "Croacia", "logo": "https://flagcdn.com/w40/hr.png" },
            { "pos": 3, "equipo": "Ghana", "logo": "https://flagcdn.com/w40/gh.png" },
            { "pos": 4, "equipo": "Panamá", "logo": "https://flagcdn.com/w40/pa.png" }
        ]
    }
];

async function seed() {
    console.log("🌱 Iniciando siembra de grupos...");
    for (const data of MANUAL_STANDINGS) {
        console.log(`\n🏆 Grupo ${data.grupo}`);
        for (const team of data.equipos) {
            await pool.query(
                `INSERT INTO posiciones (grupo, posicion, equipo, logo) 
                 VALUES ($1, $2, $3, $4) 
                 ON CONFLICT (grupo, equipo) DO UPDATE SET logo = EXCLUDED.logo`,
                [data.grupo, team.pos, team.equipo, team.logo]
            );
            console.log(`   - ${team.equipo} listo`);
        }
    }
    console.log("\n✅ ¡Todos los grupos sembrados!");
    await pool.end();
}

seed();
