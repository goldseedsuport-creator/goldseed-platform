export interface User {
    id: string;
    email: string;
    wallet_address?: string;
    total_invested: number;
    total_earned: number;
    last_investment_amount: number;
    role: 'user' | 'admin';
    referral_code?: string;
    referred_by?: string;
    referral_total_earnings?: number;
}

export interface Investment {
    id: string;
    user_id: string;
    amount: number;
    expected_profit: number;
    actual_profit?: number;
    status: 'pending' | 'active' | 'completed' | 'withdrawn' | 'rejected';
    transaction_hash?: string;
    start_time: string;
    end_time: string;
    created_at: string;
}

export interface Withdrawal {
    id: string;
    user_id: string;
    amount: number;
    wallet_address: string;
    network: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_note?: string;
    created_at: string;
}

export interface ReferralTracking {
    id: string;
    referrer_id: string;
    referred_user_id: string;
    registered_at: string;
    first_investment_at?: string;
    first_investment_amount: number;
    total_investments: number;
    total_investment_count: number;
    status: 'registered' | 'invested' | 'active';
    created_at: string;
    updated_at: string;
}

export interface ReferralStats {
    referrer_id: string;
    total_referrals: number;
    registered_only: number;
    invested_count: number;
    total_referred_investments: number;
    conversion_rate: number;
}
