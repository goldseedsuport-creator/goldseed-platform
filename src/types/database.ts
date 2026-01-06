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
