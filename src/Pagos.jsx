```javascript
import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle, Shield } from 'lucide-react';
import BotonPagar from './BotonPagar';
import React from 'react';
import { Ticket, CheckCircle, Shield } from 'lucide-react';
import BotonPagar from './BotonPagar';
import AdminStats from './AdminStats';
import { useOutletContext } from 'react-router-dom';

const Pagos = () => {
    // We can use useOutletContext correctly if Pagos is outlet, but previously it used localStorage directly.
    // Let's stick to the pattern used elsewhere or just use local storage if we want to be safe, 
    // BUT we need the updated user object. Let's use useOutletContext since 'Ranking' uses it.
    const context = useOutletContext();
    // Fallback if context is null (e.g. if rendered outside outlet, though unlikely in this app structure)
    // ALSO fallback to localStorage to be absolutely sure we catch the admin status
    const getStoredUser = () => {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    };

    const currentUser = context?.currentUser || getStoredUser(); 

    // Check payment status and admin status
    const isPremium = currentUser?.pago_realizado;
    const isAdmin = currentUser?.es_admin;

    if (isAdmin) {
        return (
            <div className="p-4 md:p-12 min-h-[60vh] flex flex-col items-center">
                <AdminStats />
            </div>
        );
    }

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
                <div className="w-full max-w-md mx-auto relative group">
                    <div className="absolute inset-0 bg-blue-500 rounded-2xl transform rotate-3 scale-95 opacity-20 transition-transform group-hover:rotate-6"></div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-0 overflow-hidden shadow-xl relative z-10 animate-fade-in-up">
                        {/* Receipt Header */}
                        <div className="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -mr-10 -mt-10"></div>
                            <CheckCircle size={48} className="mx-auto text-green-400 mb-3" />
                            <h3 className="text-xl font-bold uppercase tracking-widest">Inscripción Completada</h3>
                            <p className="text-blue-200 text-sm">Quiniela Mundial 2026</p>
                        </div>
                        
                        {/* Receipt Body */}
                        <div className="p-8 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-slate-500 text-sm">Estado</span>
                                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full text-xs uppercase">Pagado</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-slate-500 text-sm">Usuario</span>
                                <span className="font-bold text-slate-800">{currentUser?.nombre}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-slate-500 text-sm">Monto</span>
                                <span className="font-bold text-slate-800">$10.00 USD</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Fecha</span>
                                <span className="font-medium text-slate-800 text-sm">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Receipt Footer */}
                        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                             <p className="text-xs text-slate-400">Gracias por participar. ¡Mucha suerte!</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-sm mx-auto">
                    <BotonPagar />
                    <p className="text-xs text-slate-400 mt-6 md:mt-8 flex items-center justify-center gap-1">
                        <Shield size={12} /> Pagos procesados de forma 100% segura.
                    </p>
                </div>
            )}
        </div>
    </div>
    );
};

export default Pagos;
```
