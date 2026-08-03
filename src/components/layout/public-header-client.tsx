'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PUBLIC_NAV_ITEMS } from '@/config/navigation';

interface PublicHeaderClientProps {
  companyName: string;
  isDark: boolean;
}

export function PublicHeaderClient({ companyName, isDark }: PublicHeaderClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const linkClass = isDark
    ? 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3.5 text-sm text-white transition-colors hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50'
    : 'inline-flex min-h-11 min-w-11 items-center justify-center px-3 py-2 text-sm hover:underline focus-visible:outline-none';

  const mobileLinkClass =
    'inline-flex min-h-11 items-center rounded-xl px-4 py-3 text-sm text-white/90 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50';

  const orderClass = isDark
    ? 'hero-cta-primary inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-white sm:px-5'
    : 'inline-flex h-11 min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground';

  return (
    <header
      className={
        isDark
          ? 'fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl'
          : 'border-b border-border bg-background'
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-14">
        <Link
          href="/"
          className={
            isDark
              ? 'relative z-10 inline-flex min-h-11 min-w-11 items-center justify-center px-3 text-base font-semibold tracking-tight text-white'
              : 'inline-flex min-h-11 min-w-11 items-center justify-center px-3 text-lg font-semibold'
          }
          aria-label={`${companyName} — головна`}
        >
          {companyName}
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Навігація">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/order" className={`${orderClass} hidden sm:inline-flex`}>
            Замовити
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-nav"
            aria-label={mobileOpen ? 'Закрити меню' : 'Відкрити меню'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="public-mobile-nav"
        className={`overflow-hidden border-t border-white/[0.06] bg-[#030712]/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          mobileOpen ? 'max-h-[24rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
        {...(!mobileOpen ? { inert: true } : {})}
      >
        <nav
          className="flex flex-col gap-1 px-6 py-4"
          aria-label={`Мобільна навігація — ${companyName}`}
        >
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={mobileLinkClass}
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
