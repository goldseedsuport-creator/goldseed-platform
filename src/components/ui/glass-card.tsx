import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export default function GlassCard({
    children,
    className = '',
    hoverEffect = true
}: GlassCardProps) {
    return (
        <div className={cn(
            "glass-card rounded-2xl p-6 transition-all duration-300",
            hoverEffect && "hover:bg-white/5 hover:border-gold-500/30 hover:scale-[1.01]",
            className
        )}>
            {children}
        </div>
    );
}
