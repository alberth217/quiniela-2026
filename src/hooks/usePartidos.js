import { useState, useEffect, useMemo } from 'react';
import config from '../config';

const { API_URL } = config;

const usePartidos = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtros
    const [filterStage, setFilterStage] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPartidos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/partidos`);
            if (!response.ok) throw new Error('Error al cargar partidos');
            const data = await response.json();
            setMatches(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartidos();
    }, []);

    // Lógica de Filtrado
    const filteredMatches = useMemo(() => {
        if (!matches.length) return [];

        return matches.filter(match => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                (match.equipo_a || '').toLowerCase().includes(searchLower) ||
                (match.equipo_b || '').toLowerCase().includes(searchLower);

            // "Todas" shows everything. 
            // "Fase de Grupos" matches "Grupo A", "Grupo B", etc.
            // Other stages match exactly (e.g. "Final", "Octavos de Final")
            let matchesStage = false;
            if (filterStage === 'Todas') {
                matchesStage = true;
            } else if (filterStage === 'Fase de Grupos') {
                matchesStage = (match.fase && match.fase.includes('Grupo')) || match.fase === 'Fase de Grupos';
            } else {
                matchesStage = match.fase === filterStage || (match.fase && match.fase.includes(filterStage));
            }

            return matchesSearch && matchesStage;
        });
    }, [matches, filterStage, searchTerm]);

    return {
        matches,
        filteredMatches,
        loading,
        error,
        filterStage,
        setFilterStage,
        searchTerm,
        setSearchTerm,
        recargarPartidos: fetchPartidos
    };
};

export default usePartidos;
