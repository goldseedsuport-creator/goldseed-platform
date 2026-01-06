'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/glass-card';
import MetallicButton from '@/components/ui/metallic-button';
import { Copy, Check, Users, Coins } from 'lucide-react';
import { User } from '@/types/database';
import { supabase } from '@/lib/supabase';

export default function ReferralCard({ user }: { user: User }) {
    const [copied, setCopied] = useState(false);
    const [referralCount, setReferralCount] = useState<number>(0);
    const [link, setLink] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined' && user.referral_code) {
            setLink(`${window.location.origin}/auth/register?ref=${user.referral_code}`);
        }
        fetchReferralCount();
    }, [user]);

    const fetchReferralCount = async () => {
        // Query users table where referred_by = me
        // Requires Policy: "Users can see who they referred"
        const { count } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('referred_by', user.id);

        if (count !== null) setReferralCount(count);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!user.referral_code) return null;

    return (
        <GlassCard className="border-purple-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-400">
                <Users size={120} />
            </div>

            <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Users className="text-purple-400" />
                    Programa de Referidos
                </h3>
                <p className="text-gray-400 text-sm mb-6 max-w-lg">
                    Comparte tu enlace único y gana el <span className="text-gold-400 font-bold">10%</span> de las ganancias de cada amigo que invites.
                </p>

                {/* Link Box */}
                <div className="bg-dark-900/50 p-1 rounded-xl flex items-center gap-2 border border-white/5 mb-6">
                    <div className="flex-1 px-4 py-3 text-sm text-gray-300 truncate font-mono select-all">
                        {link}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        <span className="text-xs font-bold hidden sm:inline">COPIAR</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-xs text-gray-400 uppercase mb-1">Amigos Invitados</div>
                        <div className="text-2xl font-bold text-white flex items-center gap-2">
                            <Users size={20} className="text-blue-400" />
                            {referralCount}
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-xs text-gray-400 uppercase mb-1">Ganancias Totales</div>
                        <div className="text-2xl font-bold text-gold-400 flex items-center gap-2">
                            <Coins size={20} />
                            ${user.referral_total_earnings?.toFixed(2) || '0.00'}
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
