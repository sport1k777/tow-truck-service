import {
  DEFAULT_PRICING_CONFIG,
  getCalculatorVehicleOptions,
  PRICING_VEHICLE_TYPES,
  type PricingConfig,
} from '@/modules/pricing/pricing.config';
import { calculatePrice } from '@/modules/pricing/pricing.engine';
import type { PriceCalculationResult } from '@/modules/pricing/pricing.types';
import type { RouteCalculationResponse } from '@/modules/maps/maps.types';
import {
  isRouteWithinServiceArea,
  SERVICE_AREA_AVAILABLE_MESSAGE,
  SERVICE_AREA_NAME,
  SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE,
} from '@/modules/maps/service-area';
import type { CalculatorFormState, CalculatorResult } from './calculator.types';

export const VEHICLE_TYPE_OPTIONS = getCalculatorVehicleOptions();

export const CALCULATOR_DEFAULTS = {
  currency: DEFAULT_PRICING_CONFIG.currency,
  currencySymbol: DEFAULT_PRICING_CONFIG.currencySymbol,
} as const;

export function calculateLivePrice(
  form: CalculatorFormState,
  distanceKm: number | null,
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
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
    config,
  );
}

export async function calculateCalculatorQuote(
  form: CalculatorFormState,
  price: PriceCalculationResult,
  route: RouteCalculationResponse,
  serviceAreaConfig?: {
    allowedRegions?: string[];
    outOfCoverageMessage?: string;
    availableMessage?: string;
    areaName?: string;
  },
): Promise<CalculatorResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const allowedRegions = serviceAreaConfig?.allowedRegions;
  const isAvailable = isRouteWithinServiceArea(
    form.pickupAddressComponents,
    form.destinationAddressComponents,
    allowedRegions,
  );

  return {
    route: {
      distanceKm: route.route.distanceKm,
      durationMinutes: route.route.durationMinutes,
      polyline: route.route.polyline,
    },
    price,
    availability: {
      isAvailable,
      message: isAvailable
        ? (serviceAreaConfig?.availableMessage ?? SERVICE_AREA_AVAILABLE_MESSAGE)
        : (serviceAreaConfig?.outOfCoverageMessage ?? SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE),
      areaName: isAvailable ? (serviceAreaConfig?.areaName ?? SERVICE_AREA_NAME) : undefined,
    },
    calculatedAt: new Date().toISOString(),
  };
}

export { PRICING_VEHICLE_TYPES };
