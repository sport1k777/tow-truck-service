import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { loadActivePricingConfig } from './pricing.repository';
import { calculatePrice } from './pricing.engine';
import type { PriceCalculationResult, PricingInput } from './pricing.types';
import type { PricingConfig } from './pricing.config';
import { DEFAULT_PRICING_CONFIG } from './pricing.config';

const CACHE_TAG = 'pricing-config';

async function isHoliday(date: Date): Promise<boolean> {
  try {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    const holidays = await prisma.holiday.findMany({
      where: {
        OR: [
          {
            date: {
              gte: new Date(Date.UTC(date.getUTCFullYear(), month - 1, day)),
              lt: new Date(Date.UTC(date.getUTCFullYear(), month - 1, day + 1)),
            },
          },
          { isRecurring: true },
        ],
      },
    });

    return holidays.some((holiday) => {
      const hDate = new Date(holiday.date);
      if (holiday.isRecurring) {
        return hDate.getUTCMonth() + 1 === month && hDate.getUTCDate() === day;
      }
      return true;
    });
  } catch {
    return false;
  }
}

const getCachedPricingConfig = unstable_cache(loadActivePricingConfig, [CACHE_TAG], {
  revalidate: 60,
  tags: [CACHE_TAG],
});

export const PricingService = {
  async getConfig(): Promise<PricingConfig> {
    try {
      return await getCachedPricingConfig();
    } catch {
      return DEFAULT_PRICING_CONFIG;
    }
  },

  async calculate(input: PricingInput): Promise<PriceCalculationResult> {
    const config = await this.getConfig();
    const enrichedInput: PricingInput = {
      ...input,
      isHoliday: input.isHoliday ?? (await isHoliday(input.timestamp)),
    };
    return calculatePrice(enrichedInput, config);
  },
};

export function revalidatePricingCache() {
  return CACHE_TAG;
}
