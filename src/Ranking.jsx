import React, { useState, useEffect } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import config from './config';

const { API_URL } = config;

function Ranking() {
    const { currentUser } = useOutletContext();
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/ranking`)
            .then(res => res.json())
            .then(data => {
                setRanking(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const getMedalColor = (position) => {
        switch (position) {
            case 1: return 'text-yellow-500';
            case 2: return 'text-gray-400';
            case 3: return 'text-amber-700';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-900">Ranking Global</h1>
                <p className="text-slate-500 text-sm">Compite con otros usuarios y demuestra quién sabe más.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={20} />
                    <h2 className="font-bold text-slate-800">Tabla de Posiciones</h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-400">Cargando ranking...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Pos</th>
                                    <th className="px-6 py-3">Usuario</th>
                                    <th className="px-6 py-3 text-center">Aciertos</th>
                                    <th className="px-6 py-3 text-right">Puntos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {ranking.map((user) => {
                                    const isCurrentUser = currentUser && user.id === currentUser.id;
                                    return (
                                        <tr key={user.id} className={`transition-colors ${isCurrentUser ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'}`}>
                                            <td className="px-6 py-4">
                                                <div className={`font-bold flex items-center gap-2 ${getMedalColor(user.posicion)}`}>
                                                    {user.posicion <= 3 ? <Medal size={18} /> : <span className="w-4 text-center text-slate-500">{user.posicion}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                        {user.nombre.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className={`font-medium ${isCurrentUser ? 'text-blue-900' : 'text-slate-700'}`}>
                                                        {user.nombre} {isCurrentUser && '(Tú)'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-500">
                                                {user.aciertos || 0}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-blue-600">
                                                {user.puntos}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {ranking.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                                            Aún no hay puntos registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Ranking;
