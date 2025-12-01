import React, { useState } from 'react';
import { Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  // Nuevo estado para notificaciones (tipo 'success' o 'error')
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función para mostrar notificaciones temporales
  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    // Ocultar automáticamente después de 4 segundos
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  // Validación
  const validateForm = () => {
    const { nombre, apellido, email, password } = formData;
    if (!nombre.trim() || !apellido.trim() || !email.trim() || !password.trim()) {
      return 'Por favor, completa todos los campos';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Por favor, ingresa un email válido';
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación local
    const validationError = validateForm();
    if (validationError) {
      showNotification(validationError, 'error');
      return;
    }

    setLoading(true);

    try {
      // ⚠️ Asegúrate de que esta URL sea la correcta de tu Render ⚠️
      const backendUrl = 'https://api-quiniela-444s.onrender.com/registro';

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // --- ÉXITO ---
        const userSession = { ...data, isLoggedIn: true };
        localStorage.setItem('quinielaUser', JSON.stringify(userSession));
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        // Mostramos mensaje de éxito bonito
        showNotification(`¡Bienvenido ${formData.nombre}! Redirigiendo...`, 'success');

        // Esperamos 1.5 segundos para que el usuario lea el mensaje antes de ir al dashboard
        setTimeout(() => {
          navigate('/Dashboard');
        }, 1500);

      } else {
        // --- ERROR DEL SERVIDOR ---
        showNotification(data.message || 'Ocurrió un error al registrar.', 'error');
      }

    } catch (err) {
      console.error(err);
      showNotification('No se pudo conectar con el servidor.', 'error');
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
          <div className="relative w-full max-w-xl mb-8 transition-transform hover:scale-105 duration-700">
            <img
              src="/img/Registro.png"
              className="w-full h-auto object-contain drop-shadow-2xl"
              alt="Predigol 3D Logo"
            />
          </div>

          {/* Texto de Bienvenida / Slogan */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Únete a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Predigol</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-lg mx-auto font-light">
              "Demuestra tu pasión, predice los resultados y compite con amigos en el mundial."
            </p>
          </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA (FORMULARIO MODERNO) --- */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-16 bg-white relative">
        <div className="w-full max-w-md space-y-8">

          {/* Cabecera Móvil (Solo visible en celular) */}
          <div className="lg:hidden text-center mb-8">
            <img src="/img/Registro.png" alt="Logo" className="h-12 w-auto mx-auto mb-4 object-contain" />
            <h2 className="text-3xl font-bold text-slate-900">Quiniela 2026</h2>
          </div>

          <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Volver al Inicio
          </Link>

          {/* Cabecera del Formulario */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Crear Cuenta</h2>
            <p className="text-slate-500 mt-2">Completa tus datos para comenzar a jugar.</p>
          </div>

          {/* Notificación de Error/Éxito */}
          {notification.show && (
            <div className={`p-4 rounded-md flex items-start gap-3 animate-pulse border-l-4 ${notification.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-700'
              : 'bg-red-50 border-red-500 text-red-700'
              }`}>
              {notification.type === 'success' ? <CheckCircle size={20} className="mt-0.5" /> : <AlertCircle size={20} className="mt-0.5" />}
              <div className="text-sm font-medium">{notification.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">

              {/* Input Nombre y Apellido (Grid) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Juan"
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Pérez"
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Input Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo Electrónico</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1 ml-1">Mínimo 6 caracteres</p>
              </div>
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
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Crear Cuenta Gratis <ArrowRight size={20} />
                </span>
              )}
            </button>
          </form>

          {/* Separador y Link Login */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/login" className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-slate-100 rounded-xl text-slate-700 font-bold hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;