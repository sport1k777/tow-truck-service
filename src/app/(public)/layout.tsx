import Link from 'next/link';
import { SettingsService } from '@/modules/settings/settings.service';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await SettingsService.getBusinessSettings();
  const companyName = settings.companyName || 'Евакуатор';

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold">
            {companyName}
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/services" className="hover:underline">
              Послуги
            </Link>
            <Link href="/order" className="hover:underline">
              Замовити
            </Link>
            <Link href="/contact" className="hover:underline">
              Контакти
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {companyName}. Всі права захищені.
          </p>
        </div>
      </footer>
    </div>
  );
}
