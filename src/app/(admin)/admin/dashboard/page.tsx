import { prisma } from '@/lib/prisma';
import { AdminPageHeader, AdminCard } from '@/components/admin/admin-ui';

export default async function AdminDashboardPage() {
  const [orders, testimonials, faqItems, vehicleCategories, settingsCount] = await Promise.all([
    prisma.order.count().catch(() => 0),
    prisma.testimonial.count().catch(() => 0),
    prisma.faqItem.count().catch(() => 0),
    prisma.vehicleCategory.count().catch(() => 0),
    prisma.setting.count().catch(() => 0),
  ]);

  const stats = [
    { label: 'Замовлення', value: orders },
    { label: 'Відгуки', value: testimonials },
    { label: 'FAQ', value: faqItems },
    { label: 'Типи авто', value: vehicleCategories },
    { label: 'Налаштування', value: settingsCount },
  ];

  return (
    <>
      <AdminPageHeader
        title="Панель керування"
        description="Огляд платформи. Усі зміни застосовуються на публічному сайті автоматично."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <AdminCard key={stat.label}>
            <p className="text-sm text-white/50">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
