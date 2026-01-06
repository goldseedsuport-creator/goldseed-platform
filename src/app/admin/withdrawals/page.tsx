'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/ui/glass-card';

export default function AdminWithdrawals() {
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        const { data } = await supabase
            .from('withdrawals')
            .select('*, users(email)')
            .order('created_at', { ascending: false });

        if (data) setWithdrawals(data);
        setLoading(false);
    };

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        const confirmMsg = action === 'approved' ? '¿Confirmar que enviaste los fondos?' : '¿Rechazar solicitud?';
        if (!confirm(confirmMsg)) return;

        const { error } = await supabase
            .from('withdrawals')
            .update({ status: action })
            .eq('id', id);

        if (action === 'approved') {
            // Ideally verify amount matches a 'completed' investment and mark that investment as 'withdrawn' too
            // For MVP, manual control is enough
        }

        fetchWithdrawals();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Solicitudes de Retiro</h1>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-xs uppercase font-medium text-white">
                        <tr>
                            <th className="px-4 py-3">Usuario</th>
                            <th className="px-4 py-3">Monto</th>
                            <th className="px-4 py-3">Wallet / Red</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {withdrawals.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4 font-medium text-white">
                                    {item.users?.email}
                                </td>
                                <td className="px-4 py-4 text-red-400 font-bold">
                                    {item.amount} USDT
                                </td>
                                <td className="px-4 py-4 font-mono text-xs">
                                    {item.wallet_address} <br />
                                    <span className="text-gold-500">{item.network}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`px-2 py-1 rounded text-xs
                                ${item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            item.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 flex gap-2">
                                    {item.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAction(item.id, 'approved')}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs"
                                            >
                                                Aprobar (Pagado)
                                            </button>
                                            <button
                                                onClick={() => handleAction(item.id, 'rejected')}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs"
                                            >
                                                Rechazar
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
