import React, { useState, useEffect } from 'react';
import { Search, Loader, Calendar, Shield } from 'lucide-react';
import config from './config';
import MatchCard from './MatchCard';

const { API_URL } = config;

const Partidos = () => {
    // Estados de Datos
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados de Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState('Todas');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const matchesRes = await fetch(`${API_URL}/partidos`);
                if (matchesRes.ok) {
                    const matchesData = await matchesRes.json();
                    setMatches(matchesData);
                }
            } catch (error) {
                console.error("Error cargando calendario:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- LÓGICA DE FILTRADO ---
    const filteredMatches = matches.filter(match => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            (match.equipo_a || '').toLowerCase().includes(searchLower) ||
            (match.equipo_b || '').toLowerCase().includes(searchLower);

        // Mapping simple filters to actual match phases if needed, or exact match
        const matchesStage = filterStage === 'Todas' ||
            (match.fase === filterStage) ||
            (filterStage === 'Fase de Grupos' && match.fase && match.fase.includes('Grupo'));

        return matchesSearch && matchesStage;
    });

    return (
        <div className="p-4 md:p-8 min-h-screen pb-12">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Calendar className="text-blue-600" />
                    Calendario Oficial
                </h1>
                <p className="text-slate-500 text-sm mt-1">Consulta los horarios y resultados de todos los partidos del torneo.</p>
            </div>

            {/* BARRA DE HERRAMIENTAS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-2 rounded-xl border border-slate-200 shadow-sm sticky top-20 z-40">
                <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide gap-1">
                    {['Todas', 'Fase de Grupos', 'Octavos', 'Cuartos', 'Semifinal', 'Final'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterStage(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filterStage === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar país..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* GRID DE PARTIDOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400">
                        <Loader size={40} className="animate-spin mb-4 text-blue-600" />
                        <p>Cargando calendario...</p>
                    </div>
                ) : filteredMatches.length > 0 ? (
                    filteredMatches.map((match) => (
                        <MatchCard
                            key={match.id}
                            match={match}
                            readOnly={true} // MODO LECTURA
                            existingPrediction={null}
                            unsavedPrediction={null}
                            onChange={() => { }}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <Shield size={48} className="mx-auto text-slate-200 mb-3" />
                        <p className="text-slate-500 font-medium">No se encontraron partidos.</p>
                        <button onClick={() => { setSearchTerm(''); setFilterStage('Todas') }} className="text-blue-600 text-sm font-bold mt-2 hover:underline">Limpiar filtros</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Partidos;
