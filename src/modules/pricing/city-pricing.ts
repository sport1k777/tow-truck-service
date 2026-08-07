import { haversineKm } from '@/modules/maps/geo';

export interface CityPricingConfig {
  homeCenterLat: number;
  homeCenterLng: number;
  cityServiceRadiusKm: number;
  freeCityRadiusKm: number;
}

export function isPointWithinRadius(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  radiusKm: number,
): boolean {
  if (radiusKm <= 0) return true;
  return haversineKm(lat, lng, centerLat, centerLng) <= radiusKm;
}

/** Outside-city rates apply when either endpoint is beyond the city service radius. */
export function isRouteOutsideCity(
  pickup: { lat: number; lng: number } | null | undefined,
  destination: { lat: number; lng: number } | null | undefined,
  config: CityPricingConfig,
): boolean {
  if (!pickup || !destination || config.cityServiceRadiusKm <= 0) {
    return false;
  }

  const pickupInCity = isPointWithinRadius(
    pickup.lat,
    pickup.lng,
    config.homeCenterLat,
    config.homeCenterLng,
    config.cityServiceRadiusKm,
  );
  const destinationInCity = isPointWithinRadius(
    destination.lat,
    destination.lng,
    config.homeCenterLat,
    config.homeCenterLng,
    config.cityServiceRadiusKm,
  );

  return !pickupInCity || !destinationInCity;
}

/** When both endpoints are inside the free city radius, waive the full route distance. */
export function effectiveFreeKm(
  distanceKm: number,
  pickup: { lat: number; lng: number } | null | undefined,
  destination: { lat: number; lng: number } | null | undefined,
  config: CityPricingConfig,
  pricingFreeKm: number,
): number {
  if (
    pickup &&
    destination &&
    config.freeCityRadiusKm > 0 &&
    isPointWithinRadius(pickup.lat, pickup.lng, config.homeCenterLat, config.homeCenterLng, config.freeCityRadiusKm) &&
    isPointWithinRadius(
      destination.lat,
      destination.lng,
      config.homeCenterLat,
      config.homeCenterLng,
      config.freeCityRadiusKm,
    )
  ) {
    return distanceKm;
  }

  return pricingFreeKm;
}
