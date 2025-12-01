import React, { useState, useEffect } from 'react';
import {
  Trophy, Home, BarChart2, Bell, LogOut, Search,
  Calendar, Clock, Check, Loader, Save, Lock,
  X, Ticket, AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'https://api-quiniela-444s.onrender.com'; // Ajustado a producción

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Partidos');
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  // Estados de Datos
  const [matches, setMatches] = useState([]);
  const [userPredictions, setUserPredictions] = useState([]); // Lo que viene de la BD
  const [unsavedPredictions, setUnsavedPredictions] = useState({}); // Cambios locales { partidoId: { tipo, seleccion } }

  const [loading, setLoading] = useState(true);
  const [savingBatch, setSavingBatch] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('Fase de Grupos'); // Default: Fase de Grupos

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
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
        } else {
          console.error("Error cargando datos");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
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

  // Manejar cambios en las tarjetas
  const handlePredictionChange = (partidoId, predictionData) => {
    setUnsavedPredictions(prev => ({
      ...prev,
      [partidoId]: predictionData
    }));
  };

  // Guardar Quiniela (Batch)
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

      // Recargar datos para confirmar
      const predictionsRes = await fetch(`${API_URL}/predicciones`);
      const allPredictions = await predictionsRes.json();
      const myPredictions = allPredictions.filter(p => p.usuario_id === currentUser.id);
      setUserPredictions(myPredictions);

      setUnsavedPredictions({}); // Limpiar cambios
      alert("¡Quiniela guardada con éxito!");

    } catch (error) {
      console.error("Error guardando quiniela:", error);
      alert("Hubo un error al guardar algunos pronósticos.");
    } finally {
      setSavingBatch(false);
    }
  };

  const hasUnsavedChanges = Object.keys(unsavedPredictions).length > 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 md:pb-0">

      {/* NAVBAR SUPERIOR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/img/logo.png" alt="Logo Quiniela" className="h-16 sm:h-20 w-auto object-contain" />
            <span className="font-bold text-xl tracking-tight text-slate-900">Quiniela 2026</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {currentUser && <span className="text-sm font-bold text-blue-900">Hola, {currentUser.nombre}</span>}
            <Link to="/dashboard" className="flex items-center gap-1 text-sm font-semibold text-slate-900"><Home size={18} /> Partidos</Link>
            <Link to="/mis-puntos" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"><BarChart2 size={18} /> Mis Puntos</Link>
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
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-blue-600 transition-colors"><Home size={24} /><span className="text-[10px] font-bold">Partidos</span></Link>
        <Link to="/mis-puntos" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"><BarChart2 size={24} /><span className="text-[10px] font-medium">Puntos</span></Link>
        <Link to="/ranking" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"><Trophy size={24} /><span className="text-[10px] font-medium">Ranking</span></Link>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 mb-16">

        {/* HERO BANNER */}
        <div className="rounded-xl overflow-hidden h-32 md:h-48 relative mb-6 md:mb-8 shadow-md">
          <img src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2076&auto=format&fit=crop" className="w-full h-full object-cover" alt="Banner Estadio" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center px-6 md:px-8">
            <h2 className="text-white text-xl md:text-2xl font-bold">¡Haz tus jugadas!</h2>
          </div>
        </div>

        {/* SUB-NAVEGACIÓN */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-1 flex gap-1 mb-6 w-full md:w-fit mx-auto md:mx-0 items-center">
          <button onClick={() => setActiveTab('Partidos')} className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'Partidos' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}><Trophy size={16} className="inline mr-2 mb-0.5" /> Partidos</button>
          <button onClick={() => setActiveTab('Pagos')} className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'Pagos' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}><span className="inline mr-2">$</span> Pagos</button>

          {/* Ticket Indicator */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-bold border border-yellow-200 ml-auto md:ml-2">
            <Ticket size={16} />
            <span>Tickets: 1/2</span>
          </div>
        </div>

        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-900">Partidos Disponibles</h1>
          <p className="text-slate-500 text-sm">Completa tu quiniela y guarda los cambios.</p>
        </div>

        {/* FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar equipos (Ej: Brasil)..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['Todos', 'Fase de Grupos', 'Octavos', 'Cuartos', 'Semifinal', 'Final'].map(f => (
              <button
                key={f}
                onClick={() => setFilterStage(f)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${filterStage === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLA DE PARTIDOS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader size={40} className="animate-spin mb-4 text-blue-600" />
            <p>Cargando datos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => {
                const existingPrediction = userPredictions.find(p => p.partido_id === match.id);
                // Si hay un cambio local sin guardar, lo usamos para la UI
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
              <div className="col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">No se encontraron partidos con esos filtros.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* BOTÓN FLOTANTE DE GUARDADO */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
          <button
            onClick={handleBatchSave}
            disabled={savingBatch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            {savingBatch ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
            Guardar Quiniela ({Object.keys(unsavedPredictions).length} cambios)
          </button>
        </div>
      )}

      {/* MODAL DE BIENVENIDA */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up relative">
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">¡Bienvenido a la Quiniela!</h3>
              <p className="text-slate-500 text-sm mt-1">Prepárate para el Mundial 2026</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                  <Ticket size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">Costo del Ticket: $25 USD</h4>
                  <p className="text-xs text-blue-700 font-medium mt-0.5">Fase de Grupos</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex items-start gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm text-yellow-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-900">Regla Importante</h4>
                  <p className="text-xs text-yellow-700 font-medium mt-0.5">Máximo 2 Tickets por usuario.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-400 mb-4">
                * Siguiente Fase: Costo adicional aplicable.
              </p>
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Entendido, ¡A Jugar!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- COMPONENTE TARJETA (Sin Botón Guardar) ---
function MatchCard({ match, existingPrediction, unsavedPrediction, onChange }) {
  // Prioridad: 1. Cambio local (unsaved), 2. Guardado en BD (existing), 3. Default
  const currentData = unsavedPrediction || existingPrediction || {};

  const initialType = currentData.tipo_prediccion || '1X2';

  // Parsear marcador
  let initialScoreA = '';
  let initialScoreB = '';
  if (initialType === 'Marcador' && currentData.seleccion) {
    const parts = currentData.seleccion.split('-');
    if (parts.length === 2) {
      initialScoreA = parts[0];
      initialScoreB = parts[1];
    }
  } else if (initialType === '1X2') {
    // No hay marcador
  }

  const [predictionType, setPredictionType] = useState(initialType);
  const [selection, setSelection] = useState(currentData.seleccion || null);
  const [scoreA, setScoreA] = useState(initialScoreA);
  const [scoreB, setScoreB] = useState(initialScoreB);

  // Efecto para notificar cambios al padre
  useEffect(() => {
    let valorPrediccion = '';
    let isValid = false;

    if (predictionType === '1X2') {
      if (selection) {
        valorPrediccion = selection;
        isValid = true;
      }
    } else {
      if (scoreA !== '' && scoreB !== '') {
        valorPrediccion = `${scoreA}-${scoreB}`;
        isValid = true;
      }
    }

    // Solo notificamos si es válido y diferente a lo que ya estaba guardado en BD
    // O si es un cambio sobre un cambio anterior
    if (isValid) {
      // Comparamos con lo que hay en BD para no marcar como "cambio" si es igual
      const dbType = existingPrediction?.tipo_prediccion;
      const dbSel = existingPrediction?.seleccion;

      if (predictionType !== dbType || valorPrediccion !== dbSel) {
        onChange(match.id, {
          tipo_prediccion: predictionType,
          seleccion: valorPrediccion
        });
      }
    }
  }, [predictionType, selection, scoreA, scoreB]); // Dependencias

  const isFinalized = match.estado === 'finalizado';

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${isFinalized ? 'opacity-75 bg-slate-50' : 'hover:shadow-md'}`}>
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-100">
          {match.fase || match.stage}
        </span>
        {isFinalized && <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Lock size={12} /> Finalizado</span>}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center w-1/3"><h3 className="font-bold text-slate-800 text-lg">{match.equipo_a}</h3></div>
          <div className="text-center w-1/3 text-xs text-slate-400 font-medium">VS</div>
          <div className="text-center w-1/3"><h3 className="font-bold text-slate-800 text-lg">{match.equipo_b}</h3></div>
        </div>

        <div className="flex justify-center gap-4 text-xs text-slate-400 mb-6">
          <span className="flex items-center gap-1"><Calendar size={12} /> {match.fecha}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {match.hora}</span>
        </div>

        {/* CONTROLES DE PREDICCIÓN */}
        {!isFinalized ? (
          <div className="space-y-4">
            {/* Selector de Tipo */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setPredictionType('1X2')}
                className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${predictionType === '1X2' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
              >
                Ganador
              </button>
              <button
                onClick={() => setPredictionType('Marcador')}
                className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${predictionType === 'Marcador' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
              >
                Marcador
              </button>
            </div>

            {predictionType === '1X2' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setSelection('1')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${selection === '1' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                >
                  1
                </button>
                <button
                  onClick={() => setSelection('X')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${selection === 'X' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                >
                  X
                </button>
                <button
                  onClick={() => setSelection('2')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${selection === '2' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                >
                  2
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-3">
                <input
                  type="number"
                  value={scoreA}
                  onChange={(e) => setScoreA(e.target.value)}
                  className="w-12 h-10 text-center border border-slate-200 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="-"
                />
                <span className="font-bold text-slate-300">-</span>
                <input
                  type="number"
                  value={scoreB}
                  onChange={(e) => setScoreB(e.target.value)}
                  className="w-12 h-10 text-center border border-slate-200 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="-"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Tu predicción:</p>
            <p className="font-bold text-slate-800">
              {existingPrediction ? (
                existingPrediction.tipo_prediccion === '1X2' ? `Ganador: ${existingPrediction.seleccion}` : `Marcador: ${existingPrediction.seleccion}`
              ) : 'Sin predicción'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;