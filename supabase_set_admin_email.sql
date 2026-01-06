-- ============================================
-- ACTUALIZACIÓN ESPECÍFICA DE ADMIN
-- ============================================
-- Actualiza SOLO al usuario con este email específico

UPDATE users 
SET role = 'admin'
WHERE email = 'admin@goldseed.com';

-- Verificación: Muestra solo los datos de este usuario
SELECT email, role, id FROM users WHERE email = 'admin@goldseed.com';
