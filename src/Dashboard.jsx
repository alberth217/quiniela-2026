import React, { useState, useEffect } from 'react';
import {
  Trophy, Home, BarChart2, Bell, LogOut, Search,
  Calendar, Clock, Check, Loader, Save, Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'https://api-quiniela-444s.onrender.com';

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Partidos');

  // Estados de Datos
  const [matches, setMatches] = useState([]);
  const [userPredictions, setUserPredictions] = useState([]); // Para guardar lo que ya apostó
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('Todos'); // 'Todos', 'Fase de Grupos', etc.

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
        // 1. Cargar Partidos
        const matchesRes = await fetch(`${API_URL}/partidos`);

        // 2. Cargar Predicciones (Usamos la ruta general y filtramos, o la especifica si la creaste)
        const predictionsRes = await fetch(`${API_URL}/predicciones`);

        if (matchesRes.ok && predictionsRes.ok) {
          const matchesData = await matchesRes.json();
          const allPredictions = await predictionsRes.json();

          // Filtramos solo las predicciones de ESTE usuario
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
    // 1. Filtro por Buscador (Nombre de equipos)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (match.equipo_a || '').toLowerCase().includes(searchLower) ||
      (match.equipo_b || '').toLowerCase().includes(searchLower);

    // 2. Filtro por Fase
    const matchesStage = filterStage === 'Todos' || (match.fase === filterStage);

    return matchesSearch && matchesStage;
  });

  // Función para actualizar localmente una predicción recién guardada (para bloquearla al instante)
  const handlePredictionSaved = (partidoId, predictionData) => {
    setUserPredictions(prev => [...prev, { partido_id: partidoId, ...predictionData }]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 md:pb-0">

      {/* NAVBAR SUPERIOR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg"><Trophy size={20} /></div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Quiniela 2026</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {currentUser && <span className="text-sm font-bold text-blue-900">Hola, {currentUser.nombre}</span>}
            <Link to="/dashboard" className="flex items-center gap-1 text-sm font-semibold text-slate-900"><Home size={18} /> Partidos</Link>
            <Link to="#" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"><BarChart2 size={18} /> Mis Puntos</Link>
            <Link to="#" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"><Trophy size={18} /> Ranking</Link>
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
        <Link to="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"><BarChart2 size={24} /><span className="text-[10px] font-medium">Puntos</span></Link>
        <Link to="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors"><Trophy size={24} /><span className="text-[10px] font-medium">Ranking</span></Link>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        {/* HERO BANNER */}
        <div className="rounded-xl overflow-hidden h-32 md:h-48 relative mb-6 md:mb-8 shadow-md">
          <img src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover" alt="Banner Estadio" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center px-6 md:px-8">
            <h2 className="text-white text-xl md:text-2xl font-bold">¡Haz tus jugadas!</h2>
          </div>
        </div>

        {/* SUB-NAVEGACIÓN */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-1 flex gap-1 mb-6 w-full md:w-fit mx-auto md:mx-0">
          <button onClick={() => setActiveTab('Partidos')} className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'Partidos' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}><Trophy size={16} className="inline mr-2 mb-0.5" /> Partidos</button>
          <button onClick={() => setActiveTab('Pagos')} className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'Pagos' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}><span className="inline mr-2">$</span> Pagos</button>
        </div>

        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-900">Partidos Disponibles</h1>
          <p className="text-slate-500 text-sm">Haz tus predicciones antes del cierre</p>
        </div>

        {/* --- BARRA DE BÚSQUEDA Y FILTROS (RESTAURADA) --- */}
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
                // Buscamos si este usuario ya tiene predicción para este partido
                const existingPrediction = userPredictions.find(p => p.partido_id === match.id);

                return (
                  <MatchCard
                    key={match.id}
                    match={match}
                    userId={currentUser?.id}
                    existingPrediction={existingPrediction}
                    onSave={handlePredictionSaved}
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
    </div>
  );
}

// --- COMPONENTE TARJETA INTELIGENTE (Con Bloqueo) ---
function MatchCard({ match, userId, existingPrediction, onSave }) {
  // Si existe predicción, inicializamos el estado con ella
  const isLocked = !!existingPrediction; // Doble negación convierte a booleano (true si existe)

  // Determinamos valores iniciales (si ya guardó, los mostramos, si no, vacíos)
  const initialType = existingPrediction?.tipo_prediccion || '1X2';
  const initialSelection = (initialType === '1X2') ? existingPrediction?.seleccion : null;

  // Parsear marcador si existe (ej: "2-1")
  let initialScoreA = '';
  let initialScoreB = '';
  if (initialType === 'Marcador' && existingPrediction?.seleccion) {
    const parts = existingPrediction.seleccion.split('-');
    if (parts.length === 2) {
      initialScoreA = parts[0];
      initialScoreB = parts[1];
    }
  }

  const [predictionType, setPredictionType] = useState(initialType);
  const [selection, setSelection] = useState(initialSelection);
  const [scoreA, setScoreA] = useState(initialScoreA);
  const [scoreB, setScoreB] = useState(initialScoreB);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (isLocked) return; // Seguridad extra

    let valorPrediccion = '';
    if (predictionType === '1X2') {
      if (!selection) return alert("Selecciona una opción");
      valorPrediccion = selection;
    } else {
      if (scoreA === '' || scoreB === '') return alert("Ingresa el marcador");
      valorPrediccion = `${scoreA}-${scoreB}`;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/predicciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: userId,
          partido_id: match.id,
          tipo_prediccion: predictionType,
          seleccion: valorPrediccion
        })
      });

      if (response.ok) {
        // Notificamos al padre para que actualice el estado global y bloquee la tarjeta
        onSave(match.id, {
          tipo_prediccion: predictionType,
          seleccion: valorPrediccion
        });
      } else {
        alert("Error al guardar");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${isLocked ? 'border-slate-200 bg-slate-50 opacity-90' : 'border-slate-200 hover:shadow-md'}`}>
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-100">
          {match.fase || match.stage}
        </span>
        {isLocked && <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Lock size={12} /> Cerrado</span>}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center w-1/3"><h3 className="font-bold text-slate-800 text-lg">{match.equipo_a || match.teamA}</h3></div>
          <div className="text-center w-1/3 text-xs text-slate-400 font-medium">VS</div>
          <div className="text-center w-1/3"><h3 className="font-bold text-slate-800 text-lg">{match.equipo_b || match.teamB}</h3></div>
        </div>

        <div className="flex justify-center gap-4 text-xs text-slate-400 mb-6">
          <span className="flex items-center gap-1"><Calendar size={12} /> {match.fecha || match.date}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {match.hora || match.time}</span>
        </div>

        {/* Selector Tipo (Deshabilitado si está bloqueado) */}
        <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
          <button disabled={isLocked} onClick={() => setPredictionType('1X2')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${predictionType === '1X2' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'} ${isLocked && predictionType !== '1X2' ? 'opacity-50' : ''}`}>1X2</button>
          <button disabled={isLocked} onClick={() => setPredictionType('Marcador')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${predictionType === 'Marcador' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'} ${isLocked && predictionType !== 'Marcador' ? 'opacity-50' : ''}`}>Marcador</button>
        </div>

        {/* Opciones */}
        {predictionType === '1X2' ? (
          <div className="flex gap-2 mb-4">
            {['Local', 'Empate', 'Visita'].map((opt) => (
              <button
                key={opt}
                disabled={isLocked}
                onClick={() => setSelection(opt)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${selection === opt
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  } ${isLocked ? 'cursor-not-allowed' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex justify-center gap-4 mb-4 items-center">
            <input disabled={isLocked} type="number" value={scoreA} onChange={(e) => setScoreA(e.target.value)} className="w-12 h-10 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 disabled:bg-slate-100" placeholder="-" />
            <span className="text-slate-300">-</span>
            <input disabled={isLocked} type="number" value={scoreB} onChange={(e) => setScoreB(e.target.value)} className="w-12 h-10 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 disabled:bg-slate-100" placeholder="-" />
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || isLocked}
          className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 
                ${isLocked
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {saving ? (
            <Loader size={16} className="animate-spin" />
          ) : isLocked ? (
            <><Check size={16} /> Predicción Guardada</>
          ) : (
            <><Save size={16} /> Guardar Predicción</>
          )}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;