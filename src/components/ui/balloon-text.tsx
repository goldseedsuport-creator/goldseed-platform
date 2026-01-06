import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BalloonTextProps {
    children: ReactNode;
    size?: 'xl' | 'lg' | 'md' | 'sm';
    className?: string;
    color?: 'gold' | 'white';
}

export default function BalloonText({
    children,
    size = 'lg',
    className = '',
    color = 'gold'
}: BalloonTextProps) {
    const sizeClasses = {
        xl: 'text-6xl md:text-7xl lg:text-8xl',
        lg: 'text-4xl md:text-5xl lg:text-6xl',
        md: 'text-2xl md:text-3xl lg:text-4xl',
        sm: 'text-xl md:text-2xl'
    };

    const colorClasses = color === 'gold'
        ? 'text-balloon'
        : 'text-white drop-shadow-2xl';

    return (
        <div className="relative inline-block">
            <h1 className={cn(
                "font-black tracking-tighter leading-none select-none",
                sizeClasses[size],
                colorClasses,
                "animate-breathe",
                className
            )}>
                {children}
            </h1>
        </div>
    );
}
