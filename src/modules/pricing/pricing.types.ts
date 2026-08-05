import { PRICING_SURCHARGE_TYPES } from '@/lib/constants';
import type { PricingVehicleType } from './pricing.config';

export type { PricingVehicleType } from './pricing.config';

export interface PricingInput {
  distanceKm: number;
  vehicleType: PricingVehicleType;
  timestamp: Date;
  isDifficultLoading?: boolean;
  isEmergencyDispatch?: boolean;
  isHoliday?: boolean;
  isOutsideCity?: boolean;
}

export interface PriceBreakdownItem {
  label: string;
  amount: number;
  type: 'base' | 'distance' | 'surcharge' | 'total';
  surchargeType?: keyof typeof PRICING_SURCHARGE_TYPES;
}

export interface PriceCalculationResult {
  total: number;
  currency: string;
  currencySymbol: string;
  distanceKm: number;
  breakdown: PriceBreakdownItem[];
}
