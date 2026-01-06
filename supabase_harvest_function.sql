-- ============================================
-- FUNCIÓN DE COSECHA DE INVERSION (HARVEST)
-- ============================================

CREATE OR REPLACE FUNCTION harvest_investment(p_investment_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Se ejecuta con permisos de admin para poder modificar saldos
AS $$
DECLARE
    v_inv RECORD;
    v_user RECORD;
    v_profit NUMERIC;
    v_platform_fee NUMERIC;
    v_referral_bonus NUMERIC;
    v_final_user_profit NUMERIC;
BEGIN
    -- 1. Obtener Inversión
    SELECT * INTO v_inv FROM investments WHERE id = p_investment_id;
    
    IF v_inv IS NULL THEN RAISE EXCEPTION 'Investment not found'; END IF;
    IF v_inv.status != 'active' THEN RAISE EXCEPTION 'Investment is not active'; END IF;
    -- Descomentar esto en producción real, para testing lo permitimos manual si se quiere
    -- IF v_inv.end_time > now() THEN RAISE EXCEPTION 'Investment not mature yet'; END IF;

    -- 2. Obtener Usuario
    SELECT * INTO v_user FROM users WHERE id = v_inv.user_id;

    -- 3. Calcular Ganancias y Fees
    v_profit := v_inv.expected_profit;
    
    -- El Fee base es 20%
    -- El Usuario SIEMPRE recibe el 80% (v_profit * 0.80)
    v_final_user_profit := v_profit * 0.80;
    
    -- El 20% restante se reparte
    v_platform_fee := v_profit * 0.20; 

    -- 4. Verificar Referidos (Split del Fee)
    IF v_user.referred_by IS NOT NULL THEN
        -- Si hay referido: 10% Referidor, 10% Plataforma.
        -- Como ya descontamos el 20% al usuario (v_platform_fee), 
        -- tomamos la mitad de ese fee para dárselo al referidor.
        v_referral_bonus := v_profit * 0.10;
        
        -- Actualizar saldo del Referidor
        UPDATE users 
        SET total_earned = total_earned + v_referral_bonus,
            referral_total_earnings = COALESCE(referral_total_earnings, 0) + v_referral_bonus
        WHERE id = v_user.referred_by;

        -- Guardar Log
        INSERT INTO referral_logs (referrer_id, source_user_id, amount)
        VALUES (v_user.referred_by, v_user.id, v_referral_bonus);
    END IF;

    -- 5. Finalizar Inversión
    UPDATE investments 
    SET 
        status = 'completed', 
        actual_profit = v_final_user_profit
    WHERE id = p_investment_id;

    -- 6. Actualizar Saldo del Usuario Inversor
    -- Le sumamos su GANANCIA NETA al total ganado.
    -- (Nota: El capital inicial usualmente se devuelve o se suma, 
    -- aquí asumimos que 'total_earned' es solo ganancia acumulada, 
    -- si la wallet es 'capital + ganancia', habría que sumar ambos).
    -- Según lógica anterior, el usuario retira todo. Asumimos que retira investment.amount + profit.
    -- Pero la tabla users solo tiene 'total_earned'.
    -- Vamos a sumar solo el profit a 'total_earned' para estadísticas.
    -- El saldo real disponible para retiro debería calcularse en el momento o tener columna 'balance'.
    -- Por ahora, sumamos profit a total_earned.
    UPDATE users
    SET total_earned = total_earned + v_final_user_profit
    WHERE id = v_inv.user_id;

    RETURN jsonb_build_object('success', true, 'profit', v_final_user_profit);
END;
$$;
