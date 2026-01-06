-- ============================================
-- ARREGLO DE ERROR 500 (RECURSIÓN INFINITA)
-- ============================================

-- 1. Crear función segura para verificar admin
-- SECURITY DEFINER rompe el bucle infinito al saltarse RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 2. Eliminar las políticas recursivas anteriores
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can view all investments" ON investments;
DROP POLICY IF EXISTS "Admins can update all investments" ON investments;
DROP POLICY IF EXISTS "Admins can delete all investments" ON investments;
DROP POLICY IF EXISTS "Admins can view all withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Admins can update all withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Admins can view all tickets" ON tickets;
DROP POLICY IF EXISTS "Admins can update all tickets" ON tickets;


-- 3. Recrear políticas usando la función segura

-- USERS
CREATE POLICY "Admins can view all users" ON users FOR SELECT
USING ( is_admin() );

-- INVESTMENTS
CREATE POLICY "Admins can view all investments" ON investments FOR SELECT
USING ( is_admin() );

CREATE POLICY "Admins can update all investments" ON investments FOR UPDATE
USING ( is_admin() );

CREATE POLICY "Admins can delete all investments" ON investments FOR DELETE
USING ( is_admin() );

-- WITHDRAWALS
CREATE POLICY "Admins can view all withdrawals" ON withdrawals FOR SELECT
USING ( is_admin() );

CREATE POLICY "Admins can update all withdrawals" ON withdrawals FOR UPDATE
USING ( is_admin() );

-- TICKETS
CREATE POLICY "Admins can view all tickets" ON tickets FOR SELECT
USING ( is_admin() );

CREATE POLICY "Admins can update all tickets" ON tickets FOR UPDATE
USING ( is_admin() );
