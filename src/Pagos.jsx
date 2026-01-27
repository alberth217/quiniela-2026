import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle } from 'lucide-react';
import BotonPagar from './BotonPagar';

const Pagos = () => {
    const [currentUser, setCurrentUser] = useState(() => {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    });

    // Check payment status from local storage
    const isPremium = currentUser?.pago_realizado;

    return (
        <div className="p-4 md:p-12 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 text-center max-w-2xl w-full p-8 md:p-12">
                <div className="bg-blue-50 p-4 rounded-full mb-6 inline-flex">
                    <Ticket size={48} className="text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Inscripción al Mundial</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
                    Asegura tu participación en la quiniela. Realiza el pago único para competir por los premios y desbloquear todas las funciones.
                </p>

                {/* Estado de Pagos Condicional */}
                {isPremium ? (
                    <div className="w-full max-w-sm mx-auto bg-green-50 border border-green-200 rounded-xl p-8 flex flex-col items-center animate-fade-in-up">
                        <div className="bg-green-100 p-3 rounded-full mb-4">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-green-700 mb-2">¡Suscripción Activa!</h3>
                        <p className="text-green-600">Ya estás participando en la quiniela.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-sm mx-auto">
                        <BotonPagar />
                        <p className="text-xs text-slate-400 mt-6">
                            Pagos procesados de forma segura por Stripe.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pagos;
