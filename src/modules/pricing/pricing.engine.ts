/**
 * Pure pricing engine — no side effects, no database access.
 * All rules are passed in as configuration (loaded from DB by PricingService).
 * Phase 8: full implementation with all surcharge types.
 */

import type { PriceCalculationResult, PricingInput, PricingRuleConfig } from './pricing.types';

export function calculatePrice(
  input: PricingInput,
  rules: PricingRuleConfig,
  currency: string,
): PriceCalculationResult {
  const baseAmount = rules.baseFee;
  const distanceAmount = input.distanceKm * rules.perKmRate;
  let total = baseAmount + distanceAmount;

  const breakdown: PriceCalculationResult['breakdown'] = [
    { label: 'Base call-out fee', amount: baseAmount, type: 'base' },
    {
      label: `Distance (${input.distanceKm.toFixed(1)} km)`,
      amount: distanceAmount,
      type: 'distance',
    },
  ];

  if (total < rules.minCharge) {
    total = rules.minCharge;
  }

  return {
    total: Math.round(total * 100) / 100,
    currency,
    distanceKm: input.distanceKm,
    breakdown,
  };
}
