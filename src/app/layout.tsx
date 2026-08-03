import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { generatePageMetadata } from '@/modules/seo/metadata';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Евакуатор — Швидкий виклик 24/7',
    description:
      'Професійна служба евакуації автомобілів. Швидкий розрахунок вартості, онлайн-замовлення, цілодобова підтримка.',
    path: '/',
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
