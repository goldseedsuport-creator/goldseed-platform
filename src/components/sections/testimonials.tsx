'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';
import BalloonText from '@/components/ui/balloon-text';

const testimonials = [
    {
        name: "María G.",
        role: "Venezuela",
        text: "Con GoldSeed pude pagar los estudios de mi hija. Comencé con 10 USDT que no me hacían falta y hoy tengo un colchón que me da paz. La aplicación es tan fácil que hasta mi mamá la usa.",
        initial: "M",
        flag: "🇻🇪"
    },
    {
        name: "Carlos R.",
        role: "Colombia",
        text: "Probé otras plataformas y siempre había excusas para los retiros. Aquí en 24 horas exactas tengo mi dinero. La transparencia me conquistó.",
        initial: "C",
        flag: "🇨🇴"
    },
    {
        name: "Ana L.",
        role: "México",
        text: "Pensé que era demasiado bueno para ser verdad. Hoy tengo 3 meses usándolo y cada retiro llega puntual. Mi error fue no empezar antes.",
        initial: "A",
        flag: "🇲🇽"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 relative z-10 bg-gradient-to-b from-transparent to-black/50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <BalloonText size="lg">No nos creas a nosotros</BalloonText>
                        <p className="text-gray-400 mt-4 text-lg">Cree a ellos.</p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <GlassCard hoverEffect className="h-full relative">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center text-black font-bold text-xl shadow-lg">
                                        {t.initial}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold flex items-center gap-2">
                                            {t.name} <span className="text-lg shadow-none filter-none block">{t.flag}</span>
                                        </div>
                                        <div className="text-gold-400/80 text-xs uppercase tracking-wider">{t.role}</div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute -top-4 -left-2 text-6xl text-gold-500/10 font-serif leading-none">"</span>
                                    <p className="text-gray-300 italic relative z-10 pl-4 border-l-2 border-gold-500/20">
                                        {t.text}
                                    </p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
