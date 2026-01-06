'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BalloonText from '@/components/ui/balloon-text';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email || null);
            }
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navbar */}
            <nav className="border-b border-gold-500/20 bg-dark-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
                    <Link href="/dashboard">
                        <BalloonText size="sm" className="cursor-pointer">GoldSeed</BalloonText>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/support" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Ayuda
                        </Link>
                        <div className="hidden md:block text-sm text-gray-400">
                            {userEmail}
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="text-sm text-gold-400 hover:text-white transition-colors uppercase tracking-widest font-bold"
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
                {children}
            </main>
        </div>
    );
}
