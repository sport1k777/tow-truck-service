import { prisma } from '@/lib/prisma';
import { AdminPageHeader, AdminCard } from '@/components/admin/admin-ui';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      referenceNumber: true,
      status: true,
      customerName: true,
      totalPrice: true,
      createdAt: true,
    },
  }).catch(() => []);

  return (
    <>
      <AdminPageHeader title="Замовлення" description="Останні замовлення з бази даних." />
      <AdminCard>
        {orders.length === 0 ? (
          <p className="text-sm text-white/60">Замовлень поки немає.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-white/50">
                <tr>
                  <th className="px-3 py-2">№</th>
                  <th className="px-3 py-2">Клієнт</th>
                  <th className="px-3 py-2">Статус</th>
                  <th className="px-3 py-2">Сума</th>
                  <th className="px-3 py-2">Дата</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-white/10 text-white/80">
                    <td className="px-3 py-3">{order.referenceNumber}</td>
                    <td className="px-3 py-3">{order.customerName}</td>
                    <td className="px-3 py-3">{order.status}</td>
                    <td className="px-3 py-3">{Number(order.totalPrice)} ₴</td>
                    <td className="px-3 py-3">{order.createdAt.toLocaleString('uk-UA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </>
  );
}
