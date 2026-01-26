import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const PagoExitoso = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir al dashboard despues de unos segundos
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in-up">
                <div className="bg-green-100 p-4 rounded-full inline-flex mb-6">
                    <CheckCircle size={48} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">¡Pago Exitoso!</h1>
                <p className="text-slate-500 mb-8">
                    Tu inscripción ha sido confirmada. Ya puedes participar en la quiniela.
                    <br /><br />
                    Redirigiendo al panel...
                </p>
                <Link to="/dashboard" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-slate-800 transition-colors">
                    Ir al Dashboard ahora <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};

export default PagoExitoso;
