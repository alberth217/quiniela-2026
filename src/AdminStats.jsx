import React, { useState, useEffect } from 'react';
import { Users, CreditCard, DollarSign, TrendingUp, Loader, Shield } from 'lucide-react';
import config from './config';
import { useOutletContext } from 'react-router-dom';

const { API_URL } = config;

const AdminStats = () => {
    const { currentUser } = useOutletContext();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Assuming currentUser has token/id handling via headers automatically or context
                // In this app, we are seemingly passing headers manually in some places or relying on local logic.
                // Based on index.js verifyAdmin, we need 'x-user-id' header.
                const res = await fetch(`${API_URL}/admin/stats`, {
                    headers: {
                        'x-user-id': currentUser.id
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser?.es_admin) {
            fetchStats();
        }
    }, [currentUser]);

    if (loading) return <div className="flex justify-center p-12"><Loader className="animate-spin text-blue-600" /></div>;
    if (!stats) return <div className="text-center p-12 text-slate-500">No hay datos disponibles.</div>;

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-3xl font-black text-slate-900 mb-2">{value}</p>
            {subtext && <p className="text-xs text-slate-400 font-medium">{subtext}</p>}
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
                <div className="bg-slate-900 p-2 rounded-lg">
                    <Shield className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Panel de Rendimiento</h2>
                    <p className="text-slate-500 text-sm">Resumen global de usuarios e ingresos de la quiniela.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Usuarios Totales"
                    value={stats.total_usuarios}
                    icon={Users}
                    color="bg-blue-600"
                    subtext="Registrados en la plataforma"
                />
                <StatCard
                    title="Usuarios Premium"
                    value={stats.usuarios_premium}
                    icon={CreditCard}
                    color="bg-green-600"
                    subtext="Pago realizado"
                />
                <StatCard
                    title="Usuarios Free"
                    value={stats.usuarios_free}
                    icon={Users}
                    color="bg-slate-500"
                    subtext="Sin pago aún"
                />
                <StatCard
                    title="Ingresos Estimados"
                    value={`$${stats.ingresos_estimados}`}
                    icon={DollarSign}
                    color="bg-indigo-600"
                    subtext="Basado en $10/usuario"
                />

            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <TrendingUp className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900">Objetivo del Mes</h4>
                        <p className="text-sm text-blue-700">Has alcanzado el {Math.round((stats.usuarios_premium / (stats.total_usuarios || 1)) * 100)}% de conversión a Premium.</p>
                    </div>
                </div>
                {/* <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">
                    Ver Reporte Detallado
                </button> */}
            </div>
        </div>
    );
};

export default AdminStats;
