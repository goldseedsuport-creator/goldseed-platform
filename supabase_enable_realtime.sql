-- ============================================
-- ACTIVAR REALTIME
-- ============================================
-- Esto es necesario para que la app se actualice sola
-- cuando cambian los datos en la base de datos.

-- 1. Añadir tablas a la publicación de realtime
-- Si da error de "relation already exists", es que ya estaba activado (no pasa nada).

ALTER PUBLICATION supabase_realtime ADD TABLE investments;
ALTER PUBLICATION supabase_realtime ADD TABLE withdrawals;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
