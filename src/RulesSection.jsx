import React from 'react';
import { Ticket, Trophy, Calendar, CheckCircle } from 'lucide-react';

function RulesSection() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 my-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Reglas del Juego</h2>
                <p className="text-slate-500 mt-2">Todo lo que necesitas saber para ganar.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Regla 1: Tickets */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mb-4">
                        <Ticket size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Tickets y Costos</h3>
                    <p className="text-sm text-slate-600">
                        El costo es de <span className="font-bold text-blue-700">$25 USD</span> por fase.
                        <br />
                        <span className="text-xs mt-2 block bg-blue-100 text-blue-800 px-2 py-1 rounded-full w-fit mx-auto">Máximo 2 tickets por usuario</span>
                    </p>
                </div>

                {/* Regla 2: Puntos */}
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-yellow-600 shadow-sm mb-4">
                        <Trophy size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Sistema de Puntos</h3>
                    <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-center gap-2 justify-center">
                            <CheckCircle size={14} className="text-green-500" />
                            <span><span className="font-bold text-yellow-700">+3</span> Marcador Exacto</span>
                        </li>
                        <li className="flex items-center gap-2 justify-center">
                            <CheckCircle size={14} className="text-blue-500" />
                            <span><span className="font-bold text-yellow-700">+1</span> Ganador / Empate</span>
                        </li>
                    </ul>
                </div>

                {/* Regla 3: Fases */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm mb-4">
                        <Calendar size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Fases del Torneo</h3>
                    <p className="text-sm text-slate-600">
                        La quiniela se juega por etapas:
                        <br />
                        <span className="font-medium">Fase de Grupos, Octavos, Cuartos, Semifinal y Final.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RulesSection;
