import React, { useState, useEffect } from 'react';
import { Save, Lock, Check, Loader, Trophy, Home, BarChart2, Bell, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'https://api-quiniela-444s.onrender.com'; // Ajustado a producción

function Admin() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
        fetchMatches();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const fetchMatches = async () => {
        try {
            const res = await fetch(`${API_URL}/partidos`);
            const data = await res.json();
            setMatches(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMatch = async (id, golesA, golesB) => {
        if (golesA === '' || golesB === '') return alert("Ingresa ambos goles");

        try {
            const res = await fetch(`${API_URL}/admin/partidos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goles_a: golesA, goles_b: golesB })
            });

            if (res.ok) {
                alert("Partido actualizado y finalizado");
                fetchMatches(); // Recargar
            } else {
                alert("Error al actualizar");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 md:pb-0">
            {/* NAVBAR SUPERIOR */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src="/img/logo.png" alt="Logo Quiniela" className="h-12 w-auto object-contain" />
                        <div className="flex items-center gap-2 text-slate-900">
                            <Shield size={24} className="text-blue-600" />
                            <span className="font-bold text-xl tracking-tight">Admin Panel</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {currentUser && <span className="text-sm font-bold text-blue-900">Hola, {currentUser.nombre}</span>}
                        <Link to="/dashboard" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"><Home size={18} /> Volver a Quiniela</Link>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"><LogOut size={18} /> Salir</button>
                    </div>

                    <div className="flex md:hidden gap-4">
                        <button onClick={handleLogout} className="text-red-500"><LogOut size={20} /></button>
                    </div>
                </div>
            </nav>

            {/* BARRA INFERIOR MÓVIL (Solo volver) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-6 py-3 flex justify-center items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Link to="/dashboard" className="flex flex-col items-center gap-1 text-blue-600 transition-colors"><Home size={24} /><span className="text-[10px] font-bold">Volver a Quiniela</span></Link>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Gestión de Resultados</h1>
                    <p className="text-slate-500 text-sm">Actualiza los marcadores para calcular los puntos de los usuarios.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-bold text-slate-800">Partidos</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-slate-400">Cargando partidos...</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {matches.map((match) => (
                                <AdminMatchRow key={match.id} match={match} onUpdate={handleUpdateMatch} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function AdminMatchRow({ match, onUpdate }) {
    const [golesA, setGolesA] = useState(match.goles_a !== null ? match.goles_a : '');
    const [golesB, setGolesB] = useState(match.goles_b !== null ? match.goles_b : '');
    const [isFinalized, setIsFinalized] = useState(match.estado === 'finalizado');

    const handleSave = () => {
        if (window.confirm(`¿Confirmar resultado ${match.equipo_a} ${golesA} - ${golesB} ${match.equipo_b}? Esto finalizará el partido.`)) {
            onUpdate(match.id, golesA, golesB);
        }
    };

    return (
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
            <div className="flex-1 flex items-center gap-4">
                <div className="text-xs font-bold text-slate-400 w-8 text-center">{match.id}</div>
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{match.equipo_a} vs {match.equipo_b}</span>
                    <span className="text-xs text-slate-500">{match.fecha} - {match.hora}</span>
                </div>
                {isFinalized && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Finalizado</span>}
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={golesA}
                        onChange={(e) => setGolesA(e.target.value)}
                        disabled={isFinalized}
                        className="w-12 h-10 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 disabled:bg-slate-100"
                        placeholder="-"
                    />
                    <span className="text-slate-300">-</span>
                    <input
                        type="number"
                        value={golesB}
                        onChange={(e) => setGolesB(e.target.value)}
                        disabled={isFinalized}
                        className="w-12 h-10 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 disabled:bg-slate-100"
                        placeholder="-"
                    />
                </div>

                {isFinalized ? (
                    <button disabled className="bg-slate-100 text-slate-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-slate-200 cursor-not-allowed">
                        <Lock size={16} /> Cerrado
                    </button>
                ) : (
                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                        <Save size={16} /> Guardar
                    </button>
                )}
            </div>
        </div>
    );
}

export default Admin;
