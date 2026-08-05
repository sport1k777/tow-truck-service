import { prisma } from '@/lib/prisma';
import { getAnalyticsSummary } from '@/modules/analytics/analytics.service';
import { AdminPageHeader, AdminCard } from '@/components/admin/admin-ui';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const [analytics, testimonials, faqItems, vehicleCategories, settingsCount] = await Promise.all([
    getAnalyticsSummary(),
    prisma.testimonial.count().catch(() => 0),
    prisma.faqItem.count().catch(() => 0),
    prisma.vehicleCategory.count().catch(() => 0),
    prisma.setting.count().catch(() => 0),
  ]);

  const stats = [
    { label: 'Розрахунків', value: analytics.totalCalculations },
    { label: 'Замовлень', value: analytics.totalOrders },
    { label: 'Конверсія', value: `${analytics.conversionRate}%` },
    { label: 'Відгуки', value: testimonials },
    { label: 'FAQ', value: faqItems },
    { label: 'Типи авто', value: vehicleCategories },
    { label: 'Налаштування', value: settingsCount },
  ];

  const quickLinks = [
    { href: '/admin/pricing', label: 'Ціни та тарифи' },
    { href: '/admin/content', label: 'Контент сайту' },
    { href: '/admin/contacts', label: 'Контакти' },
    { href: '/admin/analytics', label: 'Аналітика' },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of calculations, orders, and CMS content."
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminCard key={stat.label}>
            <p className="text-sm text-white/50">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          </AdminCard>
        ))}
      </div>
      <AdminCard title="Швидкий доступ">
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
