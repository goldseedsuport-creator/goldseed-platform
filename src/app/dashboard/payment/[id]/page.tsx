'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Investment } from '@/types/database';
import GlassCard from '@/components/ui/glass-card';
import MetallicButton from '@/components/ui/metallic-button';
import BalloonText from '@/components/ui/balloon-text';
import FullscreenLoader from '@/components/ui/fullscreen-loader';
import { useRouter } from 'next/navigation';
import { Copy, Check, Hash } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function PaymentPage() {
    const params = useParams(); // Use useParams hook
    const id = params?.id as string;
    const router = useRouter();
    const [investment, setInvestment] = useState<Investment | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [confirming, setConfirming] = useState(false);

    // TX Input State
    const [txHash, setTxHash] = useState('');
    const [hashError, setHashError] = useState('');

    // WALLET ADDRESS (Ideally from env or database config)
    const ADMIN_WALLET = "TJD7NqzEkF5oX2aw5V51Va2XkfL3o2EAkw";

    useEffect(() => {
        if (id) fetchInvestment();
    }, [id]);

    const fetchInvestment = async () => {
        const { data } = await supabase
            .from('investments')
            .select('*')
            .eq('id', id)
            .single();

        if (data) {
            setInvestment(data);
            // If already paid (has hash) but pending, redirect to dashboard which shows status
            if (data.transaction_hash && data.status === 'pending') {
                router.push('/dashboard');
            }
        }
        setLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(ADMIN_WALLET);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmPayment = async () => {
        if (!txHash.trim()) {
            setHashError('Por favor ingresa el ID de transacción');
            return;
        }
        if (txHash.length < 10) {
            setHashError('El ID parece demasiado corto');
            return;
        }

        setConfirming(true);
        setHashError('');

        try {
            const { error } = await supabase
                .from('investments')
                .update({
                    transaction_hash: txHash,
                    status: 'pending' // RESET STATUS TO PENDING SO ADMIN SEES IT AGAIN
                })
                .eq('id', id);

            if (error) throw error;

            // Success feedback
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);

        } catch (error) {
            console.error('Error confirming payment:', error);
            alert('Error al guardar el ID. Intenta de nuevo.');
            setConfirming(false);
        }
    };

    const handleCancel = async () => {
        if (!investment) return;
        const confirm = window.confirm("¿Estás seguro de cancelar esta inversión?");
        if (!confirm) return;

        await supabase.from('investments').delete().eq('id', investment.id);
        router.push('/dashboard');
    };

    if (loading) return <FullscreenLoader message="Cargando detalles..." />;
    if (!investment) return <div className="text-white text-center pt-20">Inversión no encontrada</div>;

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {confirming && <FullscreenLoader message="Verificando envío..." />}

            <div className="text-center mb-10">
                <BalloonText size="md">Completa tu Siembra</BalloonText>
            </div>

            <GlassCard className="border-gold-500/30">
                {/* Amount Display */}
                <div className="bg-dark-800/50 p-6 rounded-xl border border-white/5 mb-8 text-center">
                    <p className="text-gray-400 text-sm mb-2">Monto a Enviar EXACTO</p>
                    <div className="text-4xl font-black text-gold-400">{investment.amount} USDT</div>
                    <p className="text-xs text-red-400 mt-2">Envía solo red TRC20</p>
                </div>

                <div className="space-y-6">
                    {/* Wallet Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Billetera de Destino</label>
                        <div className="relative group">
                            <div className="w-full px-4 py-4 bg-dark-900 border border-gold-500/20 rounded-xl text-white font-mono text-xs sm:text-sm break-all pr-12">
                                {ADMIN_WALLET}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gold-500/10 rounded-lg transition-colors text-gold-400"
                            >
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Transaction ID Input */}
                    <div className="pt-4 border-t border-white/5">
                        <label className="text-sm font-medium text-gold-400 mb-2 block flex items-center gap-2">
                            <Hash size={16} />
                            Comprobante de Pago
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            Pega aquí el ID de Transacción (TXID / Hash) que te dio tu billetera o exchange.
                        </p>
                        <input
                            type="text"
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            className="w-full px-4 py-3 bg-dark-900 border border-gold-500/40 rounded-xl text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-gold-500 transition-all"
                            placeholder="Ej: f4a52b8..."
                        />
                        {hashError && (
                            <p className="text-red-400 text-xs mt-2 ml-1">{hashError}</p>
                        )}
                    </div>
                </div>

                <div className="mt-10 space-y-4">
                    <MetallicButton
                        onClick={handleConfirmPayment}
                        fullWidth
                        className="py-4 text-lg"
                    >
                        Confirmar Envío
                    </MetallicButton>

                    <button
                        onClick={handleCancel}
                        className="w-full py-4 text-gray-500 text-sm hover:text-white transition-colors"
                    >
                        Cancelar Inversión
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
