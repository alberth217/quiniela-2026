import React, { useState, useEffect } from 'react';
import { Search, Loader, Shield, Lock, Save } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import config from './config';
import MatchCard from './MatchCard';

const { API_URL } = config;

const Predicciones = () => {
    const navigate = useNavigate();
    const { currentUser } = useOutletContext(); // Access user from Layout
    const isPremium = currentUser?.pago_realizado;

    // Estados de Datos
    const [matches, setMatches] = useState([]);
    const [userPredictions, setUserPredictions] = useState([]);
    const [unsavedPredictions, setUnsavedPredictions] = useState({});
    const [loading, setLoading] = useState(true);
    const [savingBatch, setSavingBatch] = useState(false);

    // Estados de Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState('Fase de Grupos');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const matchesRes = await fetch(`${API_URL}/partidos`);
                const predictionsRes = await fetch(`${API_URL}/predicciones`);

                if (matchesRes.ok && predictionsRes.ok) {
                    const matchesData = await matchesRes.json();
                    const allPredictions = await predictionsRes.json();
                    const myPredictions = allPredictions.filter(p => p.usuario_id === currentUser?.id);
                    setMatches(matchesData);
                    setUserPredictions(myPredictions);
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser) {
            fetchData();
        }
    }, [currentUser]);

    // --- LÓGICA DE FILTRADO ---
    const filteredMatches = matches.filter(match => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            (match.equipo_a || '').toLowerCase().includes(searchLower) ||
            (match.equipo_b || '').toLowerCase().includes(searchLower);
        const matchesStage = filterStage === 'Todos' || (match.fase === filterStage);
        return matchesSearch && matchesStage;
    });

    const handlePredictionChange = (partidoId, predictionData) => {
        setUnsavedPredictions(prev => ({ ...prev, [partidoId]: predictionData }));
    };

    const handleBatchSave = async () => {
        setSavingBatch(true);
        try {
            const promises = Object.entries(unsavedPredictions).map(([partidoId, data]) => {
                return fetch(`${API_URL}/predicciones`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario_id: currentUser.id,
                        partido_id: partidoId,
                        tipo_prediccion: data.tipo_prediccion,
                        seleccion: data.seleccion
                    })
                });
            });
            await Promise.all(promises);

            // Recargar datos
            const predictionsRes = await fetch(`${API_URL}/predicciones`);
            const allPredictions = await predictionsRes.json();
            const myPredictions = allPredictions.filter(p => p.usuario_id === currentUser.id);
            setUserPredictions(myPredictions);
            setUnsavedPredictions({});
            alert("¡Quiniela guardada con éxito!");
        } catch (error) {
            console.error("Error:", error);
            alert("Error al guardar.");
        } finally {
            setSavingBatch(false);
        }
    };

    const hasUnsavedChanges = Object.keys(unsavedPredictions).length > 0;

    // --- ADMIN CHECK ---
    if (currentUser?.es_admin) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-blue-50 p-6 rounded-full mb-6">
                    <Shield size={64} className="text-blue-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4">Modo Administrador</h2>
                <p className="text-slate-500 max-w-md mb-8 text-lg">
                    Como administrador, tu rol es gestionar el torneo y cargar los resultados oficiales. No participas en la quiniela.
                </p>
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl hover:scale-105"
                >
                    Ir al Panel de Control
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 relative min-h-screen pb-24">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Shield className="text-amber-500" />
                    Mi Quiniela
                </h1>
                <p className="text-slate-500 text-sm mt-1">Realiza tus predicciones y compite por los premios.</p>
            </div>

            {/* BARRA DE HERRAMIENTAS INTEGRADA */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-2 rounded-xl border border-slate-200 shadow-sm sticky top-20 z-40">
                <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide gap-1">
                    {['Todos', 'Fase de Grupos', 'Octavos', 'Cuartos', 'Semifinal', 'Final'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterStage(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filterStage === f ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar país..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* GRID DE PARTIDOS */}
            {!isPremium ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
                    <div className="bg-amber-50 p-6 rounded-full mb-6">
                        <Lock size={48} className="text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Sección Bloqueada</h2>
                    <p className="text-slate-500 max-w-md mb-8">Debes completar tu inscripción para poder realizar tus predicciones y participar por los premios.</p>
                    <button
                        onClick={() => navigate('/pagos')}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-amber-500/20 transform hover:-translate-y-1"
                    >
                        Ir a Pagar Inscripción
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400">
                            <Loader size={40} className="animate-spin mb-4 text-blue-600" />
                            <p>Cargando partidos...</p>
                        </div>
                    ) : filteredMatches.length > 0 ? (
                        filteredMatches.map((match) => {
                            const existingPrediction = userPredictions.find(p => p.partido_id === match.id);
                            const unsaved = unsavedPredictions[match.id];
                            return (
                                <MatchCard
                                    key={match.id}
                                    match={match}
                                    existingPrediction={existingPrediction}
                                    unsavedPrediction={unsaved}
                                    onChange={handlePredictionChange}
                                />
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                            <Shield size={48} className="mx-auto text-slate-200 mb-3" />
                            <p className="text-slate-500 font-medium">No hay partidos que coincidan con tu búsqueda.</p>
                            <button onClick={() => { setSearchTerm(''); setFilterStage('Todos') }} className="text-blue-600 text-sm font-bold mt-2 hover:underline">Limpiar filtros</button>
                        </div>
                    )}
                </div>
            )}

            {/* BOTÓN FLOTANTE */}
            {hasUnsavedChanges && (
                <div className="fixed bottom-6 right-6 md:right-10 z-50 animate-bounce-in">
                    <button
                        onClick={handleBatchSave}
                        disabled={savingBatch}
                        className="bg-slate-900 hover:bg-black text-white pl-6 pr-8 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 border border-slate-700"
                    >
                        {savingBatch ? <Loader size={20} className="animate-spin" /> : <Save size={20} className="text-green-400" />}
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-xs text-slate-400 font-normal uppercase mb-1">Cambios pendientes</span>
                            <span>Guardar ({Object.keys(unsavedPredictions).length})</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Predicciones;
