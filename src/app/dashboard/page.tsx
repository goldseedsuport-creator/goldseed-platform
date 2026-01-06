'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Investment, User } from '@/types/database';
import InvestmentCalculator from '@/components/dashboard/investment-calculator';
import ActiveInvestment from '@/components/dashboard/active-investment';
import GlassCard from '@/components/ui/glass-card';
import ReferralCardEnhanced from '@/components/dashboard/referral-card-enhanced';
import BalloonText from '@/components/ui/balloon-text';
import MetallicButton from '@/components/ui/metallic-button';
import FullscreenLoader from '@/components/ui/fullscreen-loader';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [activeInvestment, setActiveInvestment] = useState<Investment | null>(null);
    const [pendingInvestment, setPendingInvestment] = useState<Investment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();

        // Subscribe to changes
        const channel = supabase
            .channel('dashboard_updates')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'investments' },
                () => fetchData()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchData = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return;

            // Get Profile
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profile) setUser(profile);

            // Get Active Investment (status 'active')
            const { data: active } = await supabase
                .from('investments')
                .select('*')
                .eq('user_id', authUser.id)
                .eq('status', 'active')
                .maybeSingle(); // Use maybeSingle to avoid 406 error if not found

            setActiveInvestment(active);

            // Check if there's a COMPLETED/PENDING/REJECTED investment (only if no active)
            if (!active) {
                const { data: pending } = await supabase
                    .from('investments')
                    .select('*')
                    .eq('user_id', authUser.id)
                    .in('status', ['pending', 'completed', 'rejected'])
                    .order('created_at', { ascending: false })
                    .maybeSingle();

                setPendingInvestment(pending);
            } else {
                setPendingInvestment(null);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <FullscreenLoader message="Cargando tu futuro..." />;

    return (
        <div className="space-y-8 pb-20">

            {/* CASE 1: Active Investment Running */}
            {activeInvestment && (
                <div className="animate-fade-in">
                    <ActiveInvestment investment={activeInvestment} />
                </div>
            )}

            {/* CASE 2: Pending Payment (No Hash) -> Show "Continue Payment" */}
            {!activeInvestment && pendingInvestment && pendingInvestment.status === 'pending' && !pendingInvestment.transaction_hash && (
                <GlassCard className="text-center py-12 border-gold-500/50 animate-fade-in">
                    <h3 className="text-2xl font-bold text-white mb-4">Tienes una inversión pendiente</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Iniciaste una inversión de <span className="text-gold-400 font-bold">{pendingInvestment.amount} USDT</span>. <br />
                        Por favor completa el pago para activar tu crecimiento.
                    </p>
                    <MetallicButton onClick={() => router.push(`/dashboard/payment/${pendingInvestment.id}`)}>
                        Continuar con el Pago
                    </MetallicButton>
                </GlassCard>
            )}

            {/* CASE 2.1: Verification in Progress (Has Hash) -> Show "Waiting" */}
            {!activeInvestment && pendingInvestment && pendingInvestment.status === 'pending' && pendingInvestment.transaction_hash && (
                <GlassCard className="text-center py-12 border-blue-500/30 relative overflow-hidden animate-fade-in">
                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                    <div className="relative z-10">
                        <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Verificando tu Inversión</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Hemos recibido tu comprobante. El administrador está validando la transacción. <br />
                            <span className="text-sm text-gray-500 mt-2 block">Esto suele tomar unos minutos.</span>
                        </p>
                    </div>
                </GlassCard>
            )}

            {/* CASE 2.5: Rejected Payment */}
            {!activeInvestment && pendingInvestment && pendingInvestment.status === 'rejected' && (
                <GlassCard className="text-center py-12 border-red-500/50 relative overflow-hidden animate-fade-in">
                    <div className="absolute inset-0 bg-red-500/10" />
                    <div className="relative z-10">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Pago Rechazado</h3>
                        <p className="text-gray-300 mb-2">
                            Tu inversión de <span className="text-gold-400 font-bold">{pendingInvestment.amount} USDT</span> fue rechazada.
                        </p>
                        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                            Esto puede deberse a un ID de transacción incorrecto o un pago no verificado. Por favor:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <MetallicButton
                                onClick={async () => {
                                    await supabase.from('investments').delete().eq('id', pendingInvestment.id);
                                    window.location.reload();
                                }}
                            >
                                Intentar de Nuevo
                            </MetallicButton>
                            <button
                                onClick={() => router.push(`/dashboard/payment/${pendingInvestment.id}`)}
                                className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl transition-colors"
                            >
                                Verificar TX ID
                            </button>
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* CASE 3: Completed Investment (Harvest Time) */}
            {!activeInvestment && pendingInvestment && pendingInvestment.status === 'completed' && (
                <GlassCard className="text-center py-12 border-green-500/50 relative overflow-hidden animate-fade-in">
                    <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
                    <div className="relative z-10">
                        <BalloonText size="lg" color="gold">¡Cosecha Lista!</BalloonText>
                        <p className="text-gray-300 mt-4 mb-8 text-lg">
                            Tu inversión ha madurado exitosamente. <br />
                            <span className="text-white font-bold">{pendingInvestment.amount} USDT</span> → <span className="text-gold-400 font-bold">{(pendingInvestment.expected_profit || 0) + pendingInvestment.amount} USDT</span>
                        </p>
                        <MetallicButton onClick={() => router.push('/dashboard/withdraw')}>
                            Retirar Ganancias Ahora
                        </MetallicButton>
                    </div>
                </GlassCard>
            )}

            {/* CASE 4: Clean Slate -> Calculator */}
            {!activeInvestment && !pendingInvestment && user && (
                <div className="animate-fade-in">
                    <InvestmentCalculator
                        userId={user.id}
                        minAmount={user.last_investment_amount > 0 ? user.last_investment_amount : 1}
                    />
                </div>
            )}

            {/* Referral Card - Middle Priority */}
            {user && (
                <div className="animate-fade-in">
                    <ReferralCardEnhanced user={user} />
                </div>
            )}

            {/* Stats Row - Bottom (Informational) */}
            <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
                <GlassCard className="hover:border-gold-500/40 transition-all duration-300">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Invertido</div>
                    <div className="text-3xl font-bold text-gold-400">
                        ${user?.total_invested?.toFixed(2) || '0.00'}
                    </div>
                </GlassCard>
                <GlassCard className="hover:border-green-500/40 transition-all duration-300">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Ganancias Totales</div>
                    <div className="text-3xl font-bold text-green-400">
                        ${user?.total_earned?.toFixed(2) || '0.00'}
                    </div>
                </GlassCard>
                <GlassCard className="hover:border-blue-500/40 transition-all duration-300">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Estado Actual</div>
                    <div className="text-xl font-bold text-white flex items-center gap-2">
                        {activeInvestment
                            ? <span className="text-green-400 animate-pulse">● Creciendo</span>
                            : <span className="text-gray-500">○ Esperando siembra</span>
                        }
                    </div>
                </GlassCard>
            </div>

        </div>
    );
}
