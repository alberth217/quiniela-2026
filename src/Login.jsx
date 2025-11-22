import React, { useState } from 'react';
import { Trophy, ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  
  // Estados para manejar los inputs y la interfaz
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    setLoading(true); // Activar carga

    try {
      // 1. Petición al Backend
      const response = await fetch('http://localhost:3000/login', {
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
        
        // Redirigir al Dashboard
        navigate('/Dashboard');
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
    <div className="min-h-screen bg-white flex">
      
      {/* --- COLUMNA IZQUIERDA (IMAGEN) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-slate-900">
        {/* 1. La imagen de fondo (sin opacidad, se ve nítida) */}
        <img 
          src="/img/login.jpg" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Estadio de fútbol"
        />
        
        {/* 2. El Overlay Azul (Aquí controlamos la transparencia: bg-blue-900/40 significa 40% de opacidad) */}
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
        
        {/* 3. El contenido (texto blanco para contrastar con el azul) */}
        <div className="relative z-10 text-center px-10">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl inline-block mb-6 shadow-xl border border-white/20">
            <Trophy size={48} className="text-yellow-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Quiniela 2026</h2>
          <p className="text-blue-100 text-lg max-w-md mx-auto leading-relaxed">
            "El fútbol no es solo un juego, es una pasión que une naciones y crea historias inolvidables."
          </p>
        </div>
      </div>

      {/* --- COLUMNA DERECHA (FORMULARIO) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md w-full">
          <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Volver al Inicio
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex lg:hidden bg-blue-600 text-white p-2 rounded-lg mb-3">
              <Trophy size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Bienvenido de nuevo</h2>
            <p className="text-slate-500 mt-2">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 border border-red-200 animate-pulse">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={20}/>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com" 
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={20}/>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded text-blue-600 focus:ring-blue-500" />
                Recordarme
              </label>
              <a href="#" className="text-blue-600 hover:underline font-medium">¿Olvidaste tu contraseña?</a>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className={`w-full text-white py-3 rounded-lg font-bold transition-colors shadow-lg 
                    ${loading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30'}`}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-600 text-sm">
            ¿No tienes una cuenta? {' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Crear Cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;