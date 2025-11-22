import React, { useState } from 'react';
import { 
  Trophy, Home, BarChart2, Bell, LogOut, Search, Filter, 
  Calendar, Clock, Check, ChevronDown 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- DATOS FICTICIOS DE PARTIDOS ---
const matchesData = [
  { id: 1, teamA: 'Argentina', teamB: 'México', date: '10 jun', time: '15:00:00', stage: 'Fase de Grupos' },
  { id: 2, teamA: 'Brasil', teamB: 'Colombia', date: '10 jun', time: '18:00:00', stage: 'Fase de Grupos' },
  { id: 3, teamA: 'España', teamB: 'Italia', date: '11 jun', time: '15:00:00', stage: 'Fase de Grupos' },
  { id: 4, teamA: 'Alemania', teamB: 'Francia', date: '11 jun', time: '18:00:00', stage: 'Fase de Grupos' },
  { id: 5, teamA: 'Inglaterra', teamB: 'Portugal', date: '12 jun', time: '15:00:00', stage: 'Fase de Grupos' },
  { id: 6, teamA: 'Uruguay', teamB: 'Chile', date: '12 jun', time: '18:00:00', stage: 'Fase de Grupos' },
];

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Partidos');
  const [filter, setFilter] = useState('Todos');

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* --- 1. NAVBAR SUPERIOR (Logueado) --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Trophy size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Quiniela 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-1 text-sm font-semibold text-slate-900">
              <Home size={18} /> Partidos
            </Link>
            <Link to="#" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              <BarChart2 size={18} /> Mis Puntos
            </Link>
            <Link to="#" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              <Trophy size={18} /> Ranking
            </Link>
            <button className="text-slate-400 hover:text-slate-600">
              <Bell size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
              <LogOut size={18} /> Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- 2. HERO BANNER PEQUEÑO --- */}
        <div className="rounded-xl overflow-hidden h-48 relative mb-8 shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover"
            alt="Banner Estadio"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center px-8">
             {/* Espacio para texto si se desea */}
          </div>
        </div>

        {/* --- 3. SUB-NAVEGACIÓN --- */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-1 flex gap-2 mb-8 w-fit mx-auto md:mx-0">
          <button 
            onClick={() => setActiveTab('Partidos')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'Partidos' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Trophy size={16} className="inline mr-2 mb-0.5"/> Partidos
          </button>
          <button 
            onClick={() => setActiveTab('Pagos')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'Pagos' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="inline mr-2">$</span> Pagos
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Partidos Disponibles</h1>
          <p className="text-slate-500 text-sm">Haz tus predicciones antes del cierre</p>
        </div>

        {/* --- 4. BARRA DE FILTROS --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar equipos..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['Todos', 'Fase de Grupos', 'Octavos', 'Cuartos', 'Semifinal', 'Final'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${
                  filter === f 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* --- 5. GRILLA DE PARTIDOS (MATCH CARDS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchesData.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

      </main>
    </div>
  );
}

// --- COMPONENTE TARJETA DE PARTIDO (Interno) ---
function MatchCard({ match }) {
  const [predictionType, setPredictionType] = useState('1X2'); // '1X2' o 'Marcador'
  const [selection, setSelection] = useState(null); // 'Local', 'Empate', 'Visita'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header Card */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-100">
          {match.stage}
        </span>
      </div>

      <div className="p-5">
        {/* Equipos */}
        <div className="flex justify-between items-center mb-6">
            <div className="text-center w-1/3">
                <h3 className="font-bold text-slate-800 text-lg">{match.teamA}</h3>
            </div>
            <div className="text-center w-1/3 text-xs text-slate-400 font-medium">
                VS
            </div>
            <div className="text-center w-1/3">
                <h3 className="font-bold text-slate-800 text-lg">{match.teamB}</h3>
            </div>
        </div>

        {/* Info Fecha */}
        <div className="flex justify-center gap-4 text-xs text-slate-400 mb-6">
            <span className="flex items-center gap-1"><Calendar size={12}/> {match.date}</span>
            <span className="flex items-center gap-1"><Clock size={12}/> {match.time}</span>
        </div>

        {/* Selector Tipo Predicción */}
        <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
            <button 
                onClick={() => setPredictionType('1X2')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${predictionType === '1X2' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                1X2
            </button>
            <button 
                onClick={() => setPredictionType('Marcador')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${predictionType === 'Marcador' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Marcador
            </button>
        </div>

        {/* Botones de Selección */}
        {predictionType === '1X2' ? (
            <div className="flex gap-2 mb-4">
                {['Local', 'Empate', 'Visita'].map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setSelection(opt)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                            selection === opt 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        ) : (
            <div className="flex justify-center gap-4 mb-4 items-center">
                <input type="number" className="w-12 h-10 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700" placeholder="-" />
                <span className="text-slate-300">-</span>
                <input type="number" className="w-12 h-10 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700" placeholder="-" />
            </div>
        )}

        {/* Botón Guardar */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
            <Check size={16} /> Guardar Predicción
        </button>

      </div>
    </div>
  );
}

export default Dashboard;