import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import {
  getGoogleMapsApiKey,
  MAP_DARK_STYLES,
  MAPS_AUTOCOMPLETE_OPTIONS,
  MAPS_DEFAULT_CENTER,
  MAPS_DEFAULT_ZOOM,
  MAPS_LOADER_OPTIONS,
  ROUTE_POLYLINE_OPTIONS,
} from './maps.config';
import type { MapsRuntimeConfig, PlaceLocation } from './maps.types';
import { DEFAULT_MAPS_CONFIG } from '@/lib/locale.defaults';

let googleMapsPromise: Promise<typeof google> | null = null;

export function resetGoogleMapsLoaderForTests(): void {
  googleMapsPromise = null;
}

export async function loadGoogleMapsApi(): Promise<typeof google> {
  if (typeof window === 'undefined') {
    throw new Error('Google Maps can only load in the browser');
  }

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_NOT_CONFIGURED');
  }

  if (!googleMapsPromise) {
    setOptions({
      key: apiKey,
      v: MAPS_LOADER_OPTIONS.version,
      language: MAPS_LOADER_OPTIONS.language,
      region: MAPS_LOADER_OPTIONS.region,
      libraries: [...MAPS_LOADER_OPTIONS.libraries],
    });

    googleMapsPromise = Promise.all([
      importLibrary('maps'),
      importLibrary('places'),
      importLibrary('geometry'),
    ]).then(() => google);
  }

  return googleMapsPromise;
}

export function getClientMapsConfig(): MapsRuntimeConfig {
  return {
    center: MAPS_DEFAULT_CENTER,
    zoom: MAPS_DEFAULT_ZOOM,
    region: DEFAULT_MAPS_CONFIG.region,
    language: DEFAULT_MAPS_CONFIG.language,
    countryRestriction: DEFAULT_MAPS_CONFIG.componentRestrictions.country,
  };
}

export function parsePlaceFromAutocomplete(
  place: google.maps.places.PlaceResult,
): PlaceLocation | null {
  const address = place.formatted_address?.trim() || place.name?.trim();
  const location = place.geometry?.location;

  if (!address) {
    return null;
  }

  return {
    address,
    placeId: place.place_id ?? null,
    location: location ? { lat: location.lat(), lng: location.lng() } : null,
  };
}

export function createPlaceAutocomplete(
  googleMaps: typeof google,
  input: HTMLInputElement,
): google.maps.places.Autocomplete {
  return new googleMaps.maps.places.Autocomplete(input, {
    componentRestrictions: MAPS_AUTOCOMPLETE_OPTIONS.componentRestrictions,
    fields: [...MAPS_AUTOCOMPLETE_OPTIONS.fields],
  });
}

export function createDirectionsService(
  googleMaps: typeof google,
): google.maps.DirectionsService {
  return new googleMaps.maps.DirectionsService();
}

export function createStyledMap(
  googleMaps: typeof google,
  container: HTMLElement,
  config: MapsRuntimeConfig = getClientMapsConfig(),
): google.maps.Map {
  return new googleMaps.maps.Map(container, {
    center: config.center,
    zoom: config.zoom,
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    clickableIcons: false,
    backgroundColor: '#030712',
    styles: MAP_DARK_STYLES,
  });
}

export function createRouteDirectionsRenderer(
  googleMaps: typeof google,
  map: google.maps.Map,
): google.maps.DirectionsRenderer {
  return new googleMaps.maps.DirectionsRenderer({
    map,
    suppressPolylines: false,
    polylineOptions: ROUTE_POLYLINE_OPTIONS,
    markerOptions: {
      opacity: 0.95,
    },
  });
}

export function renderDirectionsOnMap(
  renderer: google.maps.DirectionsRenderer,
  directionsResult: google.maps.DirectionsResult,
): void {
  renderer.setDirections(directionsResult);
}

export function clearDirectionsFromMap(renderer: google.maps.DirectionsRenderer): void {
  renderer.setDirections(null);
}

export function fitMapToBounds(
  map: google.maps.Map,
  bounds: google.maps.LatLngBounds,
  padding = 56,
): void {
  map.fitBounds(bounds, padding);
}
