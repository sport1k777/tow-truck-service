import type {
  GeoBounds,
  GeoCoordinates,
  RouteCalculationRequest,
  RouteCalculationResponse,
  RouteResult,
  RouteWaypoint,
} from './maps.types';

function toLatLngLiteral(
  waypoint: RouteWaypoint,
): google.maps.LatLngLiteral | string {
  if (waypoint.location) {
    return waypoint.location;
  }

  return waypoint.address;
}

export function metersToKilometers(meters: number): number {
  return Math.round((meters / 1000) * 10) / 10;
}

export function secondsToMinutes(seconds: number): number {
  return Math.max(1, Math.round(seconds / 60));
}

export function parseBounds(bounds: google.maps.LatLngBounds): GeoBounds {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  return {
    northeast: { lat: ne.lat(), lng: ne.lng() },
    southwest: { lat: sw.lat(), lng: sw.lng() },
  };
}

export function parseDirectionsRoute(
  directionsResult: google.maps.DirectionsResult,
  request: RouteCalculationRequest,
): RouteResult {
  const leg = directionsResult.routes[0]?.legs[0];

  if (!leg?.distance?.value || !leg.duration?.value) {
    throw new Error('ROUTE_NOT_FOUND');
  }

  const polyline = directionsResult.routes[0]?.overview_polyline ?? '';

  if (!polyline) {
    throw new Error('ROUTE_POLYLINE_MISSING');
  }

  const bounds = directionsResult.routes[0]?.bounds;
  if (!bounds) {
    throw new Error('ROUTE_BOUNDS_MISSING');
  }

  return {
    distanceKm: metersToKilometers(leg.distance.value),
    durationMinutes: secondsToMinutes(leg.duration.value),
    polyline,
    bounds: parseBounds(bounds),
    origin: {
      address: leg.start_address || request.origin.address,
      placeId: request.origin.placeId,
      location: leg.start_location
        ? { lat: leg.start_location.lat(), lng: leg.start_location.lng() }
        : request.origin.location,
    },
    destination: {
      address: leg.end_address || request.destination.address,
      placeId: request.destination.placeId,
      location: leg.end_location
        ? { lat: leg.end_location.lat(), lng: leg.end_location.lng() }
        : request.destination.location,
    },
  };
}

export async function calculateDrivingRoute(
  directionsService: google.maps.DirectionsService,
  request: RouteCalculationRequest,
): Promise<RouteCalculationResponse> {
  const origin = toLatLngLiteral(request.origin);
  const destination = toLatLngLiteral(request.destination);

  const directionsResult = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          resolve(result);
          return;
        }

        reject(new Error(status || 'ROUTE_CALCULATION_FAILED'));
      },
    );
  });

  return {
    route: parseDirectionsRoute(directionsResult, request),
    directionsResult,
  };
}

/** Decode encoded polyline for future custom rendering / driver tracking. */
export function decodeRoutePath(
  googleMaps: typeof google,
  encodedPolyline: string,
): GeoCoordinates[] {
  const path = googleMaps.maps.geometry.encoding.decodePath(encodedPolyline);
  return path.map((point) => ({ lat: point.lat(), lng: point.lng() }));
}
