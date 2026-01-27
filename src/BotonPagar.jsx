import React, { useState } from 'react';
import config from './config';

const BotonPagar = () => {
    const [loading, setLoading] = useState(false);

    const handlePago = async () => {
        setLoading(true);
        try {
            const userStr = localStorage.getItem('currentUser');
            if (!userStr) {
                alert('Debes iniciar sesión para pagar.');
                setLoading(false);
                return;
            }
            const user = JSON.parse(userStr);
            const usuario_id = user.id;

            const response = await fetch(`${config.API_URL}/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario_id }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Error payment session:', data);
                alert('Error al iniciar el pago. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor de pagos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePago}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${loading
                ? 'bg-gray-400 cursor-wait'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/30 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5'
                }`}
        >
            {loading ? 'Procesando...' : 'Pagar Inscripción ($25.00 USD)'}
        </button>
    );
};

export default BotonPagar;
