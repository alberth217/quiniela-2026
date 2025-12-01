import React, { useState, useEffect } from 'react';
import { Trophy, Medal, User, Home, BarChart2, Bell, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'https://api-quiniela-444s.onrender.com'; // Ajustado a producción

function Ranking() {
    const navigate = useNavigate();
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }

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

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const getMedalColor = (position) => {
        switch (position) {
            case 1: return 'text-yellow-500';
            case 2: return 'text-gray-400';
            case 3: return 'text-amber-700';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 md:pb-0">
            {/* NAVBAR SUPERIOR */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="/img/logo.png" alt="Logo Quiniela" className="h-12 w-auto object-contain" />
                        <span className="font-bold text-xl tracking-tight text-slate-900">Quiniela 2026</span>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {currentUser && <span className="text-sm font-bold text-blue-900">Hola, {currentUser.nombre}</span>}
                        <Link to="/dashboard" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"><Home size={18} /> Partidos</Link>
                        <Link to="/mis-puntos" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"><BarChart2 size={18} /> Mis Puntos</Link>
                        <Link to="/ranking" className="flex items-center gap-1 text-sm font-semibold text-slate-900"><Trophy size={18} /> Ranking</Link>
                        <button className="text-slate-400 hover:text-slate-600"><Bell size={20} /></button>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"><LogOut size={18} /> Salir</button>
                    </div>

                    <div className="flex md:hidden gap-4">
                        <button onClick={handleLogout} className="text-red-500"><LogOut size={20} /></button>
                    </div>
                </div>
            </nav>

            {/* BARRA INFERIOR MÓVIL */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-6 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"><Home size={24} /><span className="text-[10px] font-medium">Partidos</span></Link>
                <Link to="/mis-puntos" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"><BarChart2 size={24} /><span className="text-[10px] font-medium">Puntos</span></Link>
                <Link to="/ranking" className="flex flex-col items-center gap-1 text-blue-600 transition-colors"><Trophy size={24} /><span className="text-[10px] font-bold">Ranking</span></Link>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Ranking Global</h1>
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
            </main>
        </div>
    );
}

export default Ranking;
