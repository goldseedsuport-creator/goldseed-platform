-- ============================================
-- SCRIPT FINAL - Solo lo que FALTA
-- ============================================
-- Ejecuta esto UNA SOLA VEZ en SQL Editor

-- 1. Agregar columna transaction_hash a investments
ALTER TABLE investments 
ADD COLUMN IF NOT EXISTS transaction_hash text;

-- 2. Agregar política INSERT para withdrawals
CREATE POLICY IF NOT EXISTS "Users can create withdrawals"
ON withdrawals FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Agregar política SELECT para withdrawals (por si acaso)
CREATE POLICY IF NOT EXISTS "Users can view own withdrawals"
ON withdrawals FOR SELECT
USING (auth.uid() = user_id);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Después de ejecutar, verifica:
SELECT column_name 
FROM information_schema.columns
WHERE table_name = 'investments' 
AND column_name = 'transaction_hash';
-- Debe devolver 1 fila

SELECT policyname 
FROM pg_policies
WHERE tablename = 'withdrawals';
-- Debe mostrar al menos 2 políticas
