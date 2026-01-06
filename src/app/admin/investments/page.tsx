'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Investment } from '@/types/database';
import GlassCard from '@/components/ui/glass-card';
import { ExternalLink, Copy, Check } from 'lucide-react';

export default function AdminInvestments() {
    const [investments, setInvestments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedHash, setCopiedHash] = useState<string | null>(null);

    useEffect(() => {
        fetchInvestments();

        // Realtime Subscription
        const channel = supabase
            .channel('admin_investments')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'investments' },
                () => fetchInvestments()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchInvestments = async () => {
        const { data } = await supabase
            .from('investments')
            .select('*, users(email)')
            .order('created_at', { ascending: false });

        if (data) setInvestments(data);
        setLoading(false);
    };

    const copyHash = (hash: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedHash(hash);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    const approveInvestment = async (id: string, amount: number) => {
        if (!confirm('¿Confirmar pago recibido e iniciar timer?')) return;

        const { error } = await supabase
            .from('investments')
            .update({
                status: 'active',
                start_time: new Date().toISOString(),
                end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('id', id);

        if (!error) {
            fetchInvestments();
        }
    };

    const rejectInvestment = async (id: string) => {
        if (!confirm('¿Rechazar esta inversión? El usuario podrá intentar de nuevo.')) return;

        const { error } = await supabase
            .from('investments')
            .update({ status: 'rejected' })
            .eq('id', id);

        if (!error) {
            fetchInvestments();
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Gestión de Inversiones</h1>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-xs uppercase font-medium text-white">
                        <tr>
                            <th className="px-4 py-3">Usuario</th>
                            <th className="px-4 py-3">Monto</th>
                            <th className="px-4 py-3">TX Hash</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {investments.map((inv) => (
                            <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4 font-medium text-white">
                                    {inv.users?.email} <br />
                                    <span className="text-xs text-gray-500">{inv.id.slice(0, 8)}</span>
                                </td>
                                <td className="px-4 py-4 text-gold-400 font-bold">
                                    {inv.amount} USDT
                                </td>
                                <td className="px-4 py-4">
                                    {inv.transaction_hash ? (
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs bg-dark-900 px-2 py-1 rounded text-green-400">
                                                {inv.transaction_hash.slice(0, 8)}...
                                            </code>
                                            <button
                                                onClick={() => copyHash(inv.transaction_hash)}
                                                className="text-gray-500 hover:text-white transition-colors"
                                            >
                                                {copiedHash === inv.transaction_hash ? (
                                                    <Check size={14} />
                                                ) : (
                                                    <Copy size={14} />
                                                )}
                                            </button>
                                            <a
                                                href={`https://tronscan.org/#/transaction/${inv.transaction_hash}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-600">Sin comprobante</span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`px-2 py-1 rounded text-xs
                                ${inv.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            inv.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                                inv.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                                    inv.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    {new Date(inv.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-4">
                                    {inv.status === 'pending' && inv.transaction_hash && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => approveInvestment(inv.id, inv.amount)}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs"
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => rejectInvestment(inv.id)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    )}
                                    {inv.status === 'pending' && !inv.transaction_hash && (
                                        <span className="text-xs text-gray-600">Esperando pago...</span>
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
