import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import {
  getGoogleMapsApiKey,
  MAP_DARK_STYLES,
  MAPS_ADDRESS_TYPE_RANK,
  MAPS_AUTOCOMPLETE_REQUEST_OPTIONS,
  MAPS_DEFAULT_CENTER,
  MAPS_DEFAULT_ZOOM,
  MAPS_LOADER_OPTIONS,
  MAPS_LOCATION_ZOOM,
  ROUTE_POLYLINE_OPTIONS,
} from './maps.config';
import type {
  AddressSuggestionSelection,
  GeoCoordinates,
  MapsRuntimeConfig,
  PlaceAddressComponent,
  PlaceLocation,
} from './maps.types';
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
      importLibrary('routes'),
      importLibrary('geocoding'),
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
    addressComponents: mapGeocoderAddressComponents(place.address_components),
  };
}

export function mapPlacesAddressComponents(
  components: google.maps.places.AddressComponent[] | undefined,
): PlaceAddressComponent[] {
  if (!components?.length) {
    return [];
  }

  return components.map((component) => ({
    longText: component.longText?.trim() ?? '',
    shortText: component.shortText?.trim() ?? '',
    types: [...component.types],
  }));
}

export function mapGeocoderAddressComponents(
  components: google.maps.GeocoderAddressComponent[] | undefined,
): PlaceAddressComponent[] {
  if (!components?.length) {
    return [];
  }

  return components.map((component) => ({
    longText: component.long_name?.trim() ?? '',
    shortText: component.short_name?.trim() ?? '',
    types: [...component.types],
  }));
}

export function createAutocompleteSessionToken(
  googleMaps: typeof google,
): google.maps.places.AutocompleteSessionToken {
  return new googleMaps.maps.places.AutocompleteSessionToken();
}

function rankAddressSuggestionTypes(types: string[]): number {
  if (types.length === 0) {
    return 0;
  }

  return Math.max(...types.map((type) => MAPS_ADDRESS_TYPE_RANK[type] ?? 20));
}

export async function fetchAddressSuggestions(
  googleMaps: typeof google,
  input: string,
  sessionToken: google.maps.places.AutocompleteSessionToken,
): Promise<AddressSuggestionSelection[]> {
  const trimmedInput = input.trim();
  if (trimmedInput.length < 2) {
    return [];
  }

  const { suggestions } = await googleMaps.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input: trimmedInput,
    sessionToken,
    includedRegionCodes: [...MAPS_AUTOCOMPLETE_REQUEST_OPTIONS.includedRegionCodes],
    language: MAPS_AUTOCOMPLETE_REQUEST_OPTIONS.language,
    region: MAPS_AUTOCOMPLETE_REQUEST_OPTIONS.region,
  });

  const mapped = suggestions.flatMap((suggestion) => {
    const placePrediction = suggestion.placePrediction;
    if (!placePrediction) {
      return [];
    }

    const mainText = placePrediction.mainText?.text?.trim() ?? '';
    const secondaryText = placePrediction.secondaryText?.text?.trim() ?? '';
    const description = placePrediction.text?.text?.trim() || [mainText, secondaryText].filter(Boolean).join(', ');

    if (!description) {
      return [];
    }

    return [
      {
        suggestion: {
          placeId: placePrediction.placeId,
          description,
          mainText: mainText || description,
          secondaryText,
        },
        placePrediction,
      },
    ];
  });

  return mapped.sort(
    (a, b) =>
      rankAddressSuggestionTypes(b.placePrediction.types) -
      rankAddressSuggestionTypes(a.placePrediction.types),
  );
}

export async function resolvePlaceFromSuggestion(
  placePrediction: google.maps.places.PlacePrediction,
): Promise<PlaceLocation | null> {
  const place = placePrediction.toPlace();
  await place.fetchFields({
    fields: ['id', 'formattedAddress', 'displayName', 'location', 'addressComponents'],
  });

  const address = place.formattedAddress?.trim() || place.displayName?.trim();
  if (!address) {
    return null;
  }

  const location = place.location;

  return {
    address,
    placeId: place.id ?? null,
    location: location ? { lat: location.lat(), lng: location.lng() } : null,
    addressComponents: mapPlacesAddressComponents(place.addressComponents),
  };
}

export function createRoutePolylines(
  routesRoute: google.maps.routes.Route,
): google.maps.Polyline[] {
  return routesRoute.createPolylines({
    polylineOptions: ROUTE_POLYLINE_OPTIONS,
  });
}

export function renderRouteOnMap(
  map: google.maps.Map,
  routesRoute: google.maps.routes.Route,
): google.maps.Polyline[] {
  const polylines = createRoutePolylines(routesRoute);
  polylines.forEach((polyline) => polyline.setMap(map));
  return polylines;
}

export function clearRoutePolylinesFromMap(polylines: google.maps.Polyline[]): void {
  polylines.forEach((polyline) => polyline.setMap(null));
}

export function fitMapToRouteViewport(
  map: google.maps.Map,
  routesRoute: google.maps.routes.Route,
  padding = 56,
): void {
  const viewport = routesRoute.viewport;
  if (viewport) {
    map.fitBounds(viewport, padding);
  }
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

export function fitMapToBounds(
  map: google.maps.Map,
  bounds: google.maps.LatLngBounds,
  padding = 56,
): void {
  map.fitBounds(bounds, padding);
}

export function getBrowserGeolocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GEOLOCATION_UNSUPPORTED'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 0,
    });
  });
}

export async function reverseGeocodeCoordinates(
  googleMaps: typeof google,
  coordinates: GeoCoordinates,
): Promise<PlaceLocation | null> {
  await googleMaps.maps.importLibrary('geocoding');

  const geocoder = new googleMaps.maps.Geocoder();
  const response = await geocoder.geocode({ location: coordinates });
  const result = response.results[0];
  const address = result?.formatted_address?.trim();

  if (!address) {
    return null;
  }

  return {
    address,
    placeId: result.place_id ?? null,
    location: coordinates,
    addressComponents: mapGeocoderAddressComponents(result.address_components),
  };
}

export function centerMapOnLocation(
  map: google.maps.Map,
  location: GeoCoordinates,
  zoom = MAPS_LOCATION_ZOOM,
): void {
  map.setCenter(location);
  map.setZoom(zoom);
}
