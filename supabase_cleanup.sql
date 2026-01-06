-- ============================================
-- LIMPIEZA TOTAL - Empezar de Cero
-- ============================================
-- Este script borra TODOS los datos de prueba
-- pero mantiene la estructura de la base de datos

-- 1. Borrar todas las inversiones
DELETE FROM investments;

-- 2. Borrar todos los retiros
DELETE FROM withdrawals;

-- 3. Borrar todos los tickets
DELETE FROM tickets;

-- 4. Borrar todos los usuarios de la tabla public.users
-- (NO borra de auth.users, eso se hace manualmente)
DELETE FROM users;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Después de ejecutar, verifica que todo esté vacío:
SELECT 'investments' as table_name, COUNT(*) as records FROM investments
UNION ALL
SELECT 'withdrawals', COUNT(*) FROM withdrawals
UNION ALL
SELECT 'tickets', COUNT(*) FROM tickets
UNION ALL
SELECT 'users', COUNT(*) FROM users;
-- Todas deben mostrar 0
