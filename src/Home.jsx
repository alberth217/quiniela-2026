import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, CheckCircle, ArrowRight, Shield, Clock, Loader, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import RulesSection from './RulesSection';

// Array de imágenes del carrusel
const heroImages = [
  '/img/hero1.png',
  '/img/hero2.jpg',
  '/img/hero3.png',
];

const API_URL = 'https://api-quiniela-444s.onrender.com';

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [topUsers, setTopUsers] = useState([]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${API_URL}/partidos`);
        if (res.ok) {
          const data = await res.json();
          setMatches(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoadingMatches(false);
      }
    };

    const fetchRanking = async () => {
      try {
        const res = await fetch(`${API_URL}/ranking`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setTopUsers(data);
        }
      } catch (error) {
        console.error("Error fetching ranking:", error);
      }
    };

    fetchMatches();
    fetchRanking();
  }, []);

  // --- CARRUSEL ---
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- TIMER ---
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date("2026-06-11") - +new Date();
      let timeLeft = {};
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return timeLeft;
    };
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 md:pb-0">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="Logo Quiniela" className="h-16 w-auto object-contain" />
            <span className="font-bold text-2xl tracking-tight text-slate-900 hidden md:block">Quiniela 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors">Iniciar Sesión</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-slate-900">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-60' : 'opacity-0'}`}
            >
              <img src={img} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>

          <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-start text-left">
            <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-bold mb-6 backdrop-blur-sm animate-fade-in-down">
              🏆 La Copa del Mundo 2026
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-lg animate-fade-in-up">
              Vive la Pasión <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Gana en Grande</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl font-medium drop-shadow-md animate-fade-in-up delay-100">
              Participa en la quiniela más emocionante. Predice resultados, compite con amigos y gana premios exclusivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Jugar Ahora <ArrowRight size={20} />
              </Link>
              <a href="#como-funciona" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center">
                Cómo Funciona
              </a>
            </div>
          </div>
        </div>

        {/* SECCIÓN PRINCIPAL: 3 COLUMNAS */}
        {/* Usamos max-w-[1600px] para dar más espacio horizontal */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

          {/* DEFINICIÓN DEL GRID: 12 COLUMNAS EN TOTAL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* --- COLUMNA 1: PUBLICIDAD (IZQUIERDA - 2/12) --- */}
            <div className="hidden lg:block lg:col-span-2 space-y-6">
              <div className="sticky top-24 space-y-6">

                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-2">Publicidad</div>

                {/* Banner Vertical 1 */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                  <img src="/img/sponsor-vertical.jpg" alt="Sponsor" className="w-full h-auto rounded-lg mb-3 object-cover" />
                  <p className="text-xs text-slate-500 mb-2">Viaja al mundial con</p>
                  <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                    Ver Ofertas <ExternalLink size={10} />
                  </button>
                </div>

                {/* Banner Cuadrado */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white text-center shadow-md">
                  <h4 className="font-bold text-sm mb-2">Tu Marca Aquí</h4>
                  <p className="text-xs text-slate-300 mb-3">Llega a miles de fanáticos.</p>
                  <button className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full w-full hover:bg-slate-100 transition-colors">
                    Contáctanos
                  </button>
                </div>

                {/* Lista de Logos Pequeños */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer">Logo</div>
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer">Logo</div>
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer">Logo</div>
                    <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer">Logo</div>
                  </div>
                </div>

              </div>
            </div>

            {/* --- COLUMNA 2: CONTENIDO PRINCIPAL (CENTRO - 7/12) --- */}
            <div className="lg:col-span-7 space-y-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Calendar size={24} /></span>
                  Partidos Destacados
                </h2>
                <Link to="/login" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                  Ver Todos <ArrowRight size={16} />
                </Link>
              </div>

              <div className="space-y-6">
                {loadingMatches ? (
                  <div className="flex justify-center py-10">
                    <Loader size={40} className="animate-spin text-blue-600" />
                  </div>
                ) : (
                  matches.map((match) => (
                    <div key={match.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{match.fase}</span>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                          <Clock size={12} /> {match.fecha} - {match.hora}
                        </span>
                      </div>
                      <div className="p-6 md:p-8 flex items-center justify-between">
                        <div className="flex flex-col items-center gap-3 w-1/3 group-hover:transform group-hover:scale-105 transition-transform duration-300">
                          {match.logo_a ? (
                            <img src={match.logo_a} alt={match.equipo_a} className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg" />
                          ) : (
                            <Shield size={64} className="text-slate-300" />
                          )}
                          <h3 className="font-bold text-slate-800 text-sm md:text-lg text-center leading-tight">{match.equipo_a}</h3>
                        </div>

                        <div className="flex flex-col items-center justify-center w-1/3">
                          {match.estado === 'finalizado' ? (
                            <div className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter">
                              {match.goles_a} <span className="text-slate-300">-</span> {match.goles_b}
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl border-4 border-white shadow-inner">VS</div>
                          )}
                          <span className="mt-2 text-xs font-bold text-slate-400 uppercase">
                            {match.estado === 'finalizado' ? 'Finalizado' : 'Por Jugar'}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-3 w-1/3 group-hover:transform group-hover:scale-105 transition-transform duration-300">
                          {match.logo_b ? (
                            <img src={match.logo_b} alt={match.equipo_b} className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg" />
                          ) : (
                            <Shield size={64} className="text-slate-300" />
                          )}
                          <h3 className="font-bold text-slate-800 text-sm md:text-lg text-center leading-tight">{match.equipo_b}</h3>
                        </div>
                      </div>
                      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
                        <Link to="/login" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                          Haz tu predicción &rarr;
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">¡Únete a la Competencia!</h3>
                    <p className="text-blue-100 text-lg">Demuestra que eres el mejor pronosticador.</p>
                  </div>
                  <Link to="/register" className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
                    Crear Cuenta Gratis
                  </Link>
                </div>
              </div>
            </div>

            {/* --- COLUMNA 3: SIDEBAR (DERECHA - 3/12) --- */}
            <div className="lg:col-span-3 space-y-8">

              {/* WIDGET: CUENTA REGRESIVA */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white border border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-yellow-400" size={20} />
                  <h3 className="font-bold text-lg">Cuenta Regresiva</h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-slate-950/50 rounded-lg p-2 text-center border border-slate-700">
                    <div className="text-xl font-bold text-yellow-400 font-mono">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Días</div>
                  </div>
                  <div className="bg-slate-950/50 rounded-lg p-2 text-center border border-slate-700">
                    <div className="text-xl font-bold text-yellow-400 font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Hrs</div>
                  </div>
                  <div className="bg-slate-950/50 rounded-lg p-2 text-center border border-slate-700">
                    <div className="text-xl font-bold text-yellow-400 font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Min</div>
                  </div>
                  <div className="bg-slate-950/50 rounded-lg p-2 text-center border border-slate-700">
                    <div className="text-xl font-bold text-yellow-400 font-mono">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Seg</div>
                  </div>
                </div>
              </div>

              {/* WIDGET: TOP RANKING (Tu código existente) */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                {/* ... Contenido del ranking igual que antes ... */}
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-500" /> Top Ranking
                  </h3>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">LIVE</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {topUsers.slice(0, 5).map((user, index) => (
                    <div key={index} className="p-3 flex items-center gap-3">
                      <div className="font-bold text-slate-500 text-xs">#{index + 1}</div>
                      <div className="flex-1 text-sm font-semibold">{user.nombre || 'Usuario'}</div>
                      <div className="font-bold text-blue-600 text-sm">{user.puntos || 0} pts</div>
                    </div>
                  ))}
                  {topUsers.length === 0 && <div className="p-4 text-center text-xs text-slate-400">Cargando...</div>}
                </div>
              </div>

              {/* WIDGET: REGLAS */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <span className="text-2xl">📜</span>
                  <h3 className="font-bold text-slate-800">Reglas del Juego</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Conoce cómo sumar puntos, las reglas de desempate y gana premios increíbles.
                </p>
                <a href="#reglas" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm">
                  Ver Reglamento
                </a>
              </div>

              {/* WIDGET: PATROCINADORES (Extra del Sidebar) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-yellow-500">★</span> Partners
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-100 h-20 rounded-lg flex items-center justify-center text-xs font-bold text-slate-300">Logo</div>
                  <div className="bg-white border border-slate-100 h-20 rounded-lg flex items-center justify-center text-xs font-bold text-slate-300">Logo</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ... Resto de secciones (Cómo funciona, Footer, etc.) ... */}
        <div id="como-funciona" className="bg-white py-16 md:py-24 border-t border-slate-200">
          {/* ... */}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        {/* ... */}
      </footer>
    </div>
  );
}

export default Home;