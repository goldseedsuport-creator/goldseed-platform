'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/ui/glass-card';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeInvestments: 0,
        pendingWithdrawals: 0,
        totalVolume: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        // These could be optimized with count queries or RPC

        // Total Users
        const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

        // Active Investments
        const { count: activeInv } = await supabase.from('investments').select('*', { count: 'exact', head: true }).eq('status', 'active');

        // Pending Withdrawals
        const { count: pendingWith } = await supabase.from('withdrawals').select('*', { count: 'exact', head: true }).eq('status', 'pending');

        // Total Volume Investigated (Simple sum simulation, ideally RPC sum)
        // For now showing count to save bandwidth or could create a Postgres function
        // Let's just use a loose number or count of investments

        setStats({
            totalUsers: usersCount || 0,
            activeInvestments: activeInv || 0,
            pendingWithdrawals: pendingWith || 0,
            totalVolume: 0 // Placeholder
        });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-8">Panel de Control</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="border-blue-500/30">
                    <div className="text-gray-400 text-sm uppercase">Usuarios Totales</div>
                    <div className="text-3xl font-bold text-blue-400">{stats.totalUsers}</div>
                </GlassCard>

                <GlassCard className="border-gold-500/30">
                    <div className="text-gray-400 text-sm uppercase">Inversiones Activas</div>
                    <div className="text-3xl font-bold text-gold-400">{stats.activeInvestments}</div>
                </GlassCard>

                <GlassCard className="border-red-500/30">
                    <div className="text-gray-400 text-sm uppercase">Retiros Pendientes</div>
                    <div className="text-3xl font-bold text-red-400">{stats.pendingWithdrawals}</div>
                </GlassCard>
            </div>

            <div className="mt-12 p-6 bg-dark-800 rounded-xl border border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h2>
                <div className="flex gap-4">
                    {/* Just links to the tabs */}
                    <a href="/admin/investments" className="px-6 py-3 bg-gold-600 rounded-lg text-black font-bold hover:bg-gold-500">
                        Ver Inversiones
                    </a>
                    <a href="/admin/withdrawals" className="px-6 py-3 bg-white/10 rounded-lg text-white font-bold hover:bg-white/20">
                        Ver Retiros
                    </a>
                </div>
            </div>
        </div>
    );
}
