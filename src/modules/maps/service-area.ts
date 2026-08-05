import type { PlaceAddressComponent } from './maps.types';
import {
  SERVICE_AREA_AVAILABLE_MESSAGE,
  SERVICE_AREA_NAME,
  SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE,
} from './service-area.constants';

export {
  SERVICE_AREA_AVAILABLE_MESSAGE,
  SERVICE_AREA_NAME,
  SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE,
};

export interface ServiceAreaValidationConfig {
  allowedRegions?: string[];
  outOfCoverageMessage?: string;
  availableMessage?: string;
  areaName?: string;
}

const DEFAULT_ALLOWED_REGIONS = ['рівненська область', 'rivne oblast'];

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

function isAllowedAdministrativeArea(name: string, allowedRegions: string[]): boolean {
  const normalized = normalizeAdministrativeAreaName(name);
  const allowed = new Set(allowedRegions.map(normalizeAdministrativeAreaName));
  return allowed.has(normalized);
}

export function isInServiceArea(
  components: PlaceAddressComponent[],
  allowedRegions: string[] = DEFAULT_ALLOWED_REGIONS,
): boolean {
  return components.some((component) => {
    if (!component.types.includes(ADMINISTRATIVE_AREA_LEVEL_1)) {
      return false;
    }

    return [component.longText, component.shortText]
      .filter(Boolean)
      .some((name) => isAllowedAdministrativeArea(name!, allowedRegions));
  });
}

/** @deprecated Use isInServiceArea */
export function isInRivneOblast(components: PlaceAddressComponent[]): boolean {
  return isInServiceArea(components);
}

export function isRouteWithinServiceArea(
  pickupComponents: PlaceAddressComponent[] | null | undefined,
  destinationComponents: PlaceAddressComponent[] | null | undefined,
  allowedRegions: string[] = DEFAULT_ALLOWED_REGIONS,
): boolean {
  const pickupInArea = pickupComponents?.length
    ? isInServiceArea(pickupComponents, allowedRegions)
    : false;
  const destinationInArea = destinationComponents?.length
    ? isInServiceArea(destinationComponents, allowedRegions)
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

export function validateServiceAreaRoute(
  options: {
    pickupPlaceId: string | null;
    destinationPlaceId: string | null;
    pickupComponents: PlaceAddressComponent[] | null | undefined;
    destinationComponents: PlaceAddressComponent[] | null | undefined;
  },
  config?: ServiceAreaValidationConfig,
): ServiceAreaValidationResult {
  const allowedRegions = config?.allowedRegions ?? DEFAULT_ALLOWED_REGIONS;
  const outOfCoverageMessage =
    config?.outOfCoverageMessage ?? SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE;

  if (
    !canValidateServiceArea(
      options.pickupPlaceId,
      options.destinationPlaceId,
      options.pickupComponents,
      options.destinationComponents,
    )
  ) {
    return { status: 'pending', isBlocked: false, message: null };
  }

  if (
    isRouteWithinServiceArea(
      options.pickupComponents,
      options.destinationComponents,
      allowedRegions,
    )
  ) {
    return { status: 'valid', isBlocked: false, message: null };
  }

  return {
    status: 'invalid',
    isBlocked: true,
    message: outOfCoverageMessage,
  };
}
