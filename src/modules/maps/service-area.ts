import type { PlaceAddressComponent } from './maps.types';

export const SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE =
  'Послуги евакуатора доступні лише для маршрутів, де місце завантаження або місце доставки знаходиться в Рівненській області.';

export const SERVICE_AREA_AVAILABLE_MESSAGE = 'Послуга доступна у вашій зоні';
export const SERVICE_AREA_NAME = 'Рівненська область';

const ADMINISTRATIVE_AREA_LEVEL_1 = 'administrative_area_level_1';

function normalizeAdministrativeAreaName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[''`ʼ]/g, '')
    .replace(/\./g, '')
    .replace(/\s+/g, ' ');
}

const RIVNE_OBLAST_ADMIN_AREA_NAMES = new Set(['рівненська область', 'rivne oblast']);

function isRivneOblastAdministrativeArea(name: string): boolean {
  return RIVNE_OBLAST_ADMIN_AREA_NAMES.has(normalizeAdministrativeAreaName(name));
}

export function isInRivneOblast(components: PlaceAddressComponent[]): boolean {
  return components.some((component) => {
    if (!component.types.includes(ADMINISTRATIVE_AREA_LEVEL_1)) {
      return false;
    }

    return [component.longText, component.shortText]
      .filter(Boolean)
      .some(isRivneOblastAdministrativeArea);
  });
}

export function isRouteWithinServiceArea(
  pickupComponents: PlaceAddressComponent[] | null | undefined,
  destinationComponents: PlaceAddressComponent[] | null | undefined,
): boolean {
  const pickupInArea = pickupComponents?.length ? isInRivneOblast(pickupComponents) : false;
  const destinationInArea = destinationComponents?.length
    ? isInRivneOblast(destinationComponents)
    : false;

  return pickupInArea || destinationInArea;
}

export function canValidateServiceArea(
  pickupPlaceId: string | null,
  destinationPlaceId: string | null,
  pickupComponents: PlaceAddressComponent[] | null | undefined,
  destinationComponents: PlaceAddressComponent[] | null | undefined,
): boolean {
  return Boolean(
    pickupPlaceId &&
      destinationPlaceId &&
      pickupComponents?.length &&
      destinationComponents?.length,
  );
}

export interface ServiceAreaValidationResult {
  status: 'pending' | 'valid' | 'invalid';
  isBlocked: boolean;
  message: string | null;
}

export function validateServiceAreaRoute(options: {
  pickupPlaceId: string | null;
  destinationPlaceId: string | null;
  pickupComponents: PlaceAddressComponent[] | null | undefined;
  destinationComponents: PlaceAddressComponent[] | null | undefined;
}): ServiceAreaValidationResult {
  if (!canValidateServiceArea(
    options.pickupPlaceId,
    options.destinationPlaceId,
    options.pickupComponents,
    options.destinationComponents,
  )) {
    return { status: 'pending', isBlocked: false, message: null };
  }

  if (
    isRouteWithinServiceArea(options.pickupComponents, options.destinationComponents)
  ) {
    return { status: 'valid', isBlocked: false, message: null };
  }

  return {
    status: 'invalid',
    isBlocked: true,
    message: SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE,
  };
}
