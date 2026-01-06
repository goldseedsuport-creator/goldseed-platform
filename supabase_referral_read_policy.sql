-- ============================================
-- POLÍTICA PARA VER REFERIDOS
-- ============================================

-- Permitir que un usuario vea los datos de las personas que ÉL invitó
-- (necesario para el contador "Amigos Invitados")

CREATE POLICY "Users can view referrals" 
ON users FOR SELECT 
USING (auth.uid() = referred_by);

-- Nota: Supabase combina políticas con OR. 
-- Política actual: "Ver mi propio perfil" OR "Ver perfiles que referí"
