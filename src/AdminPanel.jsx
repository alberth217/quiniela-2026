import React, { useState, useEffect } from 'react';
import { Save, Lock, Check, Loader, Shield, AlertTriangle } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import config from './config';

const { API_URL } = config;

function AdminPanel() {
    const { currentUser } = useOutletContext();
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Double check admin status (redundant if protected route works, but safe)
        if (currentUser && !currentUser.es_admin) {
            navigate('/dashboard');
            return;
        }

        fetchMatches();
    }, [currentUser, navigate]);

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
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': currentUser.id // Temporary auth header
                },
                body: JSON.stringify({ goles_a: golesA, goles_b: golesB })
            });

            if (res.ok) {
                alert("Partido actualizado y finalizado");
                fetchMatches();
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión");
        }
    };

    return (
        <div className="p-4 md:p-8 pb-24">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                        <Shield className="text-blue-600" /> Panel de Administración
                    </h1>
                    <p className="text-slate-500 text-sm">Gestiona los resultados oficiales de los partidos.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-bold text-slate-800">Partidos del Torneo</h2>
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
    );
}

function AdminMatchRow({ match, onUpdate }) {
    const [golesA, setGolesA] = useState(match.goles_a !== null ? match.goles_a : '');
    const [golesB, setGolesB] = useState(match.goles_b !== null ? match.goles_b : '');
    const [isFinalized, setIsFinalized] = useState(match.estado === 'finalizado');

    // Update local state if match updates from parent
    useEffect(() => {
        setGolesA(match.goles_a !== null ? match.goles_a : '');
        setGolesB(match.goles_b !== null ? match.goles_b : '');
        setIsFinalized(match.estado === 'finalizado');
    }, [match]);

    const handleSave = () => {
        if (window.confirm(`¿Confirmar resultado ${match.equipo_a} ${golesA} - ${golesB} ${match.equipo_b}? Esto finalizará el partido y actualizará puntos.`)) {
            onUpdate(match.id, golesA, golesB);
        }
    };

    return (
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
            <div className="flex-1 flex items-center gap-4 w-full md:w-auto">
                <div className="text-xs font-bold text-slate-400 w-8 text-center hidden md:block">{match.id}</div>
                <div className="flex flex-col flex-1">
                    <span className="font-bold text-slate-800 text-sm md:text-base">{match.equipo_a} vs {match.equipo_b}</span>
                    <span className="text-xs text-slate-500">{match.fecha} - {match.hora}</span>
                </div>
                {isFinalized && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">Finalizado</span>}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={golesA}
                        onChange={(e) => setGolesA(e.target.value)}
                        className="w-12 h-10 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 disabled:bg-slate-100 transition-all"
                        placeholder="-"
                    />
                    <span className="text-slate-400 font-bold">-</span>
                    <input
                        type="number"
                        value={golesB}
                        onChange={(e) => setGolesB(e.target.value)}
                        className="w-12 h-10 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 disabled:bg-slate-100 transition-all"
                        placeholder="-"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${isFinalized ? 'bg-slate-100 text-slate-400 hover:bg-slate-200' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}
                >
                    {isFinalized ? <><Lock size={16} /> Editar</> : <><Save size={16} /> Finalizar</>}
                </button>
            </div>
        </div>
    );
}

export default AdminPanel;
