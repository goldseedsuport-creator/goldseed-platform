-- ============================================
-- FORZAR ROL ADMIN
-- ============================================
-- Este script obliga a que TODOS los usuarios sean admin
-- Ejecútalo en el SQL Editor para asegurarnos 100%

UPDATE users 
SET role = 'admin';

-- Verificación: Mostrar todos los usuarios y sus roles
SELECT email, role, id FROM users;
