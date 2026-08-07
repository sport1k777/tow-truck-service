import { PRICING_VEHICLE_TYPES, type PricingVehicleType } from '@/modules/pricing/pricing.config';
import type { GeoCoordinates, PlaceAddressComponent } from '@/modules/maps/maps.types';
import type { CalculatorFormState } from './calculator.types';

const CALCULATOR_FORM_STORAGE_KEY = 'tow-truck:calculator-form';

export interface StoredCalculatorForm {
  pickupAddress: string;
  destinationAddress: string;
  pickupPlaceId: string | null;
  pickupLocation: GeoCoordinates | null;
  pickupAddressComponents: PlaceAddressComponent[] | null;
  destinationPlaceId: string | null;
  destinationLocation: GeoCoordinates | null;
  destinationAddressComponents: PlaceAddressComponent[] | null;
  vehicleType: PricingVehicleType;
  isEmergencyDispatch: boolean;
  isDifficultLoading: boolean;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function isValidVehicleType(value: unknown): value is PricingVehicleType {
  return (
    typeof value === 'string' &&
    Object.values(PRICING_VEHICLE_TYPES).includes(value as PricingVehicleType)
  );
}

function isValidCoordinates(value: unknown): value is GeoCoordinates {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const coordinates = value as GeoCoordinates;
  return typeof coordinates.lat === 'number' && typeof coordinates.lng === 'number';
}

function isValidAddressComponents(value: unknown): value is PlaceAddressComponent[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every(
    (component) =>
      component &&
      typeof component === 'object' &&
      typeof component.longText === 'string' &&
      typeof component.shortText === 'string' &&
      Array.isArray(component.types),
  );
}

function parseStoredCalculatorForm(raw: unknown): StoredCalculatorForm | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const parsed = raw as Partial<StoredCalculatorForm>;

  if (typeof parsed.pickupAddress !== 'string' || typeof parsed.destinationAddress !== 'string') {
    return null;
  }

  if (!isValidVehicleType(parsed.vehicleType)) {
    return null;
  }

  return {
    pickupAddress: parsed.pickupAddress,
    destinationAddress: parsed.destinationAddress,
    pickupPlaceId: typeof parsed.pickupPlaceId === 'string' ? parsed.pickupPlaceId : null,
    pickupLocation: isValidCoordinates(parsed.pickupLocation) ? parsed.pickupLocation : null,
    pickupAddressComponents: isValidAddressComponents(parsed.pickupAddressComponents)
      ? parsed.pickupAddressComponents
      : null,
    destinationPlaceId:
      typeof parsed.destinationPlaceId === 'string' ? parsed.destinationPlaceId : null,
    destinationLocation: isValidCoordinates(parsed.destinationLocation)
      ? parsed.destinationLocation
      : null,
    destinationAddressComponents: isValidAddressComponents(parsed.destinationAddressComponents)
      ? parsed.destinationAddressComponents
      : null,
    vehicleType: parsed.vehicleType,
    isEmergencyDispatch: Boolean(parsed.isEmergencyDispatch),
    isDifficultLoading: Boolean(parsed.isDifficultLoading),
  };
}

export function loadStoredCalculatorForm(): StoredCalculatorForm | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(CALCULATOR_FORM_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return parseStoredCalculatorForm(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function persistCalculatorForm(form: CalculatorFormState): void {
  if (!isBrowser()) {
    return;
  }

  const payload: StoredCalculatorForm = {
    pickupAddress: form.pickupAddress,
    destinationAddress: form.destinationAddress,
    pickupPlaceId: form.pickupPlaceId,
    pickupLocation: form.pickupLocation,
    pickupAddressComponents: form.pickupAddressComponents,
    destinationPlaceId: form.destinationPlaceId,
    destinationLocation: form.destinationLocation,
    destinationAddressComponents: form.destinationAddressComponents,
    vehicleType: form.vehicleType,
    isEmergencyDispatch: form.isEmergencyDispatch,
    isDifficultLoading: form.isDifficultLoading,
  };

  try {
    localStorage.setItem(CALCULATOR_FORM_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function storedCalculatorFormToState(stored: StoredCalculatorForm): CalculatorFormState {
  return {
    ...stored,
    comments: '',
  };
}
