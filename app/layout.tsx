import type { Metadata } from 'next';
import { Bricolage_Grotesque, Caveat, Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
});

const hand = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
});

export const metadata: Metadata = {
  title: 'Axis',
  description: 'AI trading onboarding and behavior planning',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${display.variable} ${hand.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
