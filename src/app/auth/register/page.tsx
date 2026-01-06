'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/glass-card';
import MetallicButton from '@/components/ui/metallic-button';
import BalloonText from '@/components/ui/balloon-text';
import { Mail } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Capture Referral Code
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get('ref');
        if (refCode) {
            localStorage.setItem('goldseed_ref', refCode);
        }
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Get ref code
        const refCode = localStorage.getItem('goldseed_ref');

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                    data: {
                        referred_by_code: refCode || null
                    }
                },
            });

            if (signUpError) throw signUpError;

            // Clear ref code after successful signup
            if (refCode) localStorage.removeItem('goldseed_ref');

            // Check if session exists (Auto-confirm disabled) or not (Email confirm enabled)
            if (data.user && !data.session) {
                setSuccess(true); // User created but needs email verification
            } else {
                router.push('/dashboard'); // Auto-confirmed
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <GlassCard className="text-center py-10 border-gold-500/30">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gold-500/10 rounded-full text-gold-400 animate-pulse">
                        <Mail size={48} />
                    </div>
                </div>
                <BalloonText size="sm">¡Revisa tu Correo!</BalloonText>
                <p className="text-gray-400 mt-4 mb-6 text-sm leading-relaxed">
                    Hemos enviado un enlace de confirmación a <br />
                    <span className="text-white font-bold">{email}</span>
                </p>
                <div className="bg-dark-800/50 p-4 rounded-lg border border-white/5 mb-6 text-xs text-gray-500">
                    <p>1. Abre tu bandeja de entrada.</p>
                    <p>2. Busca el correo de GoldSeed.</p>
                    <p>3. Dale clic al botón "Confirmar".</p>
                </div>
                <button
                    onClick={() => router.push('/auth/login')}
                    className="text-gold-400 hover:text-white text-sm underline underline-offset-4 transition-colors"
                >
                    Volver al Inicio de Sesión
                </button>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="border-gold-500/20">
            <div className="text-center mb-8">
                <BalloonText size="md">Únete a GoldSeed</BalloonText>
                <p className="text-gray-400 text-sm mt-2">Tu camino a la libertad financiera</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-gray-600"
                        placeholder="tu@email.com"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-800/50 border border-gold-500/20 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-gray-600"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                        {error}
                    </div>
                )}

                <MetallicButton type="submit" fullWidth disabled={loading}>
                    {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
                </MetallicButton>

                <p className="text-center text-xs text-gray-500">
                    ¿Ya tienes cuenta?{' '}
                    <button
                        type="button"
                        onClick={() => router.push('/auth/login')}
                        className="text-gold-400 hover:underline"
                    >
                        Inicia Sesión
                    </button>
                </p>
            </form>
        </GlassCard>
    );
}
