-- ==========================================================
-- SCRIPT DE REPARACIÓN INTEGRAL: REGISTRO Y REFERIDOS
-- ==========================================================

-- 1. SOLUCIÓN A LA RECURSIÓN (ERROR 500)
-- Función segura para verificar si es admin sin activar políticas recursivas
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

-- 2. GENERACIÓN DE CÓDIGO DE REFERIDO (Evita colisiones)
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Si ya viene con código, lo dejamos. Si es NULL, generamos uno.
    IF NEW.referral_code IS NULL THEN
        LOOP
            -- Generar 8 caracteres aleatorios en mayúsculas
            NEW.referral_code := upper(substring(md5(random()::text) from 1 for 8));
            
            -- Verificar que NO exista en la tabla users
            IF NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = NEW.referral_code) THEN
                EXIT; -- Salir del loop si es único
            END IF;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql; -- No necesita SECURITY DEFINER si se llama desde el trigger de creación

-- Recrear el Trigger de código único referidos
DROP TRIGGER IF EXISTS tr_generate_referral_code ON public.users;
CREATE TRIGGER tr_generate_referral_code
    BEFORE INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION generate_referral_code();

-- 3. TRIGGER PRINCIPAL DE NUEVO USUARIO (Maneja la inserción)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    referrer_uuid UUID;
BEGIN
    -- Buscar al referidor por código (si existe en la metadata)
    IF new.raw_user_meta_data->>'referred_by_code' IS NOT NULL THEN
        SELECT id INTO referrer_uuid
        FROM public.users
        WHERE referral_code = new.raw_user_meta_data->>'referred_by_code';
    END IF;

    -- Insertar en la tabla pública users
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
-- IMPORTANTE: SECURITY DEFINER permite que esto corra con permisos elevados

-- Asegurar que el trigger de Auth esté conectado
-- (Esto suele estar bien, pero por si acaso falla la definición)
-- Nota: En Supabase Dashboard no siempre se puede re-crear triggers de auth por SQL directo si no eres superuser,
-- pero la función handle_new_user sí se actualiza.

-- 4. POLÍTICAS DE SEGURIDAD (RLS) CORREGIDAS
-- Aseguramos que existan y usen is_admin() para evitar bucles
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT
USING ( is_admin() );

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT
USING ( auth.uid() = id );

-- Permitir lectura pública básica si es necesario para referidos (opcional, pero ayuda a debugging)
-- Por ahora lo mantenemos estricto.

