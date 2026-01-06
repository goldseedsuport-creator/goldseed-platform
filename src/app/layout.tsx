import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GoldSeed | Planta hoy, cosecha mañana',
  description: 'Plataforma de inversión inteligente. Genera hasta 50% de retorno en 24 horas con USDT.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={cn(inter.className, "bg-background text-foreground min-h-screen antialiased selection:bg-gold-500 selection:text-black overflow-x-hidden")}>
        {children}
      </body>
    </html>
  );
}
