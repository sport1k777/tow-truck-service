import { prisma } from '@/lib/prisma';

export interface AnalyticsSummary {
  totalCalculations: number;
  totalOrders: number;
  conversionRate: number;
  calculationsLast7Days: number;
  ordersLast7Days: number;
  popularRoutes: Array<{
    pickupAddress: string;
    destinationAddress: string;
    count: number;
  }>;
}

function normalizeRouteKey(pickup: string, destination: string): string {
  return `${pickup.trim().toLowerCase()}→${destination.trim().toLowerCase()}`;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalCalculations, totalOrders, calculationsLast7Days, ordersLast7Days, recentEvents] =
    await Promise.all([
      prisma.calculationEvent.count().catch(() => 0),
      prisma.order.count().catch(() => 0),
      prisma.calculationEvent
        .count({ where: { createdAt: { gte: sevenDaysAgo } } })
        .catch(() => 0),
      prisma.order.count({ where: { createdAt: { gte: sevenDaysAgo } } }).catch(() => 0),
      prisma.calculationEvent
        .findMany({
          orderBy: { createdAt: 'desc' },
          take: 500,
          select: { pickupAddress: true, destinationAddress: true },
        })
        .catch(() => []),
    ]);

  const routeCounts = new Map<string, { pickup: string; destination: string; count: number }>();

  for (const event of recentEvents) {
    const key = normalizeRouteKey(event.pickupAddress, event.destinationAddress);
    const existing = routeCounts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      routeCounts.set(key, {
        pickup: event.pickupAddress,
        destination: event.destinationAddress,
        count: 1,
      });
    }
  }

  const popularRoutes = [...routeCounts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(({ pickup, destination, count }) => ({
      pickupAddress: pickup,
      destinationAddress: destination,
      count,
    }));

  const conversionRate =
    totalCalculations > 0 ? Math.round((totalOrders / totalCalculations) * 1000) / 10 : 0;

  return {
    totalCalculations,
    totalOrders,
    conversionRate,
    calculationsLast7Days,
    ordersLast7Days,
    popularRoutes,
  };
}

export async function recordCalculationEvent(data: {
  pickupAddress: string;
  destinationAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  distanceKm: number;
  estimatedPrice: number;
  vehicleType: string;
}) {
  try {
    await prisma.calculationEvent.create({
      data: {
        pickupAddress: data.pickupAddress,
        destinationAddress: data.destinationAddress,
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        destinationLat: data.destinationLat,
        destinationLng: data.destinationLng,
        distanceKm: data.distanceKm,
        estimatedPrice: data.estimatedPrice,
        vehicleType: data.vehicleType,
      },
    });
  } catch {
    // Analytics must never block the calculator
  }
}
