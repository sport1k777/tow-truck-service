import { PRICING_SURCHARGE_TYPES, VEHICLE_TYPES } from '@/lib/constants';

export type { VehicleType } from '@/lib/constants';

export interface PricingInput {
  distanceKm: number;
  vehicleType: keyof typeof VEHICLE_TYPES;
  timestamp: Date;
  isDifficultLoading?: boolean;
}

export interface PriceBreakdownItem {
  label: string;
  amount: number;
  type: 'base' | 'distance' | 'surcharge';
  surchargeType?: keyof typeof PRICING_SURCHARGE_TYPES;
}

export interface PriceCalculationResult {
  total: number;
  currency: string;
  distanceKm: number;
  breakdown: PriceBreakdownItem[];
}

export interface PricingRuleConfig {
  id: string;
  name: string;
  baseFee: number;
  perKmRate: number;
  minCharge: number;
  isActive: boolean;
  vehicleTypeSurcharges: Record<string, number>;
  nightSurchargePercent: number;
  nightStartHour: number;
  nightEndHour: number;
  weekendSurchargePercent: number;
  holidaySurchargePercent: number;
  difficultLoadingSurcharge: number;
}
