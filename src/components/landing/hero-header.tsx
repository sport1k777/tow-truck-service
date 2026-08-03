'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeroHeaderProps {
  companyName: string;
}

const NAV_ITEMS = [
  { href: '/', label: 'Головна' },
  { href: '/services', label: 'Послуги' },
  { href: '/#how-it-works', label: 'Як це працює' },
  { href: '/#pricing', label: 'Ціни' },
  { href: '/contact', label: 'Контакти' },
] as const;

export function HeroHeader({ companyName }: HeroHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/[0.06] bg-[#030712]/90 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-[4.5rem] sm:px-10 lg:px-14">
        <Link
          href="/"
          className="relative z-10 text-base font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
          aria-label={`${companyName} — головна`}
        >
          {companyName}
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Головна навігація"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm text-white/55 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/order"
            className="hero-cta-primary hidden h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white sm:inline-flex"
          >
            Замовити
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="hero-mobile-nav"
            aria-label={mobileOpen ? 'Закрити меню' : 'Відкрити меню'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="hero-mobile-nav"
        className={`overflow-hidden border-t border-white/[0.06] bg-[#030712]/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          mobileOpen ? 'max-h-[24rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Мобільна навігація">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/order"
            className="hero-cta-primary mt-2 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            Замовити евакуатор
          </Link>
        </nav>
      </div>
    </header>
  );
}
