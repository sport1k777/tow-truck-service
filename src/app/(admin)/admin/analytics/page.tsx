import { getAnalyticsSummary } from '@/modules/analytics/analytics.service';
import { AdminPageHeader, AdminCard } from '@/components/admin/admin-ui';

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalyticsSummary();

  const stats = [
    { label: 'Розрахунків (всього)', value: analytics.totalCalculations },
    { label: 'Замовлень (всього)', value: analytics.totalOrders },
    { label: 'Конверсія', value: `${analytics.conversionRate}%` },
    { label: 'Розрахунків (7 днів)', value: analytics.calculationsLast7Days },
    { label: 'Замовлень (7 днів)', value: analytics.ordersLast7Days },
  ];

  return (
    <>
      <AdminPageHeader
        title="Аналітика"
        description="Статистика калькулятора, замовлень та популярні маршрути."
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <AdminCard key={stat.label}>
            <p className="text-sm text-white/50">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          </AdminCard>
        ))}
      </div>

      <AdminCard title="Популярні маршрути">
        {analytics.popularRoutes.length === 0 ? (
          <p className="text-sm text-white/50">Дані з&apos;являться після першого розрахунку в калькуляторі.</p>
        ) : (
          <ul className="space-y-3">
            {analytics.popularRoutes.map((route) => (
              <li
                key={`${route.pickupAddress}-${route.destinationAddress}`}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm"
              >
                <p className="font-medium text-white">{route.pickupAddress}</p>
                <p className="text-white/50">→ {route.destinationAddress}</p>
                <p className="mt-1 text-xs text-sky-300">{route.count} розрахунків</p>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </>
  );
}
