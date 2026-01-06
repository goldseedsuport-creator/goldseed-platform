'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/ui/glass-card';
import { Investment } from '@/types/database';
import { formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ActiveInvestment({ investment }: { investment: Investment }) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const end = new Date(investment.end_time);
            const start = new Date(investment.start_time);

            const totalDuration = differenceInSeconds(end, start);
            const elapsed = differenceInSeconds(now, start);
            const remaining = differenceInSeconds(end, now);

            // Calc progress 0-100
            const prog = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
            setProgress(prog);

            if (remaining <= 0) {
                setTimeLeft('¡Lista para cosechar!');
                // Ideally trigger a refresh or status update here
            } else {
                // Simple HH:MM:SS format manually or use date-fns for "in X hours"
                const hours = Math.floor(remaining / 3600);
                const minutes = Math.floor((remaining % 3600) / 60);
                const seconds = remaining % 60;
                setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [investment]);

    return (
        <GlassCard className="border-gold-500/40 relative overflow-hidden">
            {/* Background Progress Bar */}
            <div
                className="absolute bottom-0 left-0 h-1 bg-gold-500 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
            />

            <div className="text-center py-8 relative z-10">
                <h3 className="text-gray-400 uppercase tracking-widest text-sm mb-4">
                    Cosecha en Progreso
                </h3>

                <div className="text-6xl md:text-7xl font-black text-white tabular-nums mb-6 font-mono tracking-tighter">
                    {timeLeft}
                </div>

                <div className="grid grid-cols-2 gap-8 max-w-sm mx-auto">
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Semilla</div>
                        <div className="text-xl font-bold text-white">{investment.amount} USDT</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase">Cosecha Esperada</div>
                        <div className="text-xl font-bold text-gold-400">
                            {/* Calculate expected total (Capital + Profit) */}
                            {(investment.amount + (investment.expected_profit || 0)).toFixed(2)} USDT
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    {timeLeft === '¡Lista para cosechar!' ? (
                        <button
                            onClick={async () => {
                                const { error } = await supabase.rpc('harvest_investment', { p_investment_id: investment.id });
                                if (error) {
                                    alert('Error al cosechar: ' + error.message);
                                } else {
                                    window.location.reload();
                                }
                            }}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 rounded-xl text-white font-bold text-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse hover:scale-[1.02] transition-transform"
                        >
                            RECOGER COSECHA 🌾
                        </button>
                    ) : (
                        <>
                            <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gold-500 h-full rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_#FFD700]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gold-500/60 mt-2 animate-pulse">
                                Tu dinero está trabajando...
                            </p>
                        </>
                    )}
                </div>
            </div>
        </GlassCard>
    );
}
