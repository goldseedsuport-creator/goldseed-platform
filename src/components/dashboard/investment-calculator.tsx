'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/glass-card';
import MetallicButton from '@/components/ui/metallic-button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import UrgencyTimer from '@/components/neuromarketing/urgency-timer';

export default function InvestmentCalculator({ userId, minAmount = 1 }: { userId: string, minAmount?: number }) {
    const router = useRouter();
    const [amount, setAmount] = useState(100);
    const [loading, setLoading] = useState(false);

    // Constants
    const ROI_PERCENT = 1.50; // 50% profit (1.5x multiplier)
    const FEE_PERCENT = 0.20; // 20% of PROFIT (not total)

    // Calculations
    const grossTotal = amount * ROI_PERCENT;     // e.g. 100 * 1.5 = 150
    const profitOnly = grossTotal - amount;      // 150 - 100 = 50
    const fee = profitOnly * FEE_PERCENT;        // 50 * 0.20 = 10
    const netTotal = grossTotal - fee;           // 150 - 10 = 140
    const netProfit = netTotal - amount;         // 140 - 100 = 40

    const handleInvest = async () => {
        setLoading(true);
        try {
            // Create pending investment
            const { data, error } = await supabase
                .from('investments')
                .insert({
                    user_id: userId,
                    amount: amount,
                    expected_profit: netProfit, // Storing net profit expected
                    status: 'pending',
                    // Start time will be set when admin approves or user confirms payment?
                    // For now set roughly now, but logic usually starts when active
                    start_time: new Date().toISOString(),
                    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            // Redirect to payment confirmation
            router.push(`/dashboard/payment/${data.id}`);

        } catch (error) {
            console.error('Error creating investment:', error);
            alert('Error al crear la inversión. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="max-w-3xl mx-auto border-gold-500/30">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Nueva Inversión
            </h2>

            <UrgencyTimer durationMinutes={120} bonusPercentage={5} />

            <div className="mb-8 px-4">
                <label className="block text-gray-400 mb-4 text-center">
                    Desliza para seleccionar tu inversión
                </label>

                <div className="flex items-center gap-4 mb-6">
                    {/* Decrement Button */}
                    <button
                        type="button"
                        onClick={() => setAmount(Math.max(Math.max(1, minAmount), amount - 1))}
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-dark-800 border border-gold-500/30 text-gold-400 text-2xl font-bold hover:bg-gold-500/10 hover:border-gold-500 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={amount <= Math.max(1, minAmount)}
                    >
                        −
                    </button>

                    {/* Slider */}
                    <div className="relative flex-1">
                        <input
                            type="range"
                            min={Math.max(1, minAmount)}
                            max="10000"
                            step="1"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full h-3 bg-dark-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all"
                        />
                    </div>

                    {/* Increment Button */}
                    <button
                        type="button"
                        onClick={() => setAmount(Math.min(10000, amount + 1))}
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-dark-800 border border-gold-500/30 text-gold-400 text-2xl font-bold hover:bg-gold-500/10 hover:border-gold-500 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={amount >= 10000}
                    >
                        +
                    </button>
                </div>

                <div className="flex justify-between items-center text-lg font-medium">
                    <div className="text-gray-500">{minAmount} USDT</div>
                    <div className="text-4xl font-bold text-gold-400 drop-shadow-lg">
                        {amount} <span className="text-lg text-gold-600">USDT</span>
                    </div>
                    <div className="text-gray-500">10,000 USDT</div>
                </div>
            </div>

            {/* Breakdown */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5 text-center">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Bruto (24h)</div>
                    <div className="text-xl font-bold text-white">{grossTotal.toFixed(2)} USDT</div>
                </div>
                <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5 text-center relative overflow-hidden">
                    <div className="text-red-400/80 text-xs uppercase tracking-wider mb-1">Fee (20%)</div>
                    <div className="text-xl font-bold text-red-400">-{fee.toFixed(2)} USDT</div>
                </div>
                <div className="bg-gold-500/10 p-4 rounded-xl border border-gold-500/30 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold-500/5 animate-pulse" />
                    <div className="text-gold-400 text-xs uppercase tracking-wider mb-1 relative z-10">Tu Cosecha</div>
                    <div className="text-2xl font-black text-gold-400 relative z-10">+{netProfit.toFixed(2)} USDT</div>
                </div>
            </div>

            <MetallicButton
                onClick={handleInvest}
                disabled={loading}
                fullWidth
                className="text-xl py-6"
            >
                {loading ? 'Procesando...' : 'Confirmar y Crecer'}
            </MetallicButton>

            <p className="mt-4 text-center text-xs text-gray-500">
                * Al confirmar, serás redirigido para realizar el pago.
            </p>
        </GlassCard>
    );
}
