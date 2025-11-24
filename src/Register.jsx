import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Nuevo estado para indicar carga

  // Función de validación robusta
  const validateForm = () => {
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
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true); // Activar estado de carga

    try {
      // 1. CONEXIÓN CON EL BACKEND
      const response = await fetch('https://api-quiniela-444s.onrender.com/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          email: email.trim(),
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. ÉXITO: Guardamos sesión localmente (como lo tenías antes) pero con datos reales de la DB
        const userSession = {
            ...data, // Datos que vienen de PostgreSQL (id, fecha_registro, etc)
            isLoggedIn: true
        };

        localStorage.setItem('quinielaUser', JSON.stringify(userSession));
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        alert(`¡Bienvenido ${nombre.trim()}! Tu cuenta ha sido creada en la base de datos.`);
        navigate('/Dashboard');
      } else {
        // 3. ERROR DEL BACKEND (ej. Email duplicado)
        setError(data.message || 'Ocurrió un error al registrar.');
      }

    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false); // Desactivar carga siempre
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-row-reverse">
      
      {/* --- IMAGEN (LADO DERECHO) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 relative overflow-hidden items-center justify-center">
        <img 
          src="/img/Registro.jpg"  
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          alt="Aficionados celebrando"
        />

          {/* 2. El Overlay Azul (Aquí controlamos la transparencia: bg-blue-900/40 significa 40% de opacidad) */}
          <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>

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

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 flex items-center gap-2 border border-red-200">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                    <input 
                      type="text" 
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                      placeholder="Juan" 
                      required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                    <input 
                      type="text" 
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
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

            <button 
              type="submit"
              disabled={loading} // Deshabilitar botón si está cargando
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors shadow-lg mt-2 
                ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-500/30'}`}
            >
              {loading ? 'Registrando...' : 'Registrarse Gratis'}
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