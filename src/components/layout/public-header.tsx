import Link from 'next/link';
import { SettingsService } from '@/modules/settings/settings.service';

interface PublicHeaderProps {
  variant?: 'dark' | 'light';
}

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
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/services"
            className={
              isDark
                ? 'rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:text-white'
                : 'px-3 py-2 text-sm hover:underline'
            }
          >
            Послуги
          </Link>
          <Link
            href="/contact"
            className={
              isDark
                ? 'hidden rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:text-white sm:inline-flex'
                : 'hidden px-3 py-2 text-sm hover:underline sm:inline-flex'
            }
          >
            Контакти
          </Link>
          <Link
            href="/order"
            className={
              isDark
                ? 'ml-1 inline-flex h-9 items-center justify-center rounded-full bg-white/10 px-4 text-sm font-medium text-white transition-all hover:bg-white/15 sm:ml-2 sm:h-10 sm:px-5'
                : 'inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground'
            }
          >
            Замовити
          </Link>
        </nav>
      </div>
    </header>
  );
}
