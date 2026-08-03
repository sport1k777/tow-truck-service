import Link from 'next/link';
import { generatePageMetadata } from '@/modules/seo/metadata';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Адмін-панель',
    description: 'Керування замовленнями та налаштуваннями служби евакуації.',
    path: '/admin',
    noIndex: true,
  });
}

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Панель' },
  { href: '/admin/orders', label: 'Замовлення' },
  { href: '/admin/pricing', label: 'Ціни' },
  { href: '/admin/service-areas', label: 'Зони обслуговування' },
  { href: '/admin/settings', label: 'Налаштування' },
  { href: '/admin/export', label: 'Експорт' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/admin/dashboard" className="font-semibold">
            Адмін-панель
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
