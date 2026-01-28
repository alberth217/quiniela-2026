import React, { useState } from 'react';
import { Search, Loader, Calendar, Shield, Table } from 'lucide-react';
import MatchCard from './MatchCard';
import usePartidos from './hooks/usePartidos';
import GroupStandings from './GroupStandings';

const Partidos = () => {
    // Shared Logic Hook
    const {
        filteredMatches,
        loading,
        filterStage,
        setFilterStage,
        searchTerm,
        setSearchTerm
    } = usePartidos();

    const [view, setView] = useState('matches'); // 'matches' | 'tables'

    return (
        <div className="p-4 md:p-8 min-h-screen pb-12">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Calendar className="text-blue-600" />
                    Calendario Oficial
                </h1>
                <p className="text-slate-500 text-sm mt-1">Consulta los horarios, resultados y tablas de posiciones.</p>
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setView('matches')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'matches' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Calendar size={16} /> Partidos
                </button>
                <button
                    onClick={() => setView('tables')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'tables' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Table size={16} /> Tablas
                </button>
            </div>

            {view === 'matches' ? (
                <>
                    {/* BARRA DE HERRAMIENTAS - REUSED DESIGN */}
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
                </>
            ) : (
                <GroupStandings />
            )}
        </div>
    );
};

export default Partidos;
