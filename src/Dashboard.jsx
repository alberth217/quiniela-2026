import React, { useState, useEffect } from 'react';
import {
  Trophy, Home, BarChart2, Bell, LogOut, Search,
  Calendar, Clock, Loader, Save, Lock,
  Ticket, AlertTriangle, Shield, TrendingUp, Star
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import RulesSection from './RulesSection';
// Asegúrate de importar tu MatchCard actualizado aquí
// import MatchCard from './MatchCard'; 

const API_URL = 'https://api-quiniela-444s.onrender.com';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Partidos');
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => location.state?.fromLogin || false);

  // Estados de Datos
  const [matches, setMatches] = useState([]);
  const [userPredictions, setUserPredictions] = useState([]);
  const [unsavedPredictions, setUnsavedPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingBatch, setSavingBatch] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('Fase de Grupos');

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    let userId = null;

    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      userId = user.id;
    } else {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const matchesRes = await fetch(`${API_URL}/partidos`);
        const predictionsRes = await fetch(`${API_URL}/predicciones`);

        if (matchesRes.ok && predictionsRes.ok) {
          const matchesData = await matchesRes.json();
          const allPredictions = await predictionsRes.json();
          const myPredictions = allPredictions.filter(p => p.usuario_id === userId);
          setMatches(matchesData);
          setUserPredictions(myPredictions);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 md:pb-10">

      {/* NAVBAR MEJORADO */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/img/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
            <span className="font-black text-xl tracking-tighter text-blue-900 hidden sm:block">PREDIGOL</span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setActiveTab('Partidos')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'Partidos' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Trophy size={16} /> Partidos
            </button>
            <button onClick={() => setActiveTab('Pagos')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'Pagos' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Ticket size={16} /> Pagos
            </button>
          </div>

          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Bienvenido</span>
                <span className="text-sm font-bold text-slate-800 leading-none">{currentUser.nombre}</span>
              </div>
            )}
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* BANNER DE ESTADÍSTICAS (Nuevo Diseño) */}
        {/* Usamos un degradado en lugar de imagen para que cargue rápido y se vea pro */}
        <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-10 mb-8 text-white overflow-hidden shadow-xl">
          {/* Formas decorativas de fondo */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 text-xs font-bold text-blue-200 mb-3">
                <TrendingUp size={14} /> Mundial 2026
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Panel de Control</h1>
              <p className="text-blue-200 text-lg">
                Llevas <strong className="text-white">{userPredictions.length}</strong> predicciones realizadas. ¡Completa la fase de grupos!
              </p>
            </div>

            {/* Tarjetas de Resumen Flotantes */}
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl min-w-[140px] flex flex-col items-center justify-center text-center">
                <span className="text-slate-300 text-xs font-bold uppercase mb-1">Tu Ranking</span>
                <span className="text-3xl font-black text-yellow-400">#42</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl min-w-[140px] flex flex-col items-center justify-center text-center">
                <span className="text-slate-300 text-xs font-bold uppercase mb-1">Puntos</span>
                <span className="text-3xl font-black text-white">1,250</span>
              </div>
              <div className="bg-blue-600/80 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl min-w-[140px] flex flex-col items-center justify-center text-center shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
                <Star size={20} className="text-white mb-1" />
                <span className="text-sm font-bold text-white">Ranking Global &rarr;</span>
              </div>
            </div>
          </div>
        </div>

        {/* BARRA DE HERRAMIENTAS INTEGRADA (Filtros + Búsqueda) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">

          {/* Selector de Fases (Tipo Segment) */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide gap-1">
            {['Todos', 'Fase de Grupos', 'Octavos', 'Cuartos', 'Semi', 'Final'].map(f => (
              <button
                key={f}
                onClick={() => setFilterStage(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filterStage === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Buscador Expandible */}
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

        {/* GRID PRINCIPAL OPTIMIZADO */}
        {/* Aquí está el cambio clave: xl:grid-cols-4 */}
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
              // Renderizar tu MatchCard importado aquí
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

      </main>

      {/* BOTÓN FLOTANTE DE GUARDADO */}
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

      {/* MODAL BIENVENIDA (Mismo código anterior) */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          {/* ... Contenido del Modal igual al anterior ... */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowWelcomeModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><Lock size={20} /></button>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido!</h2>
            <p className="text-slate-500 mb-6">Comienza a predecir para ganar.</p>
            <button onClick={() => setShowWelcomeModal(false)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Comenzar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- COMPONENTE TARJETA CORREGIDO Y SIMÉTRICO ---
function MatchCard({ match, existingPrediction, unsavedPrediction, onChange }) {
  // Datos actuales (Prioridad: Local > Guardado > Vacío)
  const currentData = unsavedPrediction || existingPrediction || {};

  // Parsear marcador "GolesA-GolesB"
  let initialScoreA = '';
  let initialScoreB = '';
  if (currentData.seleccion && currentData.seleccion.includes('-')) {
    const parts = currentData.seleccion.split('-');
    initialScoreA = parts[0];
    initialScoreB = parts[1];
  }

  const [scoreA, setScoreA] = useState(initialScoreA);
  const [scoreB, setScoreB] = useState(initialScoreB);

  // Notificar cambios al padre (Dashboard)
  useEffect(() => {
    if (scoreA !== '' && scoreB !== '') {
      const valorPrediccion = `${scoreA}-${scoreB}`;
      const dbSel = existingPrediction?.seleccion;

      // Solo notificar si cambió respecto a lo guardado
      if (valorPrediccion !== dbSel) {
        onChange(match.id, {
          tipo_prediccion: 'Marcador',
          seleccion: valorPrediccion
        });
      }
    }
  }, [scoreA, scoreB]);

  const isFinalized = match.estado === 'finalizado';

  // Formato simple de fecha
  const formatDate = (dateStr) => {
    // Puedes ajustar esto según venga tu fecha "2026-06-10" -> "10 Jun"
    return dateStr;
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col ${isFinalized ? 'opacity-90 bg-slate-50' : ''}`}>

      {/* 1. HEADER (Fase y Hora) */}
      <div className="flex justify-between items-center px-4 py-3 bg-slate-50/80 border-b border-slate-100">
        <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide">
          {match.fase || 'Fase de Grupos'}
        </span>
        {isFinalized ? (
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Lock size={10} /> Finalizado
          </span>
        ) : (
          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-100">
            <Clock size={10} /> {match.hora}
          </span>
        )}
      </div>

      {/* 2. CONTENIDO PRINCIPAL (Grid 3 Columnas: A - Info - B) */}
      {/* Usamos grid-cols-[1fr_auto_1fr] para forzar que los equipos tengan el mismo ancho y el centro se ajuste */}
      <div className="p-5 grid grid-cols-[1fr_auto_1fr] gap-2 items-start">

        {/* COLUMNA IZQUIERDA: EQUIPO A */}
        <div className="flex flex-col items-center">
          {/* Bandera con efecto de elevación suave */}
          <div className="relative mb-3 group">
            <div className="absolute inset-0 bg-black/5 rounded-lg transform translate-y-1 translate-x-0 blur-sm"></div>
            {match.logo_a ? (
              <img src={match.logo_a} alt={match.equipo_a} className="relative w-14 h-10 md:w-16 md:h-12 object-cover rounded-md shadow-sm border border-white" />
            ) : (
              <Shield size={40} className="text-slate-200 relative" />
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-800 text-center leading-tight h-8 flex items-center justify-center mb-2">
            {match.equipo_a}
          </h3>

          {/* Input A */}
          {!isFinalized ? (
            <input
              type="number"
              min="0"
              placeholder="0"
              value={scoreA}
              onChange={(e) => setScoreA(e.target.value)}
              className="w-12 h-10 text-center bg-white border border-slate-200 rounded-lg font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            />
          ) : (
            <span className="text-2xl font-black text-slate-800">{match.goles_a}</span>
          )}
        </div>

        {/* COLUMNA CENTRAL: VS e INFO */}
        <div className="flex flex-col items-center justify-start pt-2 px-2">
          <span className="text-[10px] font-black text-slate-300 uppercase mb-1">VS</span>
          <div className="flex flex-col items-center gap-1">
            <Calendar size={12} className="text-slate-300" />
            <span className="text-[10px] font-medium text-slate-400 text-center leading-tight w-12">
              {formatDate(match.fecha)}
            </span>
          </div>
        </div>

        {/* COLUMNA DERECHA: EQUIPO B */}
        <div className="flex flex-col items-center">
          {/* Bandera */}
          <div className="relative mb-3 group">
            <div className="absolute inset-0 bg-black/5 rounded-lg transform translate-y-1 translate-x-0 blur-sm"></div>
            {match.logo_b ? (
              <img src={match.logo_b} alt={match.equipo_b} className="relative w-14 h-10 md:w-16 md:h-12 object-cover rounded-md shadow-sm border border-white" />
            ) : (
              <Shield size={40} className="text-slate-200 relative" />
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-800 text-center leading-tight h-8 flex items-center justify-center mb-2">
            {match.equipo_b}
          </h3>

          {/* Input B */}
          {!isFinalized ? (
            <input
              type="number"
              min="0"
              placeholder="0"
              value={scoreB}
              onChange={(e) => setScoreB(e.target.value)}
              className="w-12 h-10 text-center bg-white border border-slate-200 rounded-lg font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            />
          ) : (
            <span className="text-2xl font-black text-slate-800">{match.goles_b}</span>
          )}
        </div>

      </div>

      {/* FOOTER OPCIONAL (Solo si ya predicción finalizada) */}
      {isFinalized && existingPrediction && (
        <div className="bg-slate-50 py-2 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            Tu Pronóstico: <span className="text-blue-600 text-sm">{existingPrediction.seleccion}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;