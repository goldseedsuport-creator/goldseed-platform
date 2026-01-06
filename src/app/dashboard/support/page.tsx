'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/ui/glass-card';
import MetallicButton from '@/components/ui/metallic-button';
import BalloonText from '@/components/ui/balloon-text';

export default function SupportPage() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase.from('tickets').insert({
                user_id: user.id,
                subject,
                message
            });
            setSuccess(true);
            setSubject('');
            setMessage('');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <BalloonText size="md">Centro de Ayuda</BalloonText>
                <p className="text-gray-400 mt-2">Estamos aquí para resolver tus dudas.</p>
            </div>

            <GlassCard className="border-gold-500/20">
                {success ? (
                    <div className="text-center py-10">
                        <div className="text-4xl mb-4">✅</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Ticket Recibido</h3>
                        <p className="text-gray-400">Un agente revisará tu caso en breve.</p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="mt-6 text-gold-400 underline hover:text-gold-300"
                        >
                            Enviar otro mensaje
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Asunto</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Ej: Problema con mi retiro"
                                className="w-full px-4 py-3 bg-dark-800/50 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-gray-600"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Mensaje</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe tu situación..."
                                rows={5}
                                className="w-full px-4 py-3 bg-dark-800/50 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-gray-600 resize-none"
                                required
                            />
                        </div>

                        <MetallicButton type="submit" fullWidth disabled={loading}>
                            {loading ? 'Enviando...' : 'Crear Ticket'}
                        </MetallicButton>
                    </form>
                )}
            </GlassCard>

            <div className="grid md:grid-cols-2 gap-4">
                <GlassCard className="text-center py-6">
                    <h4 className="text-white font-bold">Email</h4>
                    <p className="text-gold-400">soporte@goldseed.com</p>
                </GlassCard>
                <GlassCard className="text-center py-6">
                    <h4 className="text-white font-bold">Telegram</h4>
                    <p className="text-gold-400">@GoldSeedSupport</p>
                </GlassCard>
            </div>
        </div>
    );
}
