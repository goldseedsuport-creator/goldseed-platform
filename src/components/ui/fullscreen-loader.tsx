import { cn } from '@/lib/utils';

export default function FullscreenLoader({ message = "Procesando..." }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col gap-6 items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-gold-500/30 rounded-full" />
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="text-2xl font-bold text-white tracking-widest uppercase animate-pulse">
                    {message}
                </div>
                <div className="text-gold-500/60 text-sm">
                    Por favor espere
                </div>
            </div>
        </div>
    );
}
