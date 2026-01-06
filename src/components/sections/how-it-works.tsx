'use client';

import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/glass-card';
import BalloonText from '@/components/ui/balloon-text';

const steps = [
    {
        number: '01',
        title: 'Planta tu Semilla',
        description: 'Desde 1 USDT, tú decides cuánto crecerá tu futuro. Sin mínimos ridículos, sin complicaciones.',
        icon: '🌱',
        color: 'bg-green-500/20'
    },
    {
        number: '02',
        title: 'Déjanos Trabajar',
        description: 'Relájate. Nuestro sistema trabaja 24/7 para multiplicar tu inversión. Tu único trabajo: esperar.',
        icon: '⏳',
        color: 'bg-purple-500/20'
    },
    {
        number: '03',
        title: 'Cosecha tus Frutos',
        description: 'En 24 horas exactas, retira tu inversión + ganancias (hasta 50%). Rápido y sin preguntas.',
        icon: '💰',
        color: 'bg-gold-500/20'
    },
    {
        number: '04',
        title: 'Reinvierte',
        description: 'Aumenta tu capital progresivamente superando tu última ganancia. El ciclo del éxito.',
        icon: '📈',
        color: 'bg-blue-500/20'
    }
];

export default function HowItWorks() {
    return (
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <BalloonText size="lg">Tres Pasos, Un Resultado</BalloonText>
                        <p className="text-gray-400 mt-4 text-lg">Más Dinero.</p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <GlassCard hoverEffect className="h-full flex flex-col items-start text-left relative overflow-hidden group">
                                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl transition-opacity opacity-50 group-hover:opacity-100 ${step.color}`} />

                                <span className="text-4xl mb-4 block filter drop-shadow-lg">{step.icon}</span>

                                <div className="text-gold-400 text-sm font-bold opacity-50 mb-1">Paso {step.number}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
