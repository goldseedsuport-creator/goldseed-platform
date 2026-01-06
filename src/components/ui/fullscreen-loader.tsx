import { cn } from '@/lib/utils';
import CustomLoader from './custom-loader';

export default function FullscreenLoader({ message = "Procesando..." }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col gap-6 items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300">
            <CustomLoader />
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
