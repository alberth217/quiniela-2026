import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import config from './config';

const { API_URL } = config;

const DashboardHome = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ PredictionsCount: 0, Points: 0, Ranking: '-' });
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(userStr);
        setCurrentUser(user);

        const fetchData = async () => {
            try {
                // Fetch predictions to count them
                const predictionsRes = await fetch(`${API_URL}/predicciones`);
                if (predictionsRes.ok) {
                    const allPredictions = await predictionsRes.json();
                    const myPredictions = allPredictions.filter(p => p.usuario_id === user.id);
                    // Mock points/ranking for now or fetch if available
                    // const rankingRes = await fetch(`${API_URL}/ranking/${user.id}`); 
                    setStats(prev => ({ ...prev, PredictionsCount: myPredictions.length }));
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    if (loading) return <div className="flex justify-center p-12"><Loader className="animate-spin text-blue-600" /></div>;

    return (
        <div className="p-4 md:p-8">
            {/* BANNER MODERNO */}
            <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-10 mb-8 text-white overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 text-xs font-bold text-blue-200 mb-3">
                            <TrendingUp size={14} /> Mundial 2026
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Hola, {currentUser?.nombre}</h1>
                        <p className="text-blue-200 text-lg">
                            Llevas <strong className="text-white">{stats.PredictionsCount}</strong> predicciones realizadas. ¡Completa la fase de grupos!
                        </p>
                    </div>

                    {/* Estadísticas Flotantes */}
                    <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl min-w-[140px] flex flex-col items-center justify-center text-center">
                            <span className="text-slate-300 text-xs font-bold uppercase mb-1">Tu Ranking</span>
                            <span className="text-3xl font-black text-yellow-400">#42</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl min-w-[140px] flex flex-col items-center justify-center text-center">
                            <span className="text-slate-300 text-xs font-bold uppercase mb-1">Puntos</span>
                            <span className="text-3xl font-black text-white">1,250</span>
                        </div>
                        <Link to="/ranking" className="bg-blue-600/80 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl min-w-[140px] flex flex-col items-center justify-center text-center shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
                            <Star size={20} className="text-white mb-1" />
                            <span className="text-sm font-bold text-white">Ver Ranking &rarr;</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Link to="/predicciones" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Realizar Predicciones &rarr;</h3>
                    <p className="text-slate-500">Consulta los partidos y guarda tus resultados para sumar puntos.</p>
                </Link>
                <Link to="/reglas" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Ver Reglas &rarr;</h3>
                    <p className="text-slate-500">Conoce el sistema de puntuación y los premios disponibles.</p>
                </Link>
            </div>
        </div>
    );
};

export default DashboardHome;
