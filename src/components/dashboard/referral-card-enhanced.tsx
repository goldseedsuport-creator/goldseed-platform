'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/glass-card';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';

interface ReferralData {
    id: string;
    referred_user_id: string;
    registered_at: string;
    first_investment_at: string | null;
    first_investment_amount: number;
    total_investments: number;
    total_investment_count: number;
    status: 'registered' | 'invested' | 'active';
    user_email?: string;
}

interface ReferralStats {
    total_referrals: number;
    registered_only: number;
    invested_count: number;
    total_referred_investments: number;
    conversion_rate: number;
}

export default function ReferralCardEnhanced({ user }: { user: User }) {
    const [referrals, setReferrals] = useState<ReferralData[]>([]);
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const referralLink = typeof window !== 'undefined'
        ? `${window.location.origin}/?ref=${user.referral_code}`
        : '';

    useEffect(() => {
        fetchReferralData();
    }, [user.id]);

    const fetchReferralData = async () => {
        try {
            // Fetch detailed referral list
            const { data: referralData, error: refError } = await supabase
                .from('referral_tracking')
                .select(`
                    id,
                    referred_user_id,
                    registered_at,
                    first_investment_at,
                    first_investment_amount,
                    total_investments,
                    total_investment_count,
                    status
                `)
                .eq('referrer_id', user.id)
                .order('registered_at', { ascending: false });

            if (refError) throw refError;

            // Fetch stats
            const { data: statsData, error: statsError } = await supabase
                .from('referral_stats')
                .select('*')
                .eq('referrer_id', user.id)
                .single();

            if (statsError && statsError.code !== 'PGRST116') throw statsError;

            setReferrals(referralData || []);
            setStats(statsData || {
                total_referrals: 0,
                registered_only: 0,
                invested_count: 0,
                total_referred_investments: 0,
                conversion_rate: 0
            });
        } catch (error) {
            console.error('Error fetching referral data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
            case 'invested':
                return '🟢';
            case 'registered':
                return '🟡';
            default:
                return '⚪';
        }
    };

    const getStatusText = (referral: ReferralData) => {
        if (referral.status === 'registered') {
            return 'Registrado';
        }
        if (referral.total_investment_count > 1) {
            return `${referral.total_investment_count} inversiones - $${referral.total_investments.toFixed(2)}`;
        }
        return `$${referral.total_investments.toFixed(2)} invertidos`;
    };

    const getReferralLevel = (count: number) => {
        if (count >= 31) return { icon: '💎', name: 'Diamante', color: 'text-cyan-400', bonus: '+20%' };
        if (count >= 16) return { icon: '🥇', name: 'Oro', color: 'text-yellow-400', bonus: '+15%' };
        if (count >= 6) return { icon: '🥈', name: 'Plata', color: 'text-gray-300', bonus: '+12%' };
        return { icon: '🥉', name: 'Bronce', color: 'text-orange-400', bonus: '+10%' };
    };

    const getNextLevel = (count: number) => {
        if (count >= 31) return null;
        if (count >= 16) return { name: 'Diamante', needed: 31 - count };
        if (count >= 6) return { name: 'Oro', needed: 16 - count };
        return { name: 'Plata', needed: 6 - count };
    };

    const currentLevel = getReferralLevel(stats?.total_referrals || 0);
    const nextLevel = getNextLevel(stats?.total_referrals || 0);

    if (loading) {
        return (
            <GlassCard className="border-gold-500/20">
                <div className="text-center py-8 text-gray-400">
                    Cargando datos de referidos...
                </div>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="border-gold-500/20">
            {/* Header con Nivel */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentLevel.icon}</span>
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            Nivel {currentLevel.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                            Bono actual: <span className={currentLevel.color}>{currentLevel.bonus}</span>
                        </p>
                    </div>
                </div>
                {nextLevel && (
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Próximo nivel</p>
                        <p className="text-sm text-gold-400 font-bold">
                            {nextLevel.needed} referidos más
                        </p>
                    </div>
                )}
            </div>

            {/* Link de Referido */}
            <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Tu Link de Referidos</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 px-4 py-3 bg-dark-800/50 border border-gold-500/20 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-xl transition-all active:scale-95"
                    >
                        {copied ? '✓' : '📋'}
                    </button>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-dark-900/50 p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-2xl font-bold text-gold-400">{stats?.total_referrals || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">Total</div>
                </div>
                <div className="bg-dark-900/50 p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-2xl font-bold text-green-400">{stats?.invested_count || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">Invirtieron</div>
                </div>
                <div className="bg-dark-900/50 p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-2xl font-bold text-blue-400">{stats?.conversion_rate || 0}%</div>
                    <div className="text-xs text-gray-500 mt-1">Conversión</div>
                </div>
                <div className="bg-dark-900/50 p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-lg font-bold text-purple-400">${user.referral_total_earnings?.toFixed(0) || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">Ganado</div>
                </div>
            </div>

            {/* Lista de Referidos */}
            {referrals.length > 0 ? (
                <div>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        👥 Tus Referidos ({referrals.length})
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                        {referrals.map((ref, index) => (
                            <div
                                key={ref.id}
                                className="bg-dark-900/30 p-3 rounded-lg border border-white/5 hover:border-gold-500/30 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{getStatusIcon(ref.status)}</span>
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Referido #{index + 1}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(ref.registered_at).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${ref.status === 'registered' ? 'text-gray-400' : 'text-green-400'
                                            }`}>
                                            {getStatusText(ref)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 border-2 border-dashed border-gold-500/20 rounded-xl">
                    <p className="text-gray-400 text-sm mb-2">
                        Aún no tienes referidos
                    </p>
                    <p className="text-xs text-gray-600">
                        Comparte tu link y empieza a ganar bonos
                    </p>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 175, 55, 0.7);
                }
            `}</style>
        </GlassCard>
    );
}
