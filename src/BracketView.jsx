import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';

// --- DATOS MOCK ---
const generateMatches = (count, roundId) => {
    return Array(count).fill(null).map((_, i) => ({
        id: `${roundId}-${i + 1}`,
        home: 'Por definirse',
        away: 'Por definirse',
        score: null
    }));
};

const roundsData = [
    { id: '16avos', title: '16avos de Final', matches: generateMatches(16, 'R16') },
    { id: '8avos', title: 'Octavos de Final', matches: generateMatches(8, 'R8') },
    { id: '4tos', title: 'Cuartos de Final', matches: generateMatches(4, 'R4') },
    { id: 'semi', title: 'Semifinal', matches: generateMatches(2, 'SF') },
    { id: 'final', title: 'Final', matches: generateMatches(1, 'F') }
];

// --- COMPONENTE DE TARJETA DE PARTIDO ---
const MatchCard = ({ match, heightClass }) => (
    <div
        className={`flex flex-col justify-center bg-white border-l-4 border-slate-200 rounded-r-lg shadow-sm p-3 w-48 relative transition-transform hover:scale-105 hover:shadow-md cursor-pointer group ${heightClass}`}
    >
        {/* Conector Izquierdo (Entrada) - Solo visual si no es la primera ronda */}

        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Shield size={16} className="text-slate-300" />
                <span className="text-xs font-bold text-slate-500 truncate">{match.home}</span>
            </div>
            <div className="flex items-center gap-2">
                <Shield size={16} className="text-slate-300" />
                <span className="text-xs font-bold text-slate-500 truncate">{match.away}</span>
            </div>
        </div>

        {/* Línea conectora Derecha (Salida) */}
        {/* Esta lógica se manejará mejor con SVGs entre columnas, pero dejamos un indicador visual */}
    </div>
);

// --- COMPONENTE DE LÍNEAS CONECTORAS ENTRE COLUMNAS ---
const ConnectorsLayer = ({ count }) => {
    // Generamos SVGs que conectan 2 items de la izquierda con 1 de la derecha
    // Esto asume una distribución uniforme "justify-around"
    // Es un truco visual: Dibujar 'count' llaves.
    // 'count' es el número de partidos en la columna DERECHA (Target).
    // Cada partido de la derecha conecta con 2 de la izquierda.

    return (
        <div className="hidden md:flex flex-col justify-around h-full w-8 -mx-1 z-0">
            {Array(count).fill(null).map((_, i) => (
                <div key={i} className="flex items-center h-full">
                    <svg width="100%" height="100%" viewBox="0 0 40 100" preserveAspectRatio="none" className="text-slate-300">
                        <path d="M0,25 C20,25 20,50 40,50" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                        <path d="M0,75 C20,75 20,50 40,50" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>
            ))}
        </div>
    );
};


function BracketView() {
    const [startIndex, setStartIndex] = useState(0);
    const maxIndex = roundsData.length - 3; // Mostrar 3 columnas a la vez

    const handleNext = () => {
        if (startIndex < maxIndex) setStartIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (startIndex > 0) setStartIndex(prev => prev - 1);
    };

    // Obtenemos las 3 columnas visibles
    const visibleRounds = roundsData.slice(startIndex, startIndex + 3);

    // Clase de altura para distribuir uniformemente (Trick CSS)
    // Siempre usamos h-full en el contenedor padre y justify-around

    return (
        <div className="bg-slate-50 rounded-2xl p-4 md:p-8 border border-slate-200">

            {/* Controles de Navegación del Carousel */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handlePrev}
                    disabled={startIndex === 0}
                    className={`p-2 rounded-full transition-colors ${startIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'bg-white text-blue-600 shadow-md hover:bg-blue-50'}`}
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                    {roundsData.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 w-2 rounded-full transition-colors ${idx >= startIndex && idx < startIndex + 3 ? 'bg-blue-600' : 'bg-slate-300'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={startIndex >= maxIndex}
                    className={`p-2 rounded-full transition-colors ${startIndex >= maxIndex ? 'text-slate-300 cursor-not-allowed' : 'bg-white text-blue-600 shadow-md hover:bg-blue-50'}`}
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* ÁREA DEL BRACKET (CAROUSEL) */}
            <div className="relative overflow-hidden min-h-[600px] flex items-stretch">

                {visibleRounds.map((round, idx) => (
                    <React.Fragment key={round.id}>

                        {/* Columna de Partidos */}
                        <div className={`flex-1 flex flex-col items-center animate-fade-in duration-500`}>
                            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-6 text-center">
                                {round.title}
                            </h3>

                            <div className="flex flex-col justify-around h-full w-full items-center">
                                {round.matches.map((match) => (
                                    <MatchCard key={match.id} match={match} />
                                ))}
                            </div>
                        </div>

                        {/* Conectores (Solo entre columnas, no después de la última visible) */}
                        {idx < visibleRounds.length - 1 && (
                            <div className="w-10 flex flex-col justify-center">
                                {/* Renderizar conectores basados en la siguiente ronda */}
                                {/* Truco: Si la siguiente ronda tiene N partidos, necesitamos N conectores tipo 'tenedor' */}
                                <ConnectorsLayer count={visibleRounds[idx + 1].matches.length} />
                            </div>
                        )}

                    </React.Fragment>
                ))}

            </div>
            <div className="mt-4 text-center text-slate-400 text-xs text-opacity-70">
                * Proyección basada en el cuadro oficial
            </div>
        </div>
    );
}

export default BracketView;
