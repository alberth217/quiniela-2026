import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, CheckCircle, ArrowRight, Shield, Clock, Loader } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [topUsers, setTopUsers] = useState([]);

  // Fetch de Partidos y Ranking
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
          if (Array.isArray(data)) {
            setTopUsers(data);
          }
        }
      } catch (error) {
        console.error("Error fetching ranking:", error);
      }
    };

    fetchMatches();
    fetchRanking();
  }, []);

  // Efecto para el carrusel
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

  // Efecto para la cuenta regresiva
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
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
        {/* HERO SECTION CON CARRUSEL */}
        <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-slate-900">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-60' : 'opacity-0'
                }`}
            >
              <img src={img} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
            <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-bold mb-6 backdrop-blur-sm animate-fade-in-down">
              🏆 La Copa del Mundo 2026
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-lg animate-fade-in-up">
              Vive la Pasión <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Gana en Grande</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md animate-fade-in-up delay-100">
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

        {/* SECCIÓN PRINCIPAL: AHORA CON 3 COLUMNAS (Publicidad - Partidos - Sidebar) */}
        {/* Cambié max-w-7xl a max-w-[1600px] para dar espacio a la 3ra columna sin apretar el centro */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

          {/* AQUÍ ESTÁ EL CAMBIO DE GRID: De 3 columnas pasamos a 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* --- NUEVA COLUMNA IZQUIERDA: PUBLICIDAD (Ocupa 1 columna) --- */}
            <div className="hidden lg:block space-y-6">
              <div className="sticky top-24 space-y-6">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Publicidad</div>

                {/* Banner Vertical Ejemplo 1 */}
                <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm flex flex-col items-center">
                  <img src="/img/ad-vertical-1.jpg" alt="Publicidad" className="w-full h-auto rounded-lg object-cover" />
                  <span className="text-[10px] text-slate-400 mt-2">Patrocinado</span>
                </div>

                {/* Banner Vertical Ejemplo 2 */}
                <div className="bg-blue-900 rounded-xl p-4 text-white text-center shadow-md h-64 flex flex-col justify-center items-center">
                  <h4 className="font-bold text-lg mb-2">Tu Marca Aquí</h4>
                  <p className="text-xs text-blue-200 mb-4">Anúnciate con nosotros</p>
                  <button className="bg-white text-blue-900 px-4 py-2 rounded-full text-xs font-bold">Contactar</button>
                </div>

                {/* WIDGET: PATROCINADORES (Tu código original) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-yellow-500">★</span> Patrocinadores Oficiales
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Sponsor 1: Nike */}
                    <div className="group relative bg-white rounded-xl border border-slate-100 h-32 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img src="/img/nike.jpg" alt="Nike" className="w-full h-full object-cover relative z-10" />
                    </div>

                    {/* Sponsor 2: Adidas */}
                    <div className="group relative bg-white rounded-xl border border-slate-100 h-32 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img src="/img/adidas.jpg" alt="Adidas" className="w-full h-full object-cover relative z-10" />
                    </div>

                    {/* Sponsor 3: Coca-Cola (Full Width) */}
                    <div className="col-span-2 group relative bg-white rounded-xl border border-slate-100 h-32 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img src="/img/coca-cola.jpg" alt="Coca-Cola" className="w-full h-full object-cover relative z-10" />
                    </div>
                  </div>
                </div>
              </div>


            </div>

            {/* --- COLUMNA CENTRAL: PARTIDOS DESTACADOS (Ocupa 2 columnas) --- */}
            <div className="lg:col-span-2 space-y-12">

              {/* Título de Sección */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Calendar size={24} /></span>
                  Partidos Destacados
                </h2>
                <Link to="/login" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                  Ver Todos <ArrowRight size={16} />
                </Link>
              </div>

              {/* Lista de Partidos (Tu código original) */}
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
                        {/* Equipo A */}
                        <div className="flex flex-col items-center gap-3 w-1/3 group-hover:transform group-hover:scale-105 transition-transform duration-300">
                          {match.logo_a ? (
                            <img src={match.logo_a} alt={match.equipo_a} className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg" />
                          ) : (
                            <Shield size={64} className="text-slate-300" />
                          )}
                          <h3 className="font-bold text-slate-800 text-sm md:text-lg text-center leading-tight">{match.equipo_a}</h3>
                        </div>

                        {/* VS / Marcador */}
                        <div className="flex flex-col items-center justify-center w-1/3">
                          {match.estado === 'finalizado' ? (
                            <div className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter">
                              {match.goles_a} <span className="text-slate-300">-</span> {match.goles_b}
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl border-4 border-white shadow-inner">
                              VS
                            </div>
                          )}
                          <span className="mt-2 text-xs font-bold text-slate-400 uppercase">
                            {match.estado === 'finalizado' ? 'Finalizado' : 'Por Jugar'}
                          </span>
                        </div>

                        {/* Equipo B */}
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

              {/* Banner Promocional (Tu código original) */}
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

            {/* --- COLUMNA DERECHA: SIDEBAR (Ocupa 1 columna) --- */}
            <div className="space-y-8">

              {/* WIDGET: CUENTA REGRESIVA (Tu código original) */}
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

              {/* WIDGET: TOP RANKING (Tu código original) */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-500" /> Top Ranking
                  </h3>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    LIVE
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {topUsers.length > 0 ? (
                    topUsers.slice(0, 5).map((user, index) => {
                      // Asignar colores según el ranking (1, 2, 3)
                      let rankColor = "bg-slate-100 text-slate-600 border-slate-200";
                      if (index === 0) rankColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
                      if (index === 1) rankColor = "bg-slate-100 text-slate-600 border-slate-200"; // Plata
                      if (index === 2) rankColor = "bg-orange-50 text-orange-700 border-orange-200";

                      return (
                        <div key={user.id || index} className="p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${rankColor}`}>
                            {index < 3 ? <Trophy size={14} /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {user.nombre || user.name || 'Usuario'}
                            </p>
                          </div>
                          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs">
                            {user.puntos} pts
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-slate-400 text-sm">
                      <Loader size={20} className="animate-spin mx-auto mb-2" />
                      Cargando ranking...
                    </div>
                  )}
                </div>
                <div className="p-3 text-center border-t border-slate-100 bg-slate-50/50">
                  <Link to="/login" className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center justify-center gap-1 mx-auto transition-colors">
                    Ver Ranking Completo <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              {/* WIDGET: REGLAS (Tu código original) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <span className="text-2xl">📜</span>
                  <h3 className="font-bold text-slate-800">Reglas del Juego</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Conoce cómo sumar puntos, las reglas de desempate y gana premios increíbles.
                </p>
                <a
                  href="#reglas"
                  className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  Ver Reglamento
                </a>
              </div>



              {/* WIDGET: ESTADÍSTICAS (Tu código original) */}
              <div className="bg-slate-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h3 className="font-bold text-lg mb-6 relative z-10">Estadísticas Globales</h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 text-center">
                    <div className="text-blue-400 flex justify-center mb-2"><Users size={24} /></div>
                    <div className="text-2xl font-bold">2.5K+</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Usuarios</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 text-center">
                    <div className="text-green-400 flex justify-center mb-2"><CheckCircle size={24} /></div>
                    <div className="text-2xl font-bold">48K</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Predicciones</div>
                  </div>
                  <div className="col-span-2 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 text-center flex items-center justify-between px-8">
                    <div className="text-left">
                      <div className="text-2xl font-bold">104</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Partidos</div>
                    </div>
                    <div className="text-yellow-400"><Calendar size={32} /></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* SECCIÓN CÓMO FUNCIONA */}
        <div id="como-funciona" className="bg-white py-16 md:py-24 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Paso a Paso</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">¿Cómo Funciona?</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">Es muy fácil participar y ganar. Solo sigue estos 3 simples pasos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-xl transform group-hover:-translate-y-2">
                  <Users size={32} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. Regístrate</h3>
                <p className="text-slate-500 leading-relaxed">Crea tu cuenta en segundos y obtén acceso inmediato a la plataforma.</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-xl transform group-hover:-translate-y-2">
                  <CheckCircle size={32} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. Pronostica</h3>
                <p className="text-slate-500 leading-relaxed">Predice los resultados de los partidos del Mundial 2026.</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-xl transform group-hover:-translate-y-2">
                  <Trophy size={32} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. Gana</h3>
                <p className="text-slate-500 leading-relaxed">Suma puntos por cada acierto y escala en el ranking global.</p>
              </div>
            </div>
          </div>
        </div>

        {/* REGLAS SECTION COMPONENT */}
        <div id="reglas" className="bg-slate-50 py-16 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <RulesSection />
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/img/logo.png" alt="Logo" className="h-10 opacity-80 grayscale hover:grayscale-0 transition-all" />
                <span className="text-white font-bold text-xl">Quiniela 2026</span>
              </div>
              <p className="text-sm max-w-xs">
                La plataforma líder para pronósticos deportivos del Mundial 2026. Juega, diviértete y gana.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Registrarse</Link></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Cómo Funciona</a></li>
                <li><a href="#reglas" className="hover:text-white transition-colors">Reglas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs">
            &copy; {new Date().getFullYear()} Quiniela 2026. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;