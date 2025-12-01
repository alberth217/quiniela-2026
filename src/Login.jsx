import React, { useState } from 'react';
import { Trophy, Mail, Lock, AlertCircle, ArrowRight, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // Estados para manejar los inputs y la interfaz
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    setLoading(true); // Activar carga

    try {
      // 1. Petición al Backend
      // ⚠️ Asegúrate de que esta URL sea la correcta de tu Render ⚠️
      const backendUrl = 'https://api-quiniela-444s.onrender.com/login';
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. ÉXITO: Guardamos la sesión
        const userSession = {
          ...data,
          isLoggedIn: true
        };

        // Guardamos en localStorage para persistencia
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        // Redirigir al Dashboard con estado para mostrar el modal de bienvenida
        navigate('/Dashboard', { state: { fromLogin: true } });
      } else {
        // 3. ERROR (Usuario no existe o contraseña mal)
        setError(data.message || 'Credenciales inválidas');
      }

    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* --- COLUMNA IZQUIERDA (BRANDING PREMIUM) --- */}
      {/* Usamos un ancho de 55% en pantallas grandes para dar protagonismo a la marca */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-[#0f172a] items-center justify-center overflow-hidden">

        {/* Fondo decorativo con degradado sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-blue-900 opacity-90 z-0"></div>

        {/* Círculos de luz decorativos (Efecto moderno de fondo) */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

        <div className="relative z-10 w-full max-w-2xl px-12 flex flex-col items-center text-center">
          {/* Imagen Principal (Logo 3D) */}
          {/* 'object-contain' asegura que se vea todo el logo sin recortarse */}
          <div className="relative w-full max-w-xl mb-8 transition-transform hover:scale-105 duration-700">
            <img
              src="/img/login.png"
              className="w-full h-auto object-contain drop-shadow-2xl"
              alt="Predigol 3D Logo"
            />
          </div>

          {/* Texto de Bienvenida / Slogan */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Predigol</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-lg mx-auto font-light">
              "El fútbol no es solo un juego, es una pasión que une naciones y crea historias inolvidables."
            </p>
          </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA (FORMULARIO MODERNO) --- */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-16 bg-white relative">
        <div className="w-full max-w-md space-y-8">

          {/* Cabecera Móvil (Solo visible en celular) */}
          <div className="lg:hidden text-center mb-8">
            <img src="/img/login.png" alt="Logo" className="h-12 w-auto mx-auto mb-4 object-contain" />
            <h2 className="text-3xl font-bold text-slate-900">Quiniela 2026</h2>
          </div>

          <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Volver al Inicio
          </Link>

          {/* Cabecera del Formulario */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Iniciar Sesión</h2>
            <p className="text-slate-500 mt-2">Ingresa tus credenciales para acceder a tu panel.</p>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3 animate-pulse">
              <AlertCircle className="text-red-500 mt-0.5" size={20} />
              <div className="text-sm text-red-700 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">

              {/* Input Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo Electrónico</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
              </div>
            </div>

            {/* Checkbox Recordarme */}
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                Recordarme en este dispositivo
              </label>
            </div>

            {/* Botón Principal */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${loading ? 'bg-blue-400 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ingresando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Ingresar <ArrowRight size={20} />
                </span>
              )}
            </button>
          </form>

          {/* Separador y Link Registro */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">¿Aún no tienes cuenta?</span>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/register" className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-slate-100 rounded-xl text-slate-700 font-bold hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              Crear una cuenta gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;