/**
 * Public service interface for the Pricing module.
 * Phase 8: load rules from database, apply caching.
 */

import { SettingsService } from '@/modules/settings/settings.service';
import { calculatePrice } from './pricing.engine';
import type { PriceCalculationResult, PricingInput } from './pricing.types';

export const PricingService = {
  async calculate(input: PricingInput): Promise<PriceCalculationResult> {
    const settings = await SettingsService.getBusinessSettings();

    // Phase 8: load active PricingRule from database
    const placeholderRules = {
      id: 'default',
      name: 'Default',
      baseFee: 0,
      perKmRate: 0,
      minCharge: 0,
      isActive: true,
      vehicleTypeSurcharges: {},
      nightSurchargePercent: 0,
      nightStartHour: 22,
      nightEndHour: 6,
      weekendSurchargePercent: 0,
      holidaySurchargePercent: 0,
      difficultLoadingSurcharge: 0,
    };

    return calculatePrice(input, placeholderRules, settings.currency);
  },
};
