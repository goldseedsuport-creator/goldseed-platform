-- ============================================
-- SISTEMA DE REFERIDOS - SCHEMA
-- ============================================

-- 1. Modificar Tabla 'users'
-- Añadir campos para sistema de referidos
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_total_earnings NUMERIC DEFAULT 0;

-- 2. Crear Tabla 'referral_logs'
-- Para historial de ganancias por referencia
CREATE TABLE IF NOT EXISTS referral_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID REFERENCES users(id) NOT NULL, -- El que gana
    source_user_id UUID REFERENCES users(id) NOT NULL, -- El invitado que generó la ganancia
    amount NUMERIC NOT NULL, -- Monto ganado (10% del profit)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Seguridad (RLS) para 'referral_logs'
ALTER TABLE referral_logs ENABLE ROW LEVEL SECURITY;

-- Usuarios ven sus propias ganancias
CREATE POLICY "Users can view own referral logs" 
ON referral_logs FOR SELECT 
USING (auth.uid() = referrer_id);

-- Admins ven todo (usando la función segura is_admin que creamos antes)
CREATE POLICY "Admins can view all referral logs" 
ON referral_logs FOR SELECT 
USING (is_admin());

-- 4. Función para generar código único
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Si ya viene con código (raro), lo respetamos, si no, generamos uno
    IF NEW.referral_code IS NULL THEN
        LOOP
            -- Generar string aleatorio de 8 caracteres (Ej: A1B2C3D4)
            NEW.referral_code := upper(substring(md5(random()::text) from 1 for 8));
            
            -- Verificar que no exista
            IF NOT EXISTS (SELECT 1 FROM users WHERE referral_code = NEW.referral_code) THEN
                EXIT;
            END IF;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger
DROP TRIGGER IF EXISTS tr_generate_referral_code ON users;

CREATE TRIGGER tr_generate_referral_code
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION generate_referral_code();

-- 6. Actualizar usuarios existentes
-- Generar códigos para los usuarios que ya existen y no tienen
DO $$
DECLARE
    r RECORD;
    new_code TEXT;
BEGIN
    FOR r IN SELECT id FROM users WHERE referral_code IS NULL LOOP
        LOOP
            new_code := upper(substring(md5(random()::text) from 1 for 8));
            IF NOT EXISTS (SELECT 1 FROM users WHERE referral_code = new_code) THEN
                UPDATE users SET referral_code = new_code WHERE id = r.id;
                EXIT;
            END IF;
        END LOOP;
    END LOOP;
END $$;
