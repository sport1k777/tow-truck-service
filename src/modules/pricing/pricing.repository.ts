import { prisma } from '@/lib/prisma';
import { DEFAULT_PRICING_CONFIG, type PricingConfig } from './pricing.config';
import type { PricingVehicleType } from './pricing.config';

function toNumber(value: { toString(): string } | number | null | undefined, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function loadActivePricingConfig(): Promise<PricingConfig> {
  try {
    const [rule, vehicleCategories, extraServices] = await Promise.all([
      prisma.pricingRule.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.vehicleCategory.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.extraService.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    if (!rule || vehicleCategories.length === 0) {
      return DEFAULT_PRICING_CONFIG;
    }

    const vehicleRates = vehicleCategories.reduce(
      (acc, category) => {
        acc[category.slug as PricingVehicleType] = {
          perKmRate: toNumber(category.perKmRate, 25),
          label: category.label,
          flatSurcharge: toNumber(category.flatSurcharge, 0),
        };
        return acc;
      },
      {} as PricingConfig['vehicleRates'],
    );

    const getExtra = (slug: string) => extraServices.find((item) => item.slug === slug);
    const night = getExtra('night_surcharge');
    const emergency = getExtra('emergency_dispatch');
    const difficult = getExtra('difficult_loading');
    const weekend = getExtra('weekend_surcharge');
    const holiday = getExtra('holiday_surcharge');

    const nightConfig = (() => {
      const config = (night?.config ?? {}) as Record<string, number>;
      return {
        enabled: night?.enabled ?? true,
        percent: toNumber(night?.amount, toNumber(rule.nightSurchargePercent, 20)),
        startHour: config.startHour ?? rule.nightStartHour,
        endHour: config.endHour ?? rule.nightEndHour,
        label: night?.label ?? DEFAULT_PRICING_CONFIG.additionalServices.nightSurcharge.label,
      };
    })();

    return {
      currency: 'UAH',
      currencySymbol: '₴',
      baseCallOutFee: toNumber(rule.baseFee, DEFAULT_PRICING_CONFIG.baseCallOutFee),
      outsideCityBaseFee: toNumber(
        rule.outsideCityBaseFee ?? rule.baseFee,
        DEFAULT_PRICING_CONFIG.outsideCityBaseFee,
      ),
      freeKm: toNumber(rule.freeKm, 0),
      minCharge: toNumber(rule.minCharge, DEFAULT_PRICING_CONFIG.baseCallOutFee),
      cityPerKmRate: toNumber(rule.cityPerKmRate ?? rule.perKmRate, 25),
      outsideCityPerKmRate: toNumber(rule.outsideCityPerKmRate ?? rule.perKmRate, 30),
      vehicleRates,
      additionalServices: {
        nightSurcharge: nightConfig,
        emergencyDispatch: {
          enabled: emergency?.enabled ?? true,
          flatFee: toNumber(
            emergency?.amount ?? rule.emergencySurchargeFlat,
            DEFAULT_PRICING_CONFIG.additionalServices.emergencyDispatch.flatFee,
          ),
          label: emergency?.label ?? DEFAULT_PRICING_CONFIG.additionalServices.emergencyDispatch.label,
        },
        difficultLoading: {
          enabled: difficult?.enabled ?? true,
          flatFee: toNumber(
            difficult?.amount ?? rule.difficultLoadingSurcharge,
            DEFAULT_PRICING_CONFIG.additionalServices.difficultLoading.flatFee,
          ),
          label:
            difficult?.label ?? DEFAULT_PRICING_CONFIG.additionalServices.difficultLoading.label,
        },
        weekendSurcharge: {
          enabled: weekend?.enabled ?? false,
          percent: toNumber(weekend?.amount, toNumber(rule.weekendSurchargePercent, 15)),
          label: weekend?.label ?? DEFAULT_PRICING_CONFIG.additionalServices.weekendSurcharge.label,
        },
        holidaySurcharge: {
          enabled: holiday?.enabled ?? true,
          percent: toNumber(holiday?.amount, toNumber(rule.holidaySurchargePercent, 30)),
          label: holiday?.label ?? 'Святкова доплата',
        },
      },
    };
  } catch {
    return DEFAULT_PRICING_CONFIG;
  }
}

export async function getActivePricingRuleId(): Promise<string | null> {
  const rule = await prisma.pricingRule.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' },
    select: { id: true },
  });

  return rule?.id ?? null;
}
