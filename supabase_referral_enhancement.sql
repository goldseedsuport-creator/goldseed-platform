-- ============================================
-- FASE 1: MEJORA DEL SISTEMA DE REFERIDOS
-- Tracking Detallado sin Modificar Estructura Existente
-- ============================================

-- 1. Nueva tabla para tracking detallado de referidos
CREATE TABLE IF NOT EXISTS referral_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    referred_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    first_investment_at TIMESTAMP WITH TIME ZONE,
    first_investment_amount NUMERIC DEFAULT 0,
    total_investments NUMERIC DEFAULT 0,
    total_investment_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'invested', 'active')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_referral_tracking_referrer ON referral_tracking(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_referred ON referral_tracking(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_status ON referral_tracking(status);

-- 3. Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_referral_tracking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger para actualizar timestamp
DROP TRIGGER IF EXISTS tr_update_referral_tracking_timestamp ON referral_tracking;
CREATE TRIGGER tr_update_referral_tracking_timestamp
    BEFORE UPDATE ON referral_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_referral_tracking_timestamp();

-- 5. Poblar tabla con datos existentes de la tabla users
INSERT INTO referral_tracking (referrer_id, referred_user_id, registered_at, status)
SELECT 
    u1.id as referrer_id,
    u2.id as referred_user_id,
    u2.created_at as registered_at,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM investments 
            WHERE user_id = u2.id 
            AND status IN ('active', 'completed')
        ) THEN 'invested'
        ELSE 'registered'
    END as status
FROM users u2
INNER JOIN users u1 ON u2.referred_by = u1.id
WHERE u2.referred_by IS NOT NULL
ON CONFLICT DO NOTHING;

-- 6. Actualizar first_investment_at y amounts para usuarios que ya invirtieron
UPDATE referral_tracking rt
SET 
    first_investment_at = inv.first_inv_time,
    first_investment_amount = inv.first_inv_amount,
    total_investments = inv.total_amount,
    total_investment_count = inv.inv_count,
    status = 'invested'
FROM (
    SELECT 
        user_id,
        MIN(created_at) as first_inv_time,
        (SELECT amount FROM investments WHERE user_id = i.user_id ORDER BY created_at ASC LIMIT 1) as first_inv_amount,
        SUM(amount) as total_amount,
        COUNT(*) as inv_count
    FROM investments i
    WHERE status IN ('active', 'completed')
    GROUP BY user_id
) inv
WHERE rt.referred_user_id = inv.user_id;

-- 7. Función para sincronizar automáticamente cuando un referido invierte
CREATE OR REPLACE FUNCTION sync_referral_tracking_on_investment()
RETURNS TRIGGER AS $$
DECLARE
    v_referrer_id UUID;
BEGIN
    -- Solo procesar si la inversión es aprobada (active o completed)
    IF NEW.status IN ('active', 'completed') THEN
        -- Obtener el referrer_id del usuario que invirtió
        SELECT referred_by INTO v_referrer_id
        FROM users
        WHERE id = NEW.user_id;

        -- Si tiene referrer, actualizar tracking
        IF v_referrer_id IS NOT NULL THEN
            -- Verificar si es su primera inversión
            IF NOT EXISTS (
                SELECT 1 FROM investments 
                WHERE user_id = NEW.user_id 
                AND status IN ('active', 'completed')
                AND id != NEW.id
            ) THEN
                -- Primera inversión
                UPDATE referral_tracking
                SET 
                    first_investment_at = NEW.created_at,
                    first_investment_amount = NEW.amount,
                    total_investments = NEW.amount,
                    total_investment_count = 1,
                    status = 'invested'
                WHERE referred_user_id = NEW.user_id;
            ELSE
                -- Inversión adicional
                UPDATE referral_tracking
                SET 
                    total_investments = total_investments + NEW.amount,
                    total_investment_count = total_investment_count + 1,
                    status = 'active'
                WHERE referred_user_id = NEW.user_id;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger para sincronizar inversiones
DROP TRIGGER IF EXISTS tr_sync_referral_tracking ON investments;
CREATE TRIGGER tr_sync_referral_tracking
    AFTER INSERT OR UPDATE ON investments
    FOR EACH ROW
    EXECUTE FUNCTION sync_referral_tracking_on_investment();

-- 9. Función para sincronizar cuando se crea un nuevo usuario referido
CREATE OR REPLACE FUNCTION sync_referral_tracking_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el nuevo usuario tiene un referrer, crear entrada en tracking
    IF NEW.referred_by IS NOT NULL THEN
        INSERT INTO referral_tracking (
            referrer_id,
            referred_user_id,
            registered_at,
            status
        ) VALUES (
            NEW.referred_by,
            NEW.id,
            NEW.created_at,
            'registered'
        )
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Trigger para sincronizar nuevos registros
DROP TRIGGER IF EXISTS tr_sync_referral_tracking_signup ON users;
CREATE TRIGGER tr_sync_referral_tracking_signup
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION sync_referral_tracking_on_signup();

-- 11. RLS Policies
ALTER TABLE referral_tracking ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver sus propios referidos
DROP POLICY IF EXISTS "Users can view their own referrals" ON referral_tracking;
CREATE POLICY "Users can view their own referrals"
ON referral_tracking FOR SELECT
USING (auth.uid() = referrer_id);

-- Admins pueden ver todo
DROP POLICY IF EXISTS "Admins can view all referrals" ON referral_tracking;
CREATE POLICY "Admins can view all referrals"
ON referral_tracking FOR SELECT
USING (is_admin());

-- 12. Vista para estadísticas de referidos (opcional, para queries más fáciles)
CREATE OR REPLACE VIEW referral_stats AS
SELECT 
    referrer_id,
    COUNT(*) as total_referrals,
    COUNT(*) FILTER (WHERE status = 'registered') as registered_only,
    COUNT(*) FILTER (WHERE status IN ('invested', 'active')) as invested_count,
    COALESCE(SUM(total_investments), 0) as total_referred_investments,
    ROUND(
        (COUNT(*) FILTER (WHERE status IN ('invested', 'active'))::NUMERIC / 
         NULLIF(COUNT(*), 0) * 100), 
        2
    ) as conversion_rate
FROM referral_tracking
GROUP BY referrer_id;

-- Permitir que usuarios vean sus propias stats
ALTER VIEW referral_stats SET (security_invoker = true);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Query para verificar que todo funciona:
-- SELECT * FROM referral_tracking WHERE referrer_id = auth.uid();
-- SELECT * FROM referral_stats WHERE referrer_id = auth.uid();
