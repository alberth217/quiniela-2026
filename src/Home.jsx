import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, CheckCircle, ArrowRight, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import RulesSection from './RulesSection';

// Array de imágenes del carrusel (Updated)
const heroImages = [
  'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522778119026-d647f0565c6d?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1989&auto=format&fit=crop',
];

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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
            <img src="/img/logo.png" alt="Logo Quiniela" className="h-16 sm:h-20 w-auto object-contain" />
            {/* RESPONSIVE: Ocultamos el texto en móviles para dar espacio a los botones */}
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

      {/* --- LAYOUT PRINCIPAL (GRID DE 3 COLUMNAS) --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

          {/* === COLUMNA IZQUIERDA (PUBLICIDAD) - Ocupa 3 de 10 partes (30%) === */}
          <div className="lg:col-span-3 space-y-6 order-last lg:order-first hidden lg:block">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Patrocinadores</h3>
              <div className="space-y-4">
                {/* Sponsor 1 */}
                <div className="bg-slate-50 rounded-lg p-4 flex flex-col items-center justify-center border border-slate-100 h-48 animate-pulse">
                  <span className="font-black text-slate-300 text-2xl">NIKE</span>
                </div>
                {/* Sponsor 2 */}
                <div className="bg-slate-50 rounded-lg p-4 flex flex-col items-center justify-center border border-slate-100 h-48 animate-pulse delay-75">
                  <span className="font-black text-slate-300 text-2xl">ADIDAS</span>
                </div>
                {/* Sponsor 3 */}
                <div className="bg-slate-50 rounded-lg p-4 flex flex-col items-center justify-center border border-slate-100 h-48 animate-pulse delay-150">
                  <span className="font-black text-slate-300 text-2xl">COCA-COLA</span>
                </div>
                {/* Banner Vertical */}
                <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg h-64 flex items-center justify-center text-white text-center p-2">
                  <div>
                    <p className="font-bold text-lg mb-2">¡Tu Marca Aquí!</p>
                    <button className="bg-white text-blue-700 text-xs px-3 py-1 rounded-full font-bold">Contactar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === COLUMNA CENTRAL (CONTENIDO PRINCIPAL) - Ocupa 5 de 10 partes (50%) === */}
          <div className="lg:col-span-5 space-y-8">

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
                {/* RESPONSIVE: Texto más pequeño en móvil (3xl) y grande en escritorio (5xl) */}
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

            {/* SECCIÓN DE REGLAS (MOVIDO AQUÍ) */}
            <div id="reglas" className="scroll-mt-24">
              <RulesSection />
            </div>

            {/* SECCIÓN PRÓXIMOS PARTIDOS */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Partidos Destacados</h3>
              <div className="space-y-4">
                {[
                  {
                    date: '14 Jun',
                    stadium: 'Estadio Azteca',
                    home: 'MÉXICO',
                    homeFlag: '🇲🇽',
                    away: 'ALEMANIA',
                    awayFlag: '🇩🇪',
                    image: '/img/Mexico-vs-Alemania.jpeg'
                  },
                  {
                    date: '15 Jun',
                    stadium: 'MetLife Stadium',
                    home: 'BRASIL',
                    homeFlag: '🇧🇷',
                    away: 'FRANCIA',
                    awayFlag: '🇫🇷',
                    image: '/img/brazil-vs-france.jpg'
                  },
                  {
                    date: '16 Jun',
                    stadium: 'BMO Field',
                    home: 'ARGENTINA',
                    homeFlag: '🇦🇷',
                    away: 'ESPAÑA',
                    awayFlag: '🇪🇸',
                    image: '/img/Argentina vs España.png'
                  },
                ].map((match, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                    {/* Imagen de fondo */}
                    <img
                      src={match.image}
                      alt={`${match.home} vs ${match.away}`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay oscuro */}
                    <div className="absolute inset-0 bg-black/60"></div>

                    {/* Contenido */}
                    <div className="relative z-10 p-4 sm:p-6">
                      {/* Cabecera */}
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="text-xs sm:text-sm text-white/90 font-medium bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                          {match.date}
                        </div>
                        <div className="text-xs sm:text-sm text-white font-semibold bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full truncate max-w-[150px]">
                          {match.stadium}
                        </div>
                      </div>

                      {/* Enfrentamiento */}
                      <div className="flex items-center justify-center gap-2 sm:gap-6 mb-4 sm:mb-6">
                        <div className="text-center flex-1">
                          {/* RESPONSIVE: Banderas más pequeñas en móvil */}
                          <div className="text-3xl sm:text-5xl mb-1 sm:mb-2">{match.homeFlag}</div>
                          <div className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg truncate">{match.home}</div>
                        </div>
                        <div className="text-white/80 font-bold text-xl sm:text-2xl px-2">VS</div>
                        <div className="text-center flex-1">
                          <div className="text-3xl sm:text-5xl mb-1 sm:mb-2">{match.awayFlag}</div>
                          <div className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg truncate">{match.away}</div>
                        </div>
                      </div>

                      {/* Botones de pronóstico */}
                      <div className="flex gap-2 sm:gap-3">
                        <button className="flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 text-xs sm:text-sm font-bold text-white hover:bg-green-500 hover:border-green-500 hover:shadow-lg transition-all transform hover:scale-105">
                          Local (1)
                        </button>
                        <button className="flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 text-xs sm:text-sm font-bold text-white hover:bg-green-500 hover:border-green-500 hover:shadow-lg transition-all transform hover:scale-105">
                          Empate
                        </button>
                        <button className="flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/30 text-xs sm:text-sm font-bold text-white hover:bg-green-500 hover:border-green-500 hover:shadow-lg transition-all transform hover:scale-105">
                          Visita (2)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STATS BAR */}
            {/* RESPONSIVE: grid-cols-1 en móvil para apilar, grid-cols-3 en desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 text-center hover:border-blue-100 transition-colors">
                <div className="text-blue-600 flex justify-center mb-2"><Users size={28} strokeWidth={1.5} /></div>
                <div className="text-3xl font-bold text-slate-800">2,450</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Participantes</div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 text-center hover:border-blue-100 transition-colors">
                <div className="text-blue-600 flex justify-center mb-2"><CheckCircle size={28} strokeWidth={1.5} /></div>
                <div className="text-3xl font-bold text-slate-800">48.5K</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Predicciones</div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 text-center hover:border-blue-100 transition-colors">
                <div className="text-blue-600 flex justify-center mb-2"><Calendar size={28} strokeWidth={1.5} /></div>
                <div className="text-3xl font-bold text-slate-800">104</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Partidos</div>
              </div>
            </div>

            {/* CÓMO FUNCIONA */}
            <div className="py-4">
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

            {/* SISTEMA DE PUNTOS */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-6">Sistema de Puntos</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-green-50 p-3 rounded-full text-green-600">
                    <ArrowRight size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-green-600">+1 Punto</h4>
                    <p className="text-slate-600 font-medium text-sm">Por acertar el signo (Ganador o Empate)</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-yellow-50 p-3 rounded-full text-yellow-600">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-yellow-600">+3 Puntos</h4>
                    <p className="text-slate-600 font-medium text-sm">Por acertar el marcador exacto</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE PREMIOS */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-6">Premios Increíbles</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    place: '1er Lugar',
                    title: 'Viaje Todo Pagado',
                    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop',
                    description: 'Disfruta de un viaje inolvidable'
                  },
                  {
                    place: '2do Lugar',
                    title: 'Tech Pack',
                    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=2070&auto=format&fit=crop',
                    description: 'iPhone, MacBook y más'
                  },
                  {
                    place: '3er Lugar',
                    title: 'Bono en Efectivo',
                    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070&auto=format&fit=crop',
                    description: 'Dinero en efectivo'
                  }
                ].map((prize, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={prize.image}
                        alt={prize.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {prize.place}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 mb-1">{prize.title}</h4>
                      <p className="text-sm text-slate-600">{prize.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* === COLUMNA DERECHA (SIDEBAR) - Ocupa 2 de 10 partes (20%) === */}
          <div className="lg:col-span-2 space-y-6">

            {/* CONTADOR REGRESIVO */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="text-yellow-400" size={20} />
                  <h3 className="text-lg font-bold">Tiempo para el Mundial</h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-400">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-xs text-slate-400 mt-1">Días</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs text-slate-400 mt-1">Horas</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs text-slate-400 mt-1">Min</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs text-slate-400 mt-1">Seg</div>
                  </div>
                </div>
                <p className="text-center text-xs text-slate-400 mt-4">11 de Junio, 2026</p>
              </div>
            </div>

            {/* WIDGET RANKING */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Ranking Global</h3>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  EN VIVO
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { name: "Carlos M.", points: 156, rank: 1, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                  { name: "Ana R.", points: 142, rank: 2, color: "bg-slate-100 text-slate-600 border-slate-200" },
                  { name: "Luis P.", points: 138, rank: 3, color: "bg-orange-50 text-orange-700 border-orange-200" },
                  { name: "María G.", points: 129, rank: 4, color: "bg-white text-slate-500 border-slate-100" },
                  { name: "Jorge S.", points: 124, rank: 5, color: "bg-white text-slate-500 border-slate-100" },
                ].map((user) => (
                  <div key={user.rank} className="p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${user.color}`}>
                      {user.rank <= 3 ? <Trophy size={14} /> : user.rank}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.points - 20} aciertos</p>
                    </div>
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">{user.points}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-100 bg-slate-50/50">
                <button className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center justify-center gap-1 mx-auto transition-colors">
                  Ver Ranking Completo <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* WIDGET POZO */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white text-center relative overflow-hidden ring-1 ring-blue-500/50">
              {/* Decoración de fondo */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500 rounded-full opacity-30 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-800/50 to-transparent"></div>

              <div className="relative z-10">
                <div className="bg-blue-500/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-blue-400/20">
                  <Trophy className="text-yellow-300 drop-shadow-md" size={32} fill="currentColor" />
                </div>
                <h3 className="text-lg font-bold mb-1">Pozo Acumulado</h3>
                <p className="text-blue-100 text-xs mb-5 opacity-90">Compite por los premios</p>

                <div className="flex justify-center gap-2 text-center">
                  <div className="bg-blue-800/40 backdrop-blur border border-blue-500/30 p-2 rounded-lg flex-1">
                    <div className="text-[10px] text-blue-200 font-medium uppercase">1º Lugar</div>
                    <div className="font-bold text-yellow-300 text-lg">50%</div>
                  </div>
                  <div className="bg-blue-800/40 backdrop-blur border border-blue-500/30 p-2 rounded-lg flex-1">
                    <div className="text-[10px] text-blue-200 font-medium uppercase">2º Lugar</div>
                    <div className="font-bold text-slate-200 text-lg">30%</div>
                  </div>
                  <div className="bg-blue-800/40 backdrop-blur border border-blue-500/30 p-2 rounded-lg flex-1">
                    <div className="text-[10px] text-blue-200 font-medium uppercase">3º Lugar</div>
                    <div className="font-bold text-orange-300 text-lg">20%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD ADMIN */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:border-slate-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                  <Shield size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-slate-900">Admin Access</h4>
                  <p className="text-xs text-slate-500 mt-0.5 mb-3">Gestión de resultados.</p>
                  <button className="w-full py-1.5 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors">
                    Ingresar
                  </button>
                </div>
              </div>
            </div>

            {/* TARJETA FINAL - ¿LISTO PARA COMPETIR? */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <Trophy className="text-blue-600" size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">¿Listo para Competir?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Únete ahora y demuestra tu conocimiento del fútbol mundialista.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Crear Cuenta Gratis
              </button>
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