import { prisma } from '@/lib/prisma';

export interface DashboardSummary {
  totalOrders: number;
  todayOrders: number;
  totalReviews: number;
  latestOrders: Array<{
    id: string;
    referenceNumber: string;
    customerName: string;
    customerPhone: string;
    totalPrice: number;
    createdAt: Date;
  }>;
  latestEdits: Array<{
    key: string;
    group: string;
    updatedAt: Date;
    updatedBy: string | null;
  }>;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalOrders, todayOrders, totalReviews, latestOrders, latestEdits] = await Promise.all([
    prisma.order.count().catch(() => 0),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }).catch(() => 0),
    prisma.testimonial.count().catch(() => 0),
    prisma.order
      .findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          referenceNumber: true,
          customerName: true,
          customerPhone: true,
          totalPrice: true,
          createdAt: true,
        },
      })
      .catch(() => []),
    prisma.setting
      .findMany({
        orderBy: { updatedAt: 'desc' },
        take: 8,
        select: {
          key: true,
          group: true,
          updatedAt: true,
          updatedBy: { select: { name: true } },
        },
      })
      .catch(() => []),
  ]);

  return {
    totalOrders,
    todayOrders,
    totalReviews,
    latestOrders: latestOrders.map((order) => ({
      ...order,
      totalPrice: Number(order.totalPrice),
    })),
    latestEdits: latestEdits.map((edit) => ({
      key: edit.key,
      group: edit.group,
      updatedAt: edit.updatedAt,
      updatedBy: edit.updatedBy?.name ?? null,
    })),
  };
}
