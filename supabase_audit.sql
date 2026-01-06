-- ============================================
-- SCRIPT DE AUDITORÍA - Ejecuta esto en SQL Editor
-- ============================================
-- Copia TODO este código, pégalo en SQL Editor y dale RUN
-- Te dirá exactamente qué tienes y qué falta

-- 1. Verificar Tablas Existentes
SELECT 
    table_name,
    'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'investments', 'withdrawals', 'tickets')
ORDER BY table_name;

-- 2. Verificar Columnas de 'investments' (especialmente transaction_hash)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'investments'
ORDER BY ordinal_position;

-- 3. Verificar Políticas RLS en 'investments'
SELECT 
    policyname,
    cmd as operation,
    qual as condition
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'investments';

-- 4. Verificar Políticas RLS en 'withdrawals'
SELECT 
    policyname,
    cmd as operation
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'withdrawals';

-- 5. Verificar Trigger de Auto-Creación de Usuarios
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name = 'on_auth_user_created';

-- 6. Verificar Función del Trigger
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';
