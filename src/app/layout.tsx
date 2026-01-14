import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AuraMed | AI-Powered Diagnostic Platform',
  description: 'Next-generation medical imaging analysis powered by AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-background text-text-primary transition-colors duration-300 font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
