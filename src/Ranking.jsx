import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';
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

    const TopPodium = ({ user, rank }) => {
        if (!user) return <div className="hidden md:flex flex-1"></div>;

        let bgColor, height, iconColor, delay;
        if (rank === 1) { bgColor = 'bg-yellow-100 border-yellow-300'; height = 'h-48 md:h-64'; iconColor = 'text-yellow-500'; delay = 'delay-200'; }
        if (rank === 2) { bgColor = 'bg-slate-100 border-slate-300'; height = 'h-40 md:h-52'; iconColor = 'text-slate-400'; delay = 'delay-100'; }
        if (rank === 3) { bgColor = 'bg-amber-100 border-amber-300'; height = 'h-36 md:h-44'; iconColor = 'text-amber-600'; delay = 'delay-300'; }

        return (
            <div className={`flex flex-col items-center justify-end ${rank === 1 ? 'order-2 -mt-4 z-10' : rank === 2 ? 'order-1' : 'order-3'} animate-fade-in-up ${delay} flex-1 min-w-[30%] md:min-w-0`}>
                <div className="relative mb-2">
                    {rank === 1 && <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-500 fill-yellow-500 animate-bounce" size={32} />}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${rank === 1 ? 'border-yellow-400' : rank === 2 ? 'border-slate-300' : 'border-amber-400'} shadow-lg overflow-hidden`}>
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                            {user.nombre.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md ${rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-slate-400' : 'bg-amber-600'}`}>
                        {rank}
                    </div>
                </div>

                <div className={`w-full ${height} ${bgColor} rounded-t-2xl border-t border-x shadow-sm p-4 flex flex-col items-center justify-start pt-8 text-center`}>
                    <p className="font-bold text-slate-800 text-sm md:text-base leading-tight mb-1 truncate w-full px-2">{user.nombre}</p>
                    <span className="font-black text-xl md:text-2xl text-slate-900">{user.puntos}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Puntos</span>
                </div>
            </div>
        )
    };

    return (
        <div className="p-4 md:p-8 min-h-screen pb-20">
            {/* HEADER */}
            <div className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Ranking Global</h1>
                <p className="text-slate-500 max-w-lg mx-auto">Compite contra los mejores pronosticadores. ¿Tienes lo necesario para llegar al podio?</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {/* PODIUM */}
                    <div className="flex justify-center items-end gap-2 md:gap-4 mb-8 md:mb-12 px-2">
                        <TopPodium user={ranking[1]} rank={2} />
                        <TopPodium user={ranking[0]} rank={1} />
                        <TopPodium user={ranking[2]} rank={3} />
                    </div>

                    {/* LISTA */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="px-4 py-4 text-center w-16">#</th>
                                        <th className="px-4 py-4">Usuario</th>
                                        <th className="px-4 py-4 text-center hidden sm:table-cell">Aciertos</th>
                                        <th className="px-4 py-4 text-right">Puntos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {ranking.slice(3).map((user) => {
                                        const isCurrentUser = currentUser && user.id === currentUser.id;
                                        return (
                                            <tr key={user.id} className={`transition-all ${isCurrentUser ? 'bg-blue-50 hover:bg-blue-100 scale-[1.01] shadow-sm z-10 relative' : 'hover:bg-slate-50'}`}>
                                                <td className="px-4 py-4 text-center font-bold text-slate-400">
                                                    {user.posicion}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isCurrentUser ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
                                                            {user.nombre.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className={`font-bold text-sm ${isCurrentUser ? 'text-blue-900' : 'text-slate-700'}`}>
                                                                {user.nombre} {isCurrentUser && <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-blue-200 text-blue-800 ml-1">Tú</span>}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center text-slate-500 font-medium hidden sm:table-cell">
                                                    {user.aciertos || 0}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <span className={`font-black text-lg ${isCurrentUser ? 'text-blue-600 points-glow' : 'text-slate-800'}`}>
                                                        {user.puntos}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {ranking.length === 0 && (
                            <div className="p-12 text-center text-slate-400">
                                <Trophy size={48} className="mx-auto mb-4 text-slate-200" />
                                <p>Aún no hay puntos registrados.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Ranking;
