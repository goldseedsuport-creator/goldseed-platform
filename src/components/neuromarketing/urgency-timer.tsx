'use client';

import { useEffect, useState } from 'react';

interface UrgencyTimerProps {
    durationMinutes?: number;
    bonusPercentage?: number;
    onExpire?: () => void;
}

export default function UrgencyTimer({
    durationMinutes = 120, // 2 hours default
    bonusPercentage = 5,
    onExpire
}: UrgencyTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        // Check if timer exists in localStorage
        const savedEndTime = localStorage.getItem('urgency_timer_end');
        let endTime: number;

        if (savedEndTime) {
            endTime = parseInt(savedEndTime);
        } else {
            // Create new timer
            endTime = Date.now() + (durationMinutes * 60 * 1000);
            localStorage.setItem('urgency_timer_end', endTime.toString());
        }

        const updateTimer = () => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                setIsExpired(true);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                if (onExpire) onExpire();
                // Reset timer for next session
                localStorage.removeItem('urgency_timer_end');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [durationMinutes, onExpire]);

    if (isExpired) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-orange-900/20 via-red-900/20 to-orange-900/20 border border-orange-500/30 rounded-xl p-4 mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-pulse"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-3xl animate-bounce">🔥</span>
                    <div>
                        <p className="text-white font-bold text-sm md:text-base">
                            ¡Bono Especial del {bonusPercentage}% Extra!
                        </p>
                        <p className="text-gray-400 text-xs">
                            Solo por tiempo limitado
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Termina en:</span>
                    <div className="flex gap-1">
                        <div className="bg-dark-900/50 px-3 py-2 rounded-lg border border-orange-500/30">
                            <span className="text-orange-400 font-mono font-bold text-lg">
                                {timeLeft.hours.toString().padStart(2, '0')}
                            </span>
                            <span className="text-gray-500 text-xs block">hrs</span>
                        </div>
                        <div className="bg-dark-900/50 px-3 py-2 rounded-lg border border-orange-500/30">
                            <span className="text-orange-400 font-mono font-bold text-lg">
                                {timeLeft.minutes.toString().padStart(2, '0')}
                            </span>
                            <span className="text-gray-500 text-xs block">min</span>
                        </div>
                        <div className="bg-dark-900/50 px-3 py-2 rounded-lg border border-orange-500/30">
                            <span className="text-orange-400 font-mono font-bold text-lg">
                                {timeLeft.seconds.toString().padStart(2, '0')}
                            </span>
                            <span className="text-gray-500 text-xs block">seg</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
