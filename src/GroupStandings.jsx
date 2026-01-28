import React, { useState, useEffect } from 'react';
import { Loader, Shield } from 'lucide-react';
import config from './config';

const { API_URL } = config;

const GroupStandings = () => {
    const [standings, setStandings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const res = await fetch(`${API_URL}/posiciones`);
                if (res.ok) {
                    const data = await res.json();
                    setStandings(data);
                }
            } catch (error) {
                console.error("Error fetching standings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStandings();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader size={40} className="animate-spin text-blue-600" />
            </div>
        );
    }

    if (Object.keys(standings).length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <Shield size={48} className="mx-auto text-slate-200 mb-3" />
                <p className="text-slate-500 font-medium">No hay tablas de posiciones disponibles.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            {Object.keys(standings).sort().map((groupKey) => (
                <div key={groupKey} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-800 flex justify-between items-center">
                        <span>Grupo {groupKey}</span>
                        <Shield size={16} className="text-slate-300" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="text-slate-500 bg-slate-50/50 uppercase font-semibold">
                                <tr>
                                    <th className="px-3 py-2 text-center">#</th>
                                    <th className="px-3 py-2 w-full">Equipo</th>
                                    <th className="px-2 py-2 text-center" title="Partidos Jugados">PJ</th>
                                    <th className="px-2 py-2 text-center" title="Diferencia de Goles">DG</th>
                                    <th className="px-3 py-2 text-center font-bold" title="Puntos">Pts</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {standings[groupKey].map((team) => (
                                    <tr key={team.equipo} className="hover:bg-blue-50/30 transition-colors">
                                        <td className={`px-3 py-2 text-center font-bold ${team.posicion <= 2 ? 'text-green-600 border-l-4 border-green-500' : 'text-slate-500 border-l-4 border-transparent'}`}>
                                            {team.posicion}
                                        </td>
                                        <td className="px-3 py-2 font-medium text-slate-800 flex items-center gap-2">
                                            {team.logo ? (
                                                <img src={team.logo} alt={team.equipo} className="w-5 h-5 object-contain" />
                                            ) : (
                                                <Shield size={14} className="text-slate-300" />
                                            )}
                                            {team.equipo}
                                        </td>
                                        <td className="px-2 py-2 text-center text-slate-500">{team.pj}</td>
                                        <td className="px-2 py-2 text-center text-slate-500">{team.dg}</td>
                                        <td className="px-3 py-2 text-center font-bold text-slate-900 bg-slate-50/50">{team.puntos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GroupStandings;
