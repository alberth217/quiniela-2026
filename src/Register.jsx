import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, AlertCircle, CheckCircle, X, User } from 'lucide-react';
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
      // Si aún no tienes la URL de Render configurada en el código, reemplaza la línea de arriba.

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
    <div className="min-h-screen bg-white flex flex-row-reverse relative overflow-hidden">
      
      {/* --- COMPONENTE DE NOTIFICACIÓN FLOTANTE (TOAST) --- */}
      {notification.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 ease-in-out animate-in slide-in-from-top-5 ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <div>
            <h4 className="font-bold text-sm uppercase">{notification.type === 'success' ? '¡Éxito!' : 'Error'}</h4>
            <p className="text-sm font-medium opacity-90">{notification.message}</p>
          </div>
          <button onClick={() => setNotification({ ...notification, show: false })} className="ml-2 hover:bg-white/20 p-1 rounded-full">
            <X size={16} />
          </button>
        </div>
      )}

      {/* --- IMAGEN (LADO DERECHO) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 relative overflow-hidden items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1560272564-c83b66b1bccd?auto=format&fit=crop&w=1920&q=80" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          alt="Aficionados celebrando"
        />
        <div className="relative z-10 text-center px-10">
           <h2 className="text-4xl font-bold text-white mb-4">Únete a la Pasión</h2>
           <p className="text-blue-100 text-lg">Crea tu cuenta y comienza a predecir los resultados del mundial.</p>
        </div>
      </div>

      {/* --- FORMULARIO (LADO IZQUIERDO) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md w-full">
          <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Volver al Inicio
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Crear Cuenta</h2>
            <p className="text-slate-500 mt-2">Completa tus datos para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
            
            {/* Overlay de carga (opcional, para evitar doble click) */}
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                      <input 
                        type="text" 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                        placeholder="Juan" 
                        required
                      />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                    <input 
                      type="text" 
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      placeholder="Pérez" 
                      required
                    />
                </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={20}/>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  required
                />
              </div>
              <p className="text-xs text-slate-400 mt-1 ml-1">Mínimo 6 caracteres</p>
            </div>

            <button 
              type="submit"
              disabled={loading} 
              className={`w-full py-3.5 rounded-lg font-bold text-white transition-all shadow-lg mt-4 flex items-center justify-center gap-2
                ${loading 
                  ? 'bg-blue-400 cursor-wait' 
                  : notification.type === 'success'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-0.5'
                }`}
            >
              {loading ? (
                <>Procesando...</>
              ) : notification.type === 'success' ? (
                <><CheckCircle size={20} /> ¡Registrado!</>
              ) : (
                'Crear Cuenta Gratis'
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-600 text-sm">
            ¿Ya tienes cuenta? {' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;