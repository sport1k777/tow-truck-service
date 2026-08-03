import {
  DEFAULT_PRICING_CONFIG,
  getCalculatorVehicleOptions,
  PRICING_VEHICLE_TYPES,
} from '@/modules/pricing/pricing.config';
import { calculatePrice } from '@/modules/pricing/pricing.engine';
import type { PriceCalculationResult } from '@/modules/pricing/pricing.types';
import type { RouteCalculationResponse } from '@/modules/maps/maps.types';
import type { CalculatorFormState, CalculatorResult } from './calculator.types';

export const VEHICLE_TYPE_OPTIONS = getCalculatorVehicleOptions();

export const CALCULATOR_DEFAULTS = {
  currency: DEFAULT_PRICING_CONFIG.currency,
  currencySymbol: DEFAULT_PRICING_CONFIG.currencySymbol,
} as const;

export function calculateLivePrice(
  form: CalculatorFormState,
  distanceKm: number | null,
): PriceCalculationResult | null {
  if (distanceKm === null || distanceKm <= 0) {
    return null;
  }

  return calculatePrice(
    {
      distanceKm,
      vehicleType: form.vehicleType,
      timestamp: new Date(),
      isEmergencyDispatch: form.isEmergencyDispatch,
      isDifficultLoading: form.isDifficultLoading,
    },
    DEFAULT_PRICING_CONFIG,
  );
}

export async function calculateCalculatorQuote(
  form: CalculatorFormState,
  price: PriceCalculationResult,
  route: RouteCalculationResponse,
): Promise<CalculatorResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    route: {
      distanceKm: route.route.distanceKm,
      durationMinutes: route.route.durationMinutes,
      polyline: route.route.polyline,
    },
    price,
    availability: {
      isAvailable: true,
      message: 'Послуга доступна у вашій зоні',
      areaName: 'Київ та область',
    },
    calculatedAt: new Date().toISOString(),
  };
}

export { PRICING_VEHICLE_TYPES };
