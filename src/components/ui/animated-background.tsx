'use client';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-900 to-black animate-gradient-shift"></div>

            {/* Golden Waves */}
            <svg
                className="absolute inset-0 w-full h-full opacity-20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                viewBox="0 0 1440 800"
            >
                <defs>
                    <linearGradient id="gold-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.15" />
                        <stop offset="50%" stopColor="#f4d03f" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0.15" />
                    </linearGradient>
                    <linearGradient id="gold-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f4d03f" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#d4af37" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#f4d03f" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* Wave 1 - Slow */}
                <path
                    className="wave wave-1"
                    fill="url(#gold-gradient-1)"
                    d="M0,160 C320,300,420,300,740,160 C1060,20,1120,20,1440,160 L1440,800 L0,800 Z"
                >
                    <animate
                        attributeName="d"
                        dur="20s"
                        repeatCount="indefinite"
                        values="
                            M0,160 C320,300,420,300,740,160 C1060,20,1120,20,1440,160 L1440,800 L0,800 Z;
                            M0,200 C320,100,420,100,740,200 C1060,300,1120,300,1440,200 L1440,800 L0,800 Z;
                            M0,160 C320,300,420,300,740,160 C1060,20,1120,20,1440,160 L1440,800 L0,800 Z
                        "
                    />
                </path>

                {/* Wave 2 - Medium */}
                <path
                    className="wave wave-2"
                    fill="url(#gold-gradient-2)"
                    d="M0,300 C360,450,520,450,720,300 C920,150,1080,150,1440,300 L1440,800 L0,800 Z"
                >
                    <animate
                        attributeName="d"
                        dur="15s"
                        repeatCount="indefinite"
                        values="
                            M0,300 C360,450,520,450,720,300 C920,150,1080,150,1440,300 L1440,800 L0,800 Z;
                            M0,350 C360,200,520,200,720,350 C920,500,1080,500,1440,350 L1440,800 L0,800 Z;
                            M0,300 C360,450,520,450,720,300 C920,150,1080,150,1440,300 L1440,800 L0,800 Z
                        "
                    />
                </path>

                {/* Wave 3 - Fast */}
                <path
                    className="wave wave-3"
                    fill="url(#gold-gradient-1)"
                    d="M0,500 C400,600,600,600,800,500 C1000,400,1200,400,1440,500 L1440,800 L0,800 Z"
                >
                    <animate
                        attributeName="d"
                        dur="10s"
                        repeatCount="indefinite"
                        values="
                            M0,500 C400,600,600,600,800,500 C1000,400,1200,400,1440,500 L1440,800 L0,800 Z;
                            M0,550 C400,450,600,450,800,550 C1000,650,1200,650,1440,550 L1440,800 L0,800 Z;
                            M0,500 C400,600,600,600,800,500 C1000,400,1200,400,1440,500 L1440,800 L0,800 Z
                        "
                    />
                </path>
            </svg>

            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${Math.random() * 20 + 15}s`
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes gradient-shift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-gradient-shift {
                    background-size: 200% 200%;
                    animation: gradient-shift 15s ease infinite;
                }

                @keyframes float-particle {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg);
                        opacity: 0;
                    }
                    10%, 90% {
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(100px, -100px) rotate(180deg);
                        opacity: 0.6;
                    }
                }

                .particle {
                    position: absolute;
                    background: radial-gradient(circle, #d4af37 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: float-particle linear infinite;
                    will-change: transform, opacity;
                }

                /* Performance optimization */
                .wave {
                    will-change: d;
                }
            `}</style>
        </div>
    );
}
