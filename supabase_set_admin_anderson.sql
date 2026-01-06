-- ============================================
-- CONFIGURACIÓN DE ADMIN: anderson.1997.115@gmail.com
-- ============================================

-- 1. Actualizar el rol de ESTE usuario específico a 'admin'
UPDATE users 
SET role = 'admin'
WHERE email = 'anderson.1997.115@gmail.com';

-- 2. Verificación
SELECT email, role, id FROM users WHERE email = 'anderson.1997.115@gmail.com';
