import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { baseAppConfig } from '@/config/base.config';
import { generatePageMetadata } from '@/modules/seo/metadata';
import { AppProviders } from '@/components/providers/app-providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'optional',
  adjustFontFallback: true,
  preload: true,
});

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Evakuator24 — Евакуатор за 30 секунд',
    description: baseAppConfig.defaultDescription,
    path: '/',
  });
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
    { media: '(prefers-color-scheme: light)', color: '#030712' },
  ],
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="overflow-x-hidden">
      <body className={`${inter.variable} overflow-x-hidden font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
