'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BalloonText from '@/components/ui/balloon-text';
import FullscreenLoader from '@/components/ui/fullscreen-loader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/auth/login');
            return;
        }

        // Check role in users table
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            router.push('/dashboard'); // Not authorized
        } else {
            setAuthorized(true);
        }
        setLoading(false);
    };

    if (loading) return <FullscreenLoader message="Verificando credenciales..." />;
    if (!authorized) return null;

    return (
        <div className="min-h-screen bg-dark-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-black border-r border-gold-500/20 hidden md:block">
                <div className="p-6">
                    <BalloonText size="sm">AdminPanel</BalloonText>
                </div>
                <nav className="px-4 space-y-2">
                    <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-gold-500/10 hover:text-gold-400 transition-colors">
                        Resumen
                    </Link>
                    <Link href="/admin/investments" className="block px-4 py-3 rounded-lg hover:bg-gold-500/10 hover:text-gold-400 transition-colors">
                        Inversiones
                    </Link>
                    <Link href="/admin/withdrawals" className="block px-4 py-3 rounded-lg hover:bg-gold-500/10 hover:text-gold-400 transition-colors">
                        Retiros
                    </Link>
                    <Link href="/dashboard" className="block px-4 py-3 rounded-lg text-gray-500 hover:text-white mt-8 border-t border-white/5">
                        ← Volver a la App
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
