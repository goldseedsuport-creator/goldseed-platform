'use client';

import { motion } from 'framer-motion';
import BalloonText from '@/components/ui/balloon-text';
import MetallicButton from '@/components/ui/metallic-button';
import GlassCard from '@/components/ui/glass-card';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import HowItWorks from '@/components/sections/how-it-works';
import Testimonials from '@/components/sections/testimonials';


export default function Home() {
  // Client-side only consistent rendering for random values
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Capture Referral Code logic
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('goldseed_ref', refCode);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && [...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gold-500/10 rounded-full blur-3xl"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="z-10 max-w-5xl w-full text-center space-y-12 pt-10">

        {/* Hero Section */}
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-2 items-center"
          >
            <BalloonText size="xl" className="block leading-tight">
              El Crecimiento
            </BalloonText>
            <BalloonText size="xl" color="white" className="block leading-tight">
              que Buscabas Existe
            </BalloonText>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            <span className="text-gold-400 font-bold">GoldSeed</span> transforma tu esfuerzo en resultados.
            Comienza con solo <span className="text-white font-semibold">1 USDT</span> y obtén hasta
            <span className="text-gold-400 font-bold"> +50% en 24 horas</span>.
            Simple, seguro y diseñado para tu tranquilidad.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="pt-4"
          >
            <Link href="/auth/register">
              <MetallicButton className="text-xl px-12 py-6 shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)]">
                Quiero Crecer →
              </MetallicButton>
            </Link>
            <p className="mt-6 text-sm text-gray-400 animate-pulse">
              Únete a <span className="text-white font-mono">15,247</span> personas que ya están construyendo su futuro
            </p>
          </motion.div>
        </section>

        {/* Stats Section / Proof */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6 transform md:translate-y-12 w-full"
        >
          <GlassCard className="text-center py-8">
            <div className="text-4xl font-black text-balloon mb-2">
              +50%
            </div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
              Retorno en 24h
            </div>
          </GlassCard>

          <GlassCard className="text-center py-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-gold-500/10 transition-colors" />
            <div className="text-4xl font-black text-white mb-2">
              $2.4M+
            </div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
              Pagado a Usuarios
            </div>
          </GlassCard>

          <GlassCard className="text-center py-8">
            <div className="text-4xl font-black text-balloon mb-2">
              97%
            </div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
              Retiros &lt; 5 min
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <HowItWorks />
      <Testimonials />
    </main>

  );
}
