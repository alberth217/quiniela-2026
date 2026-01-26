import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

const PagoFallido = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in-up">
                <div className="bg-red-100 p-4 rounded-full inline-flex mb-6">
                    <XCircle size={48} className="text-red-600" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Pago Cancelado</h1>
                <p className="text-slate-500 mb-8">
                    El proceso de pago fue cancelado o hubo un error. No se ha realizado ningún cargo.
                </p>
                <div className="flex flex-col gap-3">
                    <Link to="/dashboard" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                        <ArrowLeft size={20} /> Volver al Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PagoFallido;
