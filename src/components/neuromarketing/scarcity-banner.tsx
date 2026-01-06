'use client';

import { useEffect, useState } from 'react';

export default function ScarcityBanner() {
    const [spotsLeft, setSpotsLeft] = useState(23);
    const [timeLeft, setTimeLeft] = useState({
        days: 5,
        hours: 12,
        minutes: 34,
        seconds: 56
    });

    useEffect(() => {
        // Simulate countdown
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;

                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                }
                if (hours < 0) {
                    hours = 23;
                    days--;
                }
                if (days < 0) {
                    // Reset to 30 days
                    days = 29;
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gradient-to-r from-red-900/20 via-orange-900/20 to-red-900/20 border-y border-red-500/30 py-3 px-4 backdrop-blur-sm">
            <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-center gap-3 text-center md:text-left">
                <div className="flex items-center gap-2">
                    <span className="text-2xl animate-pulse">⚡</span>
                    <p className="text-white font-bold text-sm md:text-base">
                        Solo quedan <span className="text-red-400 text-lg">{spotsLeft}</span> plazas disponibles este mes
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                    <span>Resetea en:</span>
                    <div className="flex gap-1 font-mono font-bold text-gold-400">
                        <span>{timeLeft.days}d</span>
                        <span>{timeLeft.hours.toString().padStart(2, '0')}h</span>
                        <span>{timeLeft.minutes.toString().padStart(2, '0')}m</span>
                        <span className="hidden md:inline">{timeLeft.seconds.toString().padStart(2, '0')}s</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
