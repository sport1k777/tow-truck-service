'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PUBLIC_NAV_ITEMS } from '@/config/navigation';
import { BrandLogo } from '@/components/layout/brand-logo';

export function HeroHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#030712]/90 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-8 lg:px-14">
        <BrandLogo onNavigate={() => setMobileOpen(false)} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Головна навігація">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3.5 text-sm text-white transition-colors duration-200 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/order"
            className="hero-cta-primary hidden h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white sm:inline-flex sm:h-11"
          >
            Замовити
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 sm:h-11 sm:w-11 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="hero-mobile-nav"
            aria-label={mobileOpen ? 'Закрити меню' : 'Відкрити меню'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="hero-mobile-nav"
        className={`overflow-hidden border-t border-white/[0.06] bg-[#030712]/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          mobileOpen ? 'max-h-[24rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
        {...(!mobileOpen ? { inert: true } : {})}
      >
        <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Мобільна навігація">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-xl px-4 py-3 text-sm text-white transition-colors hover:bg-white/5 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
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
