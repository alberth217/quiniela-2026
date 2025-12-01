import React, { useState, useEffect } from 'react';
import { BarChart2, CheckCircle, XCircle, Clock, AlertCircle, Home, Trophy, Bell, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'https://api-quiniela-444s.onrender.com'; // Ajustado a producción

function MisPuntos() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);

            fetch(`${API_URL}/mis-puntos/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setHistory(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pleno': return <CheckCircle className="text-green-500" size={20} />;
            case 'Acertado': return <CheckCircle className="text-blue-500" size={20} />;
            case 'Fallado': return <XCircle className="text-red-500" size={20} />;
            default: return <Clock className="text-slate-400" size={20} />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Pleno': return <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full border border-green-100">¡Pleno! (+3)</span>;
            case 'Acertado': return <span className="text-blue-600 font-bold text-xs bg-blue-50 px-2 py-1 rounded-full border border-blue-100">Acierto (+1)</span>;
            case 'Fallado': return <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-full border border-red-100">Fallado (0)</span>;
            default: return <span className="text-slate-500 font-medium text-xs bg-slate-100 px-2 py-1 rounded-full">Pendiente</span>;
        }
    };

    const totalPuntos = history.reduce((acc, curr) => acc + curr.puntos, 0);
    const totalAciertos = history.filter(h => h.estado_resultado === 'Acertado' || h.estado_resultado === 'Pleno').length;
    const totalFallos = history.filter(h => h.estado_resultado === 'Fallado').length;

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
                        <Link to="/mis-puntos" className="flex items-center gap-1 text-sm font-semibold text-slate-900"><BarChart2 size={18} /> Mis Puntos</Link>
                        <Link to="/ranking" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"><Trophy size={18} /> Ranking</Link>
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
                <Link to="/mis-puntos" className="flex flex-col items-center gap-1 text-blue-600 transition-colors"><BarChart2 size={24} /><span className="text-[10px] font-bold">Puntos</span></Link>
                <Link to="/ranking" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"><Trophy size={24} /><span className="text-[10px] font-medium">Ranking</span></Link>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Mi Desempeño</h1>
                    <p className="text-slate-500 text-sm">Resumen de tus predicciones y puntos obtenidos.</p>
                </div>

                <div className="space-y-6">
                    {/* Resumen */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white flex justify-between items-center">
                        <div className="flex gap-8">
                            <div>
                                <h2 className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Total Puntos</h2>
                                <div className="text-4xl font-bold">{totalPuntos}</div>
                            </div>
                            <div className="hidden sm:block w-px bg-white/20"></div>
                            <div className="hidden sm:block">
                                <h2 className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Aciertos</h2>
                                <div className="text-2xl font-bold">{totalAciertos}</div>
                            </div>
                            <div className="hidden sm:block">
                                <h2 className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Fallos</h2>
                                <div className="text-2xl font-bold">{totalFallos}</div>
                            </div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <BarChart2 size={32} className="text-white" />
                        </div>
                    </div>

                    {/* Historial */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800">Historial de Predicciones</h3>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-slate-400">Cargando historial...</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {history.length > 0 ? (
                                    history.map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            {/* Info Partido */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.partido?.estado === 'finalizado' ? 'bg-slate-200 text-slate-600' : 'bg-green-100 text-green-700'}`}>
                                                        {item.partido?.estado === 'finalizado' ? 'Finalizado' : 'En Juego / Por Jugar'}
                                                    </span>
                                                    {item.partido?.estado === 'finalizado' && (
                                                        <span className="text-xs font-mono bg-slate-800 text-white px-1.5 rounded">
                                                            {item.partido.goles_a} - {item.partido.goles_b}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-slate-800">{item.partido?.equipo_a}</span>
                                                    <span className="text-xs text-slate-400">vs</span>
                                                    <span className="font-bold text-slate-800">{item.partido?.equipo_b}</span>
                                                </div>
                                            </div>

                                            {/* Tu Predicción */}
                                            <div className="flex-1 md:text-center">
                                                <div className="text-xs text-slate-400 mb-1">Tu Predicción</div>
                                                <div className="font-medium text-slate-700 bg-slate-100 inline-block px-3 py-1 rounded-lg">
                                                    {item.tipo_prediccion === '1X2' ? item.seleccion : `Marcador: ${item.seleccion}`}
                                                </div>
                                            </div>

                                            {/* Resultado */}
                                            <div className="flex items-center gap-3 md:justify-end min-w-[120px]">
                                                {getStatusIcon(item.estado_resultado)}
                                                {getStatusText(item.estado_resultado)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
                                        <AlertCircle size={32} className="text-slate-300" />
                                        <p>Aún no has hecho predicciones.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MisPuntos;
