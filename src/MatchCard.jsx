import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Lock, Shield } from 'lucide-react';

function MatchCard({ match, existingPrediction, unsavedPrediction, onChange }) {
    const currentData = unsavedPrediction || existingPrediction || {};

    let initialScoreA = '';
    let initialScoreB = '';
    if (currentData.seleccion && currentData.seleccion.includes('-')) {
        const parts = currentData.seleccion.split('-');
        initialScoreA = parts[0];
        initialScoreB = parts[1];
    }

    const [scoreA, setScoreA] = useState(initialScoreA);
    const [scoreB, setScoreB] = useState(initialScoreB);

    useEffect(() => {
        if (scoreA !== '' && scoreB !== '') {
            const valorPrediccion = `${scoreA}-${scoreB}`;
            const dbSel = existingPrediction?.seleccion;
            if (valorPrediccion !== dbSel) {
                onChange(match.id, {
                    tipo_prediccion: 'Marcador',
                    seleccion: valorPrediccion
                });
            }
        }
    }, [scoreA, scoreB]);

    const isFinalized = match.estado === 'finalizado';
    const formatDate = (dateStr) => dateStr;

    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col ${isFinalized ? 'opacity-90 bg-slate-50' : ''}`}>

            {/* HEADER */}
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50/80 border-b border-slate-100">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide">
                    {match.fase || 'Fase de Grupos'}
                </span>
                {isFinalized ? (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Lock size={10} /> Finalizado
                    </span>
                ) : (
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 bg-opacity-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-100">
                        <Clock size={10} /> {match.hora}
                    </span>
                )}
            </div>

            {/* CONTENIDO (Grid simétrico) */}
            <div className="p-5 grid grid-cols-[1fr_auto_1fr] gap-2 items-start">

                {/* EQUIPO A */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-3 group">
                        <div className="absolute inset-0 bg-black/5 rounded-lg transform translate-y-1 translate-x-0 blur-sm"></div>
                        {match.logo_a ? (
                            <img src={match.logo_a} alt={match.equipo_a} className="relative w-14 h-10 md:w-16 md:h-12 object-cover rounded-md shadow-sm border border-white" />
                        ) : (
                            <Shield size={40} className="text-slate-200 relative" />
                        )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 text-center leading-tight h-8 flex items-center justify-center mb-2">
                        {match.equipo_a}
                    </h3>
                    {!isFinalized ? (
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={scoreA}
                            onChange={(e) => setScoreA(e.target.value)}
                            className="w-12 h-10 text-center bg-white border border-slate-200 rounded-lg font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                        />
                    ) : (
                        <span className="text-2xl font-black text-slate-800">{match.goles_a}</span>
                    )}
                </div>

                {/* VS */}
                <div className="flex flex-col items-center justify-start pt-2 px-2">
                    <span className="text-[10px] font-black text-slate-300 uppercase mb-1">VS</span>
                    <div className="flex flex-col items-center gap-1">
                        <Calendar size={12} className="text-slate-300" />
                        <span className="text-[10px] font-medium text-slate-400 text-center leading-tight w-12">
                            {formatDate(match.fecha)}
                        </span>
                    </div>
                </div>

                {/* EQUIPO B */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-3 group">
                        <div className="absolute inset-0 bg-black/5 rounded-lg transform translate-y-1 translate-x-0 blur-sm"></div>
                        {match.logo_b ? (
                            <img src={match.logo_b} alt={match.equipo_b} className="relative w-14 h-10 md:w-16 md:h-12 object-cover rounded-md shadow-sm border border-white" />
                        ) : (
                            <Shield size={40} className="text-slate-200 relative" />
                        )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 text-center leading-tight h-8 flex items-center justify-center mb-2">
                        {match.equipo_b}
                    </h3>
                    {!isFinalized ? (
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={scoreB}
                            onChange={(e) => setScoreB(e.target.value)}
                            className="w-12 h-10 text-center bg-white border border-slate-200 rounded-lg font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                        />
                    ) : (
                        <span className="text-2xl font-black text-slate-800">{match.goles_b}</span>
                    )}
                </div>
            </div>

            {isFinalized && existingPrediction && (
                <div className="bg-slate-50 py-2 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                        Tu Pronóstico: <span className="text-blue-600 text-sm">{existingPrediction.seleccion}</span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default MatchCard;
