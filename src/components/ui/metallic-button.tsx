import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetallicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
}

export default function MetallicButton({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}: MetallicButtonProps) {
    const baseClasses = "btn-metallic px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform";

    const widthClass = fullWidth ? "w-full" : "w-auto";

    return (
        <button
            className={cn(baseClasses, widthClass, className)}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
            {/* Internal shimmer effect container */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-gold-500/20 to-transparent animate-shimmer" />
            </div>
        </button>
    );
}
