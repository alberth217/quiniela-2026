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

  // Fetch de Partidos Destacados
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${API_URL}/partidos`);
        if (res.ok) {
          const data = await res.json();
          // Filtrar o tomar los primeros 3-4 para mostrar en Home
          setMatches(data.slice(0, 4)); // Mostrar hasta 4 partidos
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, []);

  // Cambio automático de imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 300); // Duración de la transición
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Contador regresivo para el Mundial 2026 (11 de Junio de 2026)
  useEffect(() => {
    const targetDate = new Date('2026-06-11T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Función para cambiar de imagen manualmente
  const goToImage = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/img/logo.png" alt="Logo Quiniela" className="h-12 w-auto object-contain" />
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">Quiniela 2026</span>
          </Link>
          <div className="flex gap-2 sm:gap-3">
            <a
              href="#reglas"
              className="text-sm font-medium text-slate-600 hover:text-blue-700 px-2 sm:px-3 py-2 transition-colors hidden md:block"
            >
              Reglas
            </a>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-blue-700 px-2 sm:px-3 py-2 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
            >
              Crear Cuenta
            </Link>

          </div>
        </div>
      </nav>

      {/* --- TICKER DE NOTICIAS (MARQUESINA) --- */}
      <div className="bg-blue-950 text-white py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-xs font-medium whitespace-nowrap animate-marquee">
            <span className="inline-block">¡El pozo acumulado supera los $50,000!</span>
            <span className="text-blue-300">|</span>
            <span className="inline-block">Messi confirma su último mundial</span>
            <span className="text-blue-300">|</span>
            <span className="inline-block">Regístrate hoy y duplica tus puntos</span>
            <span className="text-blue-300">|</span>
            <span className="inline-block">¡El pozo acumulado supera los $50,000!</span>
            <span className="text-blue-300">|</span>
            <span className="inline-block">Messi confirma su último mundial</span>
            <span className="text-blue-300">|</span>
            <span className="inline-block">Regístrate hoy y duplica tus puntos</span>
          </div>
        </div>
      </div>

      {/* --- LAYOUT PRINCIPAL (GRID DE 2 COLUMNAS: 25% - 75%) --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* === COLUMNA IZQUIERDA (PATROCINADORES) - 25% (1 de 4) === */}
          <div className="lg:col-span-1 space-y-6 order-last lg:order-first hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Patrocinadores Oficiales</h3>
              <div className="space-y-6">
                {/* Sponsor 1: Nike */}
                <div className="group relative bg-white rounded-xl p-4 flex items-center justify-center border border-slate-100 h-32 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src="/img/nike.jpg" alt="Nike" className="max-h-20 max-w-full object-contain relative z-10 mix-blend-multiply" />
                </div>
                {/* Sponsor 2: Adidas */}
                <div className="group relative bg-white rounded-xl p-4 flex items-center justify-center border border-slate-100 h-32 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src="/img/adidas.jpg" alt="Adidas" className="max-h-20 max-w-full object-contain relative z-10 mix-blend-multiply" />
                </div>
                {/* Sponsor 3: Coca-Cola */}
                <div className="group relative bg-white rounded-xl p-4 flex items-center justify-center border border-slate-100 h-32 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src="/img/coca-cola.jpg" alt="Coca-Cola" className="max-h-20 max-w-full object-contain relative z-10 mix-blend-multiply" />
                </div>

                {/* Banner Call to Action */}
                <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-xl p-4 text-white text-center shadow-lg transform transition-transform hover:scale-105">
                  <p className="font-bold text-lg mb-2 leading-tight">¡Tu Marca Aquí!</p>
                  <p className="text-xs text-blue-100 mb-3">Llega a miles de fanáticos.</p>
                  <button className="bg-white text-blue-700 text-xs px-4 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-sm">
                    Contactar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* === COLUMNA DERECHA (CONTENIDO PRINCIPAL) - 75% (3 de 4) === */}
          <div className="lg:col-span-3 space-y-8">

            {/* HERO SECTION (BANNER) - CARRUSEL */}
            <div className="relative rounded-2xl overflow-hidden bg-blue-900 text-white h-96 sm:h-80 flex flex-col justify-center items-start p-6 sm:p-10 shadow-xl group">
              {/* Overlay oscuro para mejor legibilidad del texto */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>

              {/* Carrusel de imágenes */}
              <div className="absolute inset-0">
                {heroImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Hero ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentImageIndex && !isTransitioning
                      ? 'opacity-100'
                      : 'opacity-0'
                      }`}
                  />
                ))}
              </div>

              {/* Contenido del Hero */}
              <div className="relative z-20 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-blue-950/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-blue-200 mb-4 border border-blue-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Mundial 2026 USA, México, Canadá
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4 drop-shadow-2xl text-white">
                  Predice, <br />
                  <span className="text-blue-200">Compite,</span> <br />
                  Gana.
                </h1>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto">
                    Registrarse como Cliente
                  </button>
                  <button className="bg-blue-900/40 backdrop-blur-sm text-white border border-blue-400/50 px-6 py-3 rounded-lg font-semibold hover:bg-blue-800/60 transition-all w-full sm:w-auto">
                    Demo Admin
                  </button>
                </div>
              </div>

              {/* Indicadores de posición (puntos) */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`transition-all duration-300 rounded-full ${index === currentImageIndex
                      ? 'bg-white w-8 h-2'
                      : 'bg-white/40 w-2 h-2 hover:bg-white/60'
                      }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* GRID INTERNO PARA WIDGETS Y PARTIDOS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* COLUMNA DE PARTIDOS (2/3 del espacio derecho) */}
              <div className="lg:col-span-2 space-y-8">
                {/* SECCIÓN PRÓXIMOS PARTIDOS */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar className="text-blue-600" size={24} />
                    Partidos Destacados
                  </h3>
                  <div className="space-y-4">
                    {loadingMatches ? (
                      <div className="flex justify-center py-10">
                        <Loader className="animate-spin text-blue-600" size={32} />
                      </div>
                    ) : matches.length > 0 ? (
                      matches.map((match, idx) => (
                        <div key={match.id || idx} className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group bg-slate-900">
                          {/* Imagen de fondo (Placeholder o dinámica si hubiera) */}
                          <img
                            src={`/img/hero${(idx % 3) + 1}.jpg`} // Fallback a imágenes locales rotativas
                            alt={`${match.equipo_a} vs ${match.equipo_b}`}
                            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Contenido */}
                          <div className="relative z-10 p-4 sm:p-6">
                            {/* Cabecera */}
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                              <div className="text-xs sm:text-sm text-white/90 font-medium bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                {match.fecha} • {match.hora}
                              </div>
                              <div className="text-xs sm:text-sm text-white font-semibold bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full truncate max-w-[150px]">
                                {match.fase}
                              </div>
                            </div>

                            {/* Enfrentamiento */}
                            <div className="flex items-center justify-center gap-2 sm:gap-6 mb-4 sm:mb-6">
                              <div className="text-center flex-1 flex flex-col items-center gap-2">
                                {match.logo_a ? (
                                  <img src={match.logo_a} alt={match.equipo_a} className="h-12 w-12 object-contain drop-shadow-md" />
                                ) : (
                                  <Shield size={40} className="text-slate-300" />
                                )}
                                <div className="text-lg sm:text-xl font-bold text-white drop-shadow-lg truncate w-full">{match.equipo_a}</div>
                                {match.estado === 'finalizado' && <div className="text-3xl font-bold text-yellow-400">{match.goles_a}</div>}
                              </div>
                              <div className="text-white/80 font-bold text-xl sm:text-2xl px-2">
                                {match.estado === 'finalizado' ? '-' : 'VS'}
                              </div>
                              <div className="text-center flex-1 flex flex-col items-center gap-2">
                                {match.logo_b ? (
                                  <img src={match.logo_b} alt={match.equipo_b} className="h-12 w-12 object-contain drop-shadow-md" />
                                ) : (
                                  <Shield size={40} className="text-slate-300" />
                                )}
                                <div className="text-lg sm:text-xl font-bold text-white drop-shadow-lg truncate w-full">{match.equipo_b}</div>
                                {match.estado === 'finalizado' && <div className="text-3xl font-bold text-yellow-400">{match.goles_b}</div>}
                              </div>
                            </div>

                            {/* Botones de pronóstico (Solo si no ha finalizado) */}
                            {match.estado !== 'finalizado' && (
                              <div className="flex gap-2 sm:gap-3">
                                <button className="flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 text-xs sm:text-sm font-bold text-white hover:bg-green-500 hover:border-green-500 hover:shadow-lg transition-all transform hover:scale-105">
                                  Local
                                </button>
                                <button className="flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 text-xs sm:text-sm font-bold text-white hover:bg-green-500 hover:border-green-500 hover:shadow-lg transition-all transform hover:scale-105">
                                  Empate
                                </button>
                                <button className="flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 text-xs sm:text-sm font-bold text-white hover:bg-green-500 hover:border-green-500 hover:shadow-lg transition-all transform hover:scale-105">
                                  Visita
                                </button>
                              </div>
                            )}
                            {match.estado === 'finalizado' && (
                              <div className="text-center">
                                <span className="bg-slate-800/80 text-white px-4 py-1 rounded-full text-xs font-bold border border-slate-600">Partido Finalizado</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No hay partidos destacados por el momento.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* STATS BAR */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                    <div className="text-blue-600 flex justify-center mb-1"><Users size={24} /></div>
                    <div className="text-2xl font-bold text-slate-800">2.4K</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Usuarios</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                    <div className="text-blue-600 flex justify-center mb-1"><CheckCircle size={24} /></div>
                    <div className="text-2xl font-bold text-slate-800">48K</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Predicciones</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                    <div className="text-blue-600 flex justify-center mb-1"><Calendar size={24} /></div>
                    <div className="text-2xl font-bold text-slate-800">104</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Partidos</div>
                  </div>
                </div>
              </div>

              {/* COLUMNA DE WIDGETS (1/3 del espacio derecho) */}
              <div className="space-y-6">
                {/* CONTADOR REGRESIVO */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-lg p-5 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="text-yellow-400" size={18} />
                      <h3 className="text-sm font-bold">Cuenta Regresiva</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      <div className="bg-slate-800/50 rounded p-2 text-center border border-slate-700">
                        <div className="text-lg font-bold text-yellow-400">{String(timeLeft.days).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-400">Días</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2 text-center border border-slate-700">
                        <div className="text-lg font-bold text-yellow-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-400">Hrs</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2 text-center border border-slate-700">
                        <div className="text-lg font-bold text-yellow-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-400">Min</div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-2 text-center border border-slate-700">
                        <div className="text-lg font-bold text-yellow-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-400">Seg</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WIDGET RANKING */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                  <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-800">Top Ranking</h3>
                    <span className="text-[9px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      LIVE
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[
                      { name: "Carlos M.", points: 156, rank: 1, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                      { name: "Ana R.", points: 142, rank: 2, color: "bg-slate-100 text-slate-600 border-slate-200" },
                      { name: "Luis P.", points: 138, rank: 3, color: "bg-orange-50 text-orange-700 border-orange-200" },
                    ].map((user) => (
                      <div key={user.rank} className="p-2 flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${user.color}`}>
                          {user.rank <= 3 ? <Trophy size={10} /> : user.rank}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{user.name}</p>
                        </div>
                        <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">{user.points}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WIDGET REGLAS (NUEVO) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                    <span className="text-xl">📜</span>
                    <h3 className="font-bold text-slate-800">Reglas del Juego</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Conoce cómo sumar puntos y ganar premios increíbles.
                  </p>
                  <a
                    href="#reglas"
                    className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition-colors text-sm"
                  >
                    Ver Reglamento
                  </a>
                </div>

                {/* WIDGET POZO */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-4 text-white text-center relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-sm font-bold mb-1">Pozo Acumulado</h3>
                    <div className="text-2xl font-black text-yellow-300 drop-shadow-md mb-2">$50,000</div>
                    <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs py-1.5 rounded-lg font-semibold transition-colors border border-white/30">
                      Ver Premios
                    </button>
                  </div>
                </div>

                {/* CARD ADMIN */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                      <Shield size={16} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-xs text-slate-900">Admin Access</h4>
                      <button className="text-[10px] text-blue-600 font-bold hover:underline">Ingresar</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* CÓMO FUNCIONA */}
            <div className="py-4 border-t border-slate-100 pt-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                Cómo Funciona
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Regístrate Gratis", desc: "Crea tu cuenta en segundos.", icon: Users },
                  { title: "Haz Predicciones", desc: "Define marcadores antes del cierre.", icon: Calendar },
                  { title: "Gana Premios", desc: "Suma puntos y escala el ranking.", icon: Trophy }
                ].map((step, idx) => (
                  <div key={idx} className="text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <step.icon size={20} />
                    </div>
                    <h4 className="font-bold text-slate-900">{step.title}</h4>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN DE REGLAS (MOVIDO AQUÍ) */}
            <div id="reglas" className="scroll-mt-24">
              <RulesSection />
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER SIMPLE */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2025 Quiniela Mundial. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;