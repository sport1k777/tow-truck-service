/**
 * Public service interface for the Pricing module.
 * Phase 8: load rules from database, apply caching.
 */

import { getDefaultPricingConfig } from './pricing.config';
import { calculatePrice } from './pricing.engine';
import type { PriceCalculationResult, PricingInput } from './pricing.types';

export const PricingService = {
  async calculate(input: PricingInput): Promise<PriceCalculationResult> {
    return calculatePrice(input, getDefaultPricingConfig());
  },
};
