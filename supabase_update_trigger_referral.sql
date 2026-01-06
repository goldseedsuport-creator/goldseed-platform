-- ============================================
-- TRIGGER DE REGISTRO CON REFERIDO
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    referrer_uuid UUID;
BEGIN
    -- 1. Intentar buscar el código de referido en la metadata del usuario
    -- (Esto viene de supabase.auth.signUp)
    IF new.raw_user_meta_data->>'referred_by_code' IS NOT NULL THEN
        SELECT id INTO referrer_uuid
        FROM public.users
        WHERE referral_code = new.raw_user_meta_data->>'referred_by_code';
    END IF;

    -- 2. Crear usuario en tabla pública (con o sin referidor)
    INSERT INTO public.users (id, email, role, created_at, referred_by)
    VALUES (
        new.id,
        new.email,
        'user', -- Rol por defecto
        now(),
        referrer_uuid -- UUID del que invitó (o NULL)
    );

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
