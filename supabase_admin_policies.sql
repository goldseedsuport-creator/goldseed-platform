-- ============================================
-- ADMIN ACCESS POLICIES
-- ============================================
-- Permitir a los admins ver y gestionar TODO

-- 1. Políticas para 'investments'
CREATE POLICY "Admins can view all investments"
ON investments FOR SELECT
USING (
  exists (
    select 1 from users 
    where users.id = auth.uid() 
    and users.role = 'admin'
  )
);

CREATE POLICY "Admins can update all investments"
ON investments FOR UPDATE
USING (
  exists (
    select 1 from users 
    where users.id = auth.uid() 
    and users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete all investments"
ON investments FOR DELETE
USING (
  exists (
    select 1 from users 
    where users.id = auth.uid() 
    and users.role = 'admin'
  )
);

-- 2. Políticas para 'withdrawals'
CREATE POLICY "Admins can view all withdrawals"
ON withdrawals FOR SELECT
USING (
  exists (
    select 1 from users 
    where users.id = auth.uid() 
    and users.role = 'admin'
  )
);

CREATE POLICY "Admins can update all withdrawals"
ON withdrawals FOR UPDATE
USING (
  exists (
    select 1 from users 
    where users.id = auth.uid() 
    and users.role = 'admin'
  )
);

-- 3. Políticas para 'users'
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  exists (
    select 1 from users 
    where users.id = auth.uid() 
    and users.role = 'admin'
  )
);

-- 4. Políticas para 'tickets'
CREATE POLICY "Admins can view all tickets"
ON tickets FOR SELECT
USING (
  exists (
    select 1 from users 
    where users.id = auth.uid() 
    and users.role = 'admin'
  )
);

CREATE POLICY "Admins can update all tickets"
ON tickets FOR UPDATE
USING (
  exists (
    select 1 from users 
    where users.id = auth.uid() 
    and users.role = 'admin'
  )
);
