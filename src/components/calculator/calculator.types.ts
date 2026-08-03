import type { VehicleType } from '@/lib/constants';

/** Form state — maps 1:1 to future CreateOrderInput / CalculatePriceInput */
export interface CalculatorFormState {
  pickupAddress: string;
  destinationAddress: string;
  vehicleType: VehicleType;
  comments: string;
}

/** Future: populated by Google Directions API via /api/v1/maps/directions */
export interface CalculatorRoutePreview {
  distanceKm: number;
  durationMinutes: number;
  polyline: string | null;
}

/** Future: populated by validateServiceArea Server Action */
export interface CalculatorServiceAvailability {
  isAvailable: boolean;
  message: string;
  areaName?: string;
}

/** Future: populated by calculatePrice Server Action */
export interface CalculatorPriceResult {
  total: number;
  currency: string;
  breakdown: Array<{
    label: string;
    amount: number;
  }>;
}

export interface CalculatorResult {
  route: CalculatorRoutePreview;
  price: CalculatorPriceResult;
  availability: CalculatorServiceAvailability;
  calculatedAt: string;
}

export type CalculatorStatus = 'idle' | 'calculating' | 'success' | 'error';

export interface CalculatorFormErrors {
  pickupAddress?: string;
  destinationAddress?: string;
}
