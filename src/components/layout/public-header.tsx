import Link from 'next/link';
import { SettingsService } from '@/modules/settings/settings.service';

interface PublicHeaderProps {
  variant?: 'dark' | 'light';
}

const NAV_ITEMS = [
  { href: '/', label: 'Головна' },
  { href: '/services', label: 'Послуги' },
  { href: '/#how-it-works', label: 'Як це працює' },
  { href: '/#pricing', label: 'Ціни' },
  { href: '/contact', label: 'Контакти' },
] as const;

export async function PublicHeader({ variant = 'dark' }: PublicHeaderProps) {
  const settings = await SettingsService.getBusinessSettings();
  const companyName = settings.companyName || 'Евакуатор';

  const isDark = variant === 'dark';

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
              ? 'text-base font-semibold tracking-tight text-white'
              : 'text-lg font-semibold'
          }
        >
          {companyName}
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Навігація">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isDark
                  ? 'rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50'
                  : 'px-3 py-2 text-sm hover:underline focus-visible:outline-none'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/order"
          className={
            isDark
              ? 'hero-cta-primary inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold text-white sm:h-10 sm:px-5'
              : 'inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground'
          }
        >
          Замовити
        </Link>
      </div>
    </header>
  );
}
