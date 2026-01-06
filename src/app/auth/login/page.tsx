'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import MetallicButton from '@/components/ui/metallic-button';
import GlassCard from '@/components/ui/glass-card';
import BalloonText from '@/components/ui/balloon-text';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            router.push('/dashboard');
            router.refresh(); // Refresh to update middleware/auth state

        } catch (err: any) {
            console.error(err);
            setError('Credenciales incorrectas o error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="border-gold-500/20 shadow-2xl">
            <div className="text-center mb-8 space-y-2">
                <BalloonText size="md" className="block">Hola de nuevo</BalloonText>
                <p className="text-gray-400 text-sm">Tu futuro te estaba esperando</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gold-100 ml-1">Email</label>
                    <input
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-gray-600"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-sm font-medium text-gold-100">Contraseña</label>
                    </div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-gray-600"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="pt-2">
                    <MetallicButton
                        type="submit"
                        disabled={loading}
                        fullWidth
                        className="py-4 text-lg"
                    >
                        {loading ? 'Accediendo...' : 'Entrar a mi Cuenta'}
                    </MetallicButton>
                </div>
            </form>

            <div className="mt-6 text-center pt-6 border-t border-white/5">
                <p className="text-gray-400 text-sm">
                    ¿Aún no siembras?{' '}
                    <Link href="/auth/register" className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                        Crear Cuenta Gratis
                    </Link>
                </p>
            </div>
        </GlassCard>
    );
}
