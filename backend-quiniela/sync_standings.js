const axios = require('axios');
require('dotenv').config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const API_URL = 'https://api-football-v1.p.rapidapi.com/v3/standings';

async function syncStandings() {
    if (!RAPIDAPI_KEY) {
        console.error('❌ Error: RAPIDAPI_KEY no está definida en las variables de entorno.');
        process.exit(1);
    }

    try {
        console.log('🔄 Conectando a API-Football (Standings)...');

        const options = {
            method: 'GET',
            url: API_URL,
            params: {
                league: '1', // Copa del Mundo
                season: '2026'
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);

        // Validation logic
        if (!response.data || !response.data.response || response.data.response.length === 0) {
            console.log('⚠️ No se encontraron tablas de posiciones.');
            // Debug info
            console.log("Respuesta API:", JSON.stringify(response.data, null, 2));
            return;
        }

        const leagueData = response.data.response[0].league;
        const standings = leagueData.standings;

        console.log(`✅ Datos obtenidos: ${leagueData.name} - ${leagueData.season}`);

        // Iterate through each group (standings is an array of arrays)
        standings.forEach((group, index) => {
            if (group.length > 0) {
                const groupName = group[0].group;
                console.log(`\n🏆 ${groupName}`);

                const tableData = group.map(teamData => ({
                    'Pos': teamData.rank,
                    'Equipo': teamData.team.name,
                    'PJ': teamData.all.played,
                    'G': teamData.all.win,
                    'E': teamData.all.draw,
                    'P': teamData.all.lose,
                    'GF': teamData.all.goals.for,
                    'GC': teamData.all.goals.against,
                    'DG': teamData.goalsDiff,
                    'Pts': teamData.points
                }));

                console.table(tableData);
            }
        });

    } catch (error) {
        console.error('❌ Error en la petición a la API:', error.message);
        if (error.response) {
            console.error('Detalles:', error.response.data);
        }
    }
}

syncStandings();
