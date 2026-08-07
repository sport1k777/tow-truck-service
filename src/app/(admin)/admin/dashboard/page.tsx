import { getAnalyticsSummary } from '@/modules/analytics/analytics.service';
import { getDashboardSummary } from '@/modules/dashboard/dashboard.service';
import { AdminPageHeader, AdminCard } from '@/components/admin/admin-ui';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const [analytics, dashboard] = await Promise.all([getAnalyticsSummary(), getDashboardSummary()]);

  const stats = [
    { label: 'Total orders', value: dashboard.totalOrders },
    { label: "Today's orders", value: dashboard.todayOrders },
    { label: 'Total reviews', value: dashboard.totalReviews },
    { label: 'Calculations', value: analytics.totalCalculations },
    { label: 'Conversion', value: `${analytics.conversionRate}%` },
    { label: 'Orders (7 days)', value: analytics.ordersLast7Days },
  ];

  const quickLinks = [
    { href: '/admin/pricing', label: 'Pricing' },
    { href: '/admin/service-areas', label: 'Service Area' },
    { href: '/admin/content', label: 'Website Content' },
    { href: '/admin/contacts', label: 'Contacts' },
    { href: '/admin/settings', label: 'Settings' },
    { href: '/admin/analytics', label: 'Analytics' },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of orders, reviews, contacts, and recent CMS edits."
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <AdminCard key={stat.label}>
            <p className="text-sm text-white/50">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title="Latest contacts (orders)">
          {dashboard.latestOrders.length === 0 ? (
            <p className="text-sm text-white/50">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {dashboard.latestOrders.map((order) => (
                <li key={order.id} className="rounded-lg border border-white/10 px-4 py-3">
                  <p className="font-medium text-white">{order.customerName}</p>
                  <p className="text-sm text-white/60">{order.customerPhone}</p>
                  <p className="mt-1 text-xs text-white/40">
                    {order.referenceNumber} · {order.totalPrice.toLocaleString('uk-UA')} ₴ ·{' '}
                    {order.createdAt.toLocaleString('uk-UA')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Latest edits">
          {dashboard.latestEdits.length === 0 ? (
            <p className="text-sm text-white/50">No settings changes yet.</p>
          ) : (
            <ul className="space-y-3">
              {dashboard.latestEdits.map((edit) => (
                <li key={`${edit.key}-${edit.updatedAt.toISOString()}`} className="rounded-lg border border-white/10 px-4 py-3">
                  <p className="font-medium text-white">{edit.key}</p>
                  <p className="text-sm text-white/60">
                    {edit.group}
                    {edit.updatedBy ? ` · ${edit.updatedBy}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-white/40">{edit.updatedAt.toLocaleString('uk-UA')}</p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>

      <AdminCard title="Quick access" className="mt-6">
        <ul className="grid gap-2 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-sky-300 hover:text-sky-200">
                {link.label} →
              </Link>
            </li>
          ))}
        </ul>
      </AdminCard>
    </>
  );
}
