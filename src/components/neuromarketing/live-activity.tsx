'use client';

import { useEffect, useState } from 'react';

interface Activity {
    id: string;
    name: string;
    action: string;
    amount: string;
    time: string;
    icon: string;
}

const activities: Activity[] = [
    { id: '1', name: 'María', action: 'invirtió', amount: '$200', time: 'hace 2 min', icon: '🟢' },
    { id: '2', name: 'Carlos', action: 'retiró ganancias de', amount: '$340', time: 'hace 5 min', icon: '💰' },
    { id: '3', name: 'Ana', action: 'se registró', amount: '', time: 'hace 8 min', icon: '✨' },
    { id: '4', name: 'Pedro', action: 'invirtió', amount: '$150', time: 'hace 12 min', icon: '🟢' },
    { id: '5', name: 'Lucía', action: 'retiró ganancias de', amount: '$280', time: 'hace 15 min', icon: '💰' },
    { id: '6', name: 'Jorge', action: 'invirtió', amount: '$500', time: 'hace 18 min', icon: '🟢' },
];

export default function LiveActivity() {
    const [currentActivity, setCurrentActivity] = useState(0);
    const [viewersCount, setViewersCount] = useState(15);

    useEffect(() => {
        // Rotate activities every 5 seconds
        const activityInterval = setInterval(() => {
            setCurrentActivity(prev => (prev + 1) % activities.length);
        }, 5000);

        // Simulate viewers count fluctuation
        const viewersInterval = setInterval(() => {
            setViewersCount(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const newCount = prev + change;
                return Math.max(10, Math.min(30, newCount)); // Keep between 10-30
            });
        }, 8000);

        return () => {
            clearInterval(activityInterval);
            clearInterval(viewersInterval);
        };
    }, []);

    const activity = activities[currentActivity];

    return (
        <div className="fixed bottom-6 left-6 z-40 hidden md:block">
            <div className="space-y-3">
                {/* Live Activity */}
                <div className="bg-dark-900/95 backdrop-blur-md border border-green-500/30 rounded-xl p-4 shadow-2xl animate-fade-in max-w-xs">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">{activity.icon}</span>
                        <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                                <span className="text-green-400">{activity.name}</span> {activity.action} {activity.amount}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                        </div>
                    </div>
                </div>

                {/* Viewers Count */}
                <div className="bg-dark-900/95 backdrop-blur-md border border-blue-500/30 rounded-xl px-4 py-2 shadow-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <p className="text-white text-xs">
                            <span className="font-bold text-blue-400">{viewersCount}</span> personas viendo ahora
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
