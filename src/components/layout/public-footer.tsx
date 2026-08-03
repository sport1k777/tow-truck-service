import { SettingsService } from '@/modules/settings/settings.service';

export async function PublicFooter({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const settings = await SettingsService.getBusinessSettings();
  const companyName = settings.companyName || 'Евакуатор';
  const isDark = variant === 'dark';

  return (
    <footer
      className={
        isDark
          ? 'border-t border-white/5 bg-[#030712] py-10'
          : 'border-t border-border py-8'
      }
    >
      <div
        className={
          isDark
            ? 'mx-auto max-w-7xl px-6 text-sm text-white/40 sm:px-10 lg:px-14'
            : 'mx-auto max-w-6xl px-4 text-sm text-muted-foreground'
        }
      >
        <p>
          © {new Date().getFullYear()} {companyName}. Всі права захищені.
        </p>
      </div>
    </footer>
  );
}
