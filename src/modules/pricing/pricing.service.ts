import { unstable_cache } from 'next/cache';
import { loadActivePricingConfig } from './pricing.repository';
import { calculatePrice } from './pricing.engine';
import type { PriceCalculationResult, PricingInput } from './pricing.types';
import type { PricingConfig } from './pricing.config';
import { DEFAULT_PRICING_CONFIG } from './pricing.config';

const CACHE_TAG = 'pricing-config';

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
    return calculatePrice(input, config);
  },
};

export function revalidatePricingCache() {
  return CACHE_TAG;
}
