export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface GeoBounds {
  northeast: GeoCoordinates;
  southwest: GeoCoordinates;
}

/** Structured address component from Google Place or Geocoder results. */
export interface PlaceAddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}

/** Selected place from Places Autocomplete — reusable for order creation. */
export interface PlaceLocation {
  address: string;
  placeId: string | null;
  location: GeoCoordinates | null;
  addressComponents: PlaceAddressComponent[];
}

export interface RouteWaypoint {
  address: string;
  placeId: string | null;
  location: GeoCoordinates | null;
}

export interface RouteCalculationRequest {
  origin: RouteWaypoint;
  destination: RouteWaypoint;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  polyline: string;
  bounds: GeoBounds;
  origin: RouteWaypoint;
  destination: RouteWaypoint;
}

/** Full route payload for map rendering and future driver tracking / ETA. */
export interface RouteCalculationResponse {
  route: RouteResult;
  /** Routes API route object — client-only, for map rendering. */
  routesRoute: google.maps.routes.Route;
}

export interface AddressSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

/** Places API (New) prediction handle — resolved to PlaceLocation on selection. */
export interface AddressSuggestionSelection {
  suggestion: AddressSuggestion;
  placePrediction: google.maps.places.PlacePrediction;
}

export interface MapsRuntimeConfig {
  center: GeoCoordinates;
  zoom: number;
  region: string;
  language: string;
  countryRestriction: string;
}

/** Future: live driver position and ETA updates. */
export interface LiveTrackingState {
  driverLocation: GeoCoordinates | null;
  etaMinutes: number | null;
  updatedAt: string | null;
}

export type MapsLoadStatus = 'idle' | 'loading' | 'ready' | 'error' | 'unconfigured';

export interface MapsProviderState {
  status: MapsLoadStatus;
  google: typeof google | null;
  error: string | null;
  isConfigured: boolean;
}
