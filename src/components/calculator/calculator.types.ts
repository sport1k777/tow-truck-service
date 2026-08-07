import type { PricingVehicleType } from '@/modules/pricing/pricing.config';
import type { PriceCalculationResult } from '@/modules/pricing/pricing.types';
import type { GeoCoordinates, PlaceAddressComponent } from '@/modules/maps/maps.types';

/** Form state — maps 1:1 to future CreateOrderInput / CalculatePriceInput */
export interface CalculatorFormState {
  pickupAddress: string;
  pickupPlaceId: string | null;
  pickupLocation: GeoCoordinates | null;
  pickupAddressComponents: PlaceAddressComponent[] | null;
  destinationAddress: string;
  destinationPlaceId: string | null;
  destinationLocation: GeoCoordinates | null;
  destinationAddressComponents: PlaceAddressComponent[] | null;
  vehicleType: PricingVehicleType;
  isEmergencyDispatch: boolean;
  isDifficultLoading: boolean;
  comments: string;
}

export interface CalculatorRoutePreview {
  distanceKm: number;
  durationMinutes: number;
  polyline: string | null;
}

export interface CalculatorServiceAvailability {
  isAvailable: boolean;
  message: string;
  areaName?: string;
}

export interface CalculatorResult {
  route: CalculatorRoutePreview;
  price: PriceCalculationResult;
  availability: CalculatorServiceAvailability;
  calculatedAt: string;
}

export type CalculatorStatus = 'idle' | 'calculating' | 'success' | 'error';

export interface CalculatorFormErrors {
  pickupAddress?: string;
  destinationAddress?: string;
  route?: string;
  serviceArea?: string;
}
