import React, { useState, useEffect } from 'react';
import { 
  Trophy, Home, BarChart2, Bell, LogOut, Search, 
  Calendar, Clock, Check, Loader, Save, AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// ⚠️ CONSTANTE CON TU URL DE RENDER (Verifica que sea esta)
const API_URL = 'https://api-quiniela-444s.onrender.com';

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Partidos');
  const [filter, setFilter] = useState('Todos');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        setCurrentUser(JSON.parse(userStr));
    } else {
        navigate('/login');
    }

    const fetchMatches = async () => {
      try {
        const response = await fetch(`${API_URL}/partidos`);
        if (response.ok) {
          const data = await response.json();
          setMatches(data);
        } else {
          console.error("Error del servidor al cargar partidos");
        }
      } catch (error) {
        console.error("Error cargando partidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [navigate]);

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
          <img src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover" alt="Banner Estadio"/>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center px-6 md:px-8">
             <h2 className="text-white text-xl md:text-2xl font-bold">¡Haz tus jugadas!</h2>
          </div>
        </div>

        {/* SUB-NAVEGACIÓN */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-1 flex gap-1 mb-6 w-full md:w-fit mx-auto md:mx-0">
          <button onClick={() => setActiveTab('Partidos')} className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'Partidos' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}><Trophy size={16} className="inline mr-2 mb-0.5"/> Partidos</button>
          <button onClick={() => setActiveTab('Pagos')} className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'Pagos' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}><span className="inline mr-2">$</span> Pagos</button>
        </div>

        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl font-bold text-slate-900">Partidos Disponibles</h1>
          <p className="text-slate-500 text-sm">Haz tus predicciones antes del cierre</p>
        </div>

        {/* GRILLA DE PARTIDOS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader size={40} className="animate-spin mb-4 text-blue-600" />
            <p>Cargando partidos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.length > 0 ? (
              matches.map((match) => (
                <MatchCard key={match.id} match={match} userId={currentUser?.id} />
              ))
            ) : (
              <p className="text-center col-span-full text-slate-500">No hay partidos disponibles.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// --- COMPONENTE TARJETA CON VALIDACIÓN VISUAL ---
function MatchCard({ match, userId }) {
  const [predictionType, setPredictionType] = useState('1X2');
  const [selection, setSelection] = useState(null); 
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // Nuevo estado para errores

  const handleSave = async () => {
    console.log("Botón presionado para partido:", match.id); // Log para verificar click
    setErrorMsg(''); // Limpiar errores previos

    let valorPrediccion = '';
    
    // VALIDACIÓN
    if (predictionType === '1X2') {
        if (!selection) {
            setErrorMsg("⚠️ Debes seleccionar Local, Empate o Visita");
            return; // Detenemos aquí si no hay selección
        }
        valorPrediccion = selection;
    } else {
        if (scoreA === '' || scoreB === '') {
            setErrorMsg("⚠️ Debes ingresar el marcador completo");
            return;
        }
        valorPrediccion = `${scoreA}-${scoreB}`;
    }

    setSaving(true);

    try {
        console.log("Enviando datos...", { userId, partidoId: match.id, valorPrediccion });
        
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
            console.log("Guardado exitoso");
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } else {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData);
            setErrorMsg("❌ Error al guardar: " + (errorData.message || "Intenta de nuevo"));
        }
    } catch (e) {
        console.error("Error de red:", e);
        setErrorMsg("❌ Error de conexión. Revisa tu internet.");
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${saved ? 'border-green-500 ring-1 ring-green-500' : 'border-slate-200 hover:shadow-md'}`}>
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-100">
          {match.fase || match.stage}
        </span>
        {saved && <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Check size={12}/> Guardado</span>}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
            <div className="text-center w-1/3"><h3 className="font-bold text-slate-800 text-lg">{match.equipo_a || match.teamA}</h3></div>
            <div className="text-center w-1/3 text-xs text-slate-400 font-medium">VS</div>
            <div className="text-center w-1/3"><h3 className="font-bold text-slate-800 text-lg">{match.equipo_b || match.teamB}</h3></div>
        </div>

        <div className="flex justify-center gap-4 text-xs text-slate-400 mb-6">
            <span className="flex items-center gap-1"><Calendar size={12}/> {match.fecha || match.date}</span>
            <span className="flex items-center gap-1"><Clock size={12}/> {match.hora || match.time}</span>
        </div>

        <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
            <button onClick={() => {setPredictionType('1X2'); setErrorMsg('')}} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${predictionType === '1X2' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>1X2</button>
            <button onClick={() => {setPredictionType('Marcador'); setErrorMsg('')}} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${predictionType === 'Marcador' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Marcador</button>
        </div>

        {predictionType === '1X2' ? (
            <div className="flex gap-2 mb-4">
                {['Local', 'Empate', 'Visita'].map((opt) => (
                    <button key={opt} onClick={() => {setSelection(opt); setErrorMsg('')}} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${selection === opt ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>{opt}</button>
                ))}
            </div>
        ) : (
            <div className="flex justify-center gap-4 mb-4 items-center">
                <input type="number" value={scoreA} onChange={(e) => setScoreA(e.target.value)} className="w-12 h-10 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700" placeholder="-" />
                <span className="text-slate-300">-</span>
                <input type="number" value={scoreB} onChange={(e) => setScoreB(e.target.value)} className="w-12 h-10 text-center border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700" placeholder="-" />
            </div>
        )}

        {/* MENSAJE DE ERROR VISIBLE */}
        {errorMsg && (
            <div className="mb-3 text-xs font-bold text-red-500 bg-red-50 p-2 rounded flex items-center justify-center gap-1 animate-pulse">
                <AlertCircle size={14}/> {errorMsg}
            </div>
        )}

        <button 
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 
                ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
            {saving ? <Loader size={16} className="animate-spin" /> : saved ? <><Check size={16}/> ¡Listo!</> : <><Save size={16} /> Guardar Predicción</>}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;