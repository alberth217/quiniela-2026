-- Script para agregar columnas de resultados a la tabla partidos

ALTER TABLE partidos 
ADD COLUMN goles_a INTEGER DEFAULT NULL,
ADD COLUMN goles_b INTEGER DEFAULT NULL;

-- Opcional: Si quieres asegurarte de que el estado 'finalizado' sea válido si usas un ENUM, 
-- pero como parece ser texto simple, no es necesario.
-- Si quisieras actualizar partidos existentes a null (ya es default):
-- UPDATE partidos SET goles_a = NULL, goles_b = NULL;
