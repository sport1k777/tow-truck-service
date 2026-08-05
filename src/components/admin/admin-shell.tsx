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
  Star,
  HelpCircle,
  Search,
  LogOut,
  Settings,
  FileText,
  BarChart3,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/admin/vehicle-types', label: 'Vehicle Types', icon: Truck },
  { href: '/admin/extra-services', label: 'Extra Services', icon: PlusCircle },
  { href: '/admin/contacts', label: 'Contacts', icon: Phone },
  { href: '/admin/content', label: 'Website Content', icon: FileText },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
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
    </>
  );
}

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-theme flex min-h-screen bg-[#030712] text-white">
      <aside className="admin-sidebar hidden w-64 shrink-0 border-r border-white/10 bg-[#0a0f1e] lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin/dashboard" className="text-lg font-semibold text-white">
            Tow Truck Admin
          </Link>
          <p className="mt-1 text-xs text-white/50">CMS control panel</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <NavLinks />
        </nav>
        <div className="border-t border-white/10 p-4">
          {userName ? <p className="mb-3 truncate text-xs text-white/50">{userName}</p> : null}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin' })}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#0a0f1e]/80 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-white/10 p-2 text-white/80 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40">Admin Panel</p>
              <p className="text-sm text-white/70">Manage content without code changes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/admin' })}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5 lg:hidden"
            >
              Logout
            </button>
            <Link
              href="/"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
            >
              View site
            </Link>
          </div>
        </header>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/10 bg-[#0a0f1e]">
              <div className="border-b border-white/10 px-5 py-5">
                <p className="text-lg font-semibold text-white">Menu</p>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                <NavLinks onNavigate={() => setMobileOpen(false)} />
              </nav>
            </aside>
          </div>
        ) : null}

        <main className="flex-1 overflow-x-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
