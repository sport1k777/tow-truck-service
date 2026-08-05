'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  DollarSign,
  Truck,
  PlusCircle,
  Phone,
  MapPin,
  Star,
  HelpCircle,
  ImageIcon,
  Search,
  ClipboardList,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Панель', icon: LayoutDashboard },
  { href: '/admin/pricing', label: 'Ціни', icon: DollarSign },
  { href: '/admin/vehicle-types', label: 'Типи авто', icon: Truck },
  { href: '/admin/extra-services', label: 'Дод. послуги', icon: PlusCircle },
  { href: '/admin/contacts', label: 'Контакти', icon: Phone },
  { href: '/admin/service-areas', label: 'Зона обслуговування', icon: MapPin },
  { href: '/admin/reviews', label: 'Відгуки', icon: Star },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/hero', label: 'Hero зображення', icon: ImageIcon },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/orders', label: 'Замовлення', icon: ClipboardList },
] as const;

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-theme flex min-h-screen bg-[#030712] text-white">
      <aside className="admin-sidebar hidden w-64 shrink-0 border-r border-white/10 bg-[#0a0f1e] lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin/dashboard" className="text-lg font-semibold text-white">
            Евакуатор Admin
          </Link>
          <p className="mt-1 text-xs text-white/50">Керування платформою</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-sky-500/15 text-sky-300'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          {userName ? <p className="mb-3 truncate text-xs text-white/50">{userName}</p> : null}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Вийти
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#0a0f1e]/80 px-4 py-4 backdrop-blur lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40">Адмін-панель</p>
            <p className="text-sm text-white/70">Керування без зміни коду</p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
          >
            На сайт
          </Link>
        </header>
        <main className="flex-1 overflow-x-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
