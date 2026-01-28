require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const migrate = async () => {
    try {
        console.log("Iniciando migración de puntos...");

        // 1. Agregar columna puntos a tabla predicciones
        await pool.query(`
            ALTER TABLE predicciones 
            ADD COLUMN IF NOT EXISTS puntos INTEGER DEFAULT 0;
        `);
        console.log("✅ Columna 'puntos' agregada/verificada en tabla 'predicciones'.");

        // 2. Opcional: Recalcular puntos para partidos ya finalizados (Backfill)
        // Esto es útil si ya hay partidos finalizados antes de este cambio.
        console.log("Recalculando puntos históricos...");

        const partidos = await pool.query("SELECT * FROM partidos WHERE estado = 'finalizado'");
        const predicciones = await pool.query("SELECT * FROM predicciones");

        for (const pred of predicciones.rows) {
            const partido = partidos.rows.find(p => p.id === pred.partido_id);
            if (partido) {
                let puntos = 0;
                const [predA, predB] = pred.seleccion.split('-').map(Number);
                const realA = partido.goles_a;
                const realB = partido.goles_b;

                if (pred.seleccion === `${realA}-${realB}`) {
                    puntos = 3; // Pleno
                } else {
                    const predWinner = predA > predB ? 'A' : (predA < predB ? 'B' : 'Draw');
                    const realWinner = realA > realB ? 'A' : (realA < realB ? 'B' : 'Draw');
                    if (predWinner === realWinner) {
                        puntos = 1; // Acierto
                    }
                }

                if (puntos > 0) {
                    await pool.query("UPDATE predicciones SET puntos = $1 WHERE id = $2", [puntos, pred.id]);
                }
            }
        }
        console.log("✅ Puntos históricos recalculados.");

        console.log("Migración completada con éxito.");
        process.exit(0);
    } catch (err) {
        console.error("Error en migración:", err);
        process.exit(1);
    }
};

migrate();
