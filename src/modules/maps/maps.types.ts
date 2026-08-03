export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  polyline: string;
  bounds: {
    northeast: GeoCoordinates;
    southwest: GeoCoordinates;
  };
}

export interface AddressSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface MapsConfig {
  center: GeoCoordinates;
  zoom: number;
  region: string;
  language: string;
  countryRestriction: string;
}
