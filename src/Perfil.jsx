import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, BarChart2, CheckCircle, XCircle, Clock, AlertCircle, Edit2, Save, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import config from './config';

const { API_URL } = config;

const Perfil = () => {
    const { currentUser } = useOutletContext();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            fetch(`${API_URL}/mis-puntos/${currentUser.id}`)
                .then(res => res.json())
                .then(data => {
                    setHistory(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [currentUser]);

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        nickname: ''
    });
    const [updateStatus, setUpdateStatus] = useState(null); // 'success', 'error', null

    useEffect(() => {
        if (currentUser) {
            setFormData({
                nombre: currentUser.nombre || '',
                nickname: currentUser.nickname || ''
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        setUpdateStatus(null);
        try {
            const res = await fetch(`${API_URL}/perfil/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const updatedUser = await res.json();
                // We should update the context here ideally, but for now a reload or local feedback is ok.
                // Assuming useOutletContext provides a refresher or we just show success.
                // Ideally prompt App to refresh user. To keep it simple, we just show success.
                // In a perfect world: updateContextUser(updatedUser);
                setUpdateStatus('success');
                setIsEditing(false);
                // Force reload to update context (Brute force but effective for this scope)
                window.location.reload();
            } else {
                setUpdateStatus('error');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setUpdateStatus('error');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pleno': return <CheckCircle className="text-green-500" size={20} />;
            case 'Acertado': return <CheckCircle className="text-blue-500" size={20} />;
            case 'Fallado': return <XCircle className="text-red-500" size={20} />;
            default: return <Clock className="text-slate-400" size={20} />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Pleno': return <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full border border-green-100">¡Pleno! (+3)</span>;
            case 'Acertado': return <span className="text-blue-600 font-bold text-xs bg-blue-50 px-2 py-1 rounded-full border border-blue-100">Acierto (+1)</span>;
            case 'Fallado': return <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-full border border-red-100">Fallado (0)</span>;
            default: return <span className="text-slate-500 font-medium text-xs bg-slate-100 px-2 py-1 rounded-full">Pendiente</span>;
        }
    };

    const totalPuntos = history.reduce((acc, curr) => acc + curr.puntos, 0);
    const totalAciertos = history.filter(h => h.estado_resultado === 'Acertado' || h.estado_resultado === 'Pleno').length;

    if (!currentUser) return null;

    return (
        <div className="max-w-4xl mx-auto py-8 md:py-12 px-4">

            {/* CARD DE USUARIO */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16">
                        <div className="flex items-end gap-6">
                            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg relative">
                                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-4xl font-bold text-slate-400">
                                    {currentUser.nombre ? currentUser.nombre.charAt(0).toUpperCase() : <User size={48} />}
                                </div>
                            </div>
                        </div>
                        <div className="mb-2 w-full md:w-auto">
                            {!isEditing ? (
                                <>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-3xl font-bold text-slate-900">{currentUser.nickname || currentUser.nombre}</h1>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                            title="Editar Perfil"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </div>
                                    {currentUser.nickname && (
                                        <p className="text-sm text-slate-500 font-medium mb-1 pl-1">
                                            {currentUser.nombre}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Mail size={16} />
                                        <span>{currentUser.email}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in w-full max-w-md">
                                    <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Editar Perfil</h3>
                                    <div className="grid gap-3 mb-3">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 block mb-1">Nickname (Apodo)</label>
                                            <input
                                                type="text"
                                                name="nickname"
                                                value={formData.nickname}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="Ej: El Mago"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 block mb-1">Nombre Real</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-3 py-1.5 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded-lg flex items-center gap-1"
                                        >
                                            <X size={16} /> Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 rounded-lg flex items-center gap-1 shadow-sm"
                                        >
                                            <Save size={16} /> Guardar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>


                        <div className="bg-slate-50 rounded-xl px-6 py-3 border border-slate-100 flex flex-col md:items-end w-full md:w-auto mt-4 md:mt-0">
                            <h3 className="text-xs font-bold uppercase text-slate-400 mb-1 flex items-center gap-1">
                                <Shield size={12} /> Estado de Cuenta
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold w-fit ${currentUser.pago_realizado ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {currentUser.pago_realizado ? 'Premium Activo' : 'Pendiente de Pago'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RESUMEN DE PUNTOS */}
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart2 className="text-blue-600" /> Mi Desempeño
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-600 rounded-xl p-6 text-white text-center shadow-lg shadow-blue-500/20">
                    <span className="text-blue-200 text-xs font-bold uppercase block mb-1">Puntos Totales</span>
                    <span className="text-4xl font-black">{totalPuntos}</span>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 text-center shadow-sm">
                    <span className="text-slate-400 text-xs font-bold uppercase block mb-1">Aciertos</span>
                    <span className="text-4xl font-black text-green-600">{totalAciertos}</span>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 text-center shadow-sm col-span-2 md:col-span-1">
                    <span className="text-slate-400 text-xs font-bold uppercase block mb-1">Predicciones</span>
                    <span className="text-4xl font-black text-slate-800">{history.length}</span>
                </div>
            </div>

            {/* HISTORIAL */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Historial Detallado</h3>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-400">Cargando historial...</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {history.length > 0 ? (
                            history.map((item) => (
                                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.partido?.estado === 'finalizado' ? 'bg-slate-200 text-slate-600' : 'bg-green-100 text-green-700'}`}>
                                                {item.partido?.estado === 'finalizado' ? 'Finalizado' : 'Por Jugar'}
                                            </span>
                                            {item.partido?.estado === 'finalizado' && (
                                                <span className="text-xs font-mono bg-slate-800 text-white px-1.5 rounded">
                                                    {item.partido.goles_a} - {item.partido.goles_b}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-800">{item.partido?.equipo_a}</span>
                                            <span className="text-xs text-slate-400">vs</span>
                                            <span className="font-bold text-slate-800">{item.partido?.equipo_b}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 md:text-center">
                                        <div className="text-xs text-slate-400 mb-1">Tu Predicción</div>
                                        <div className="font-medium text-slate-700 bg-slate-100 inline-block px-3 py-1 rounded-lg">
                                            {item.tipo_prediccion === '1X2' ? item.seleccion : `Marcador: ${item.seleccion}`}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:justify-end min-w-[120px]">
                                        {getStatusIcon(item.estado_resultado)}
                                        {getStatusText(item.estado_resultado)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                                <AlertCircle size={32} className="text-slate-300" />
                                <p>Aún no has hecho predicciones.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
};

export default Perfil;
