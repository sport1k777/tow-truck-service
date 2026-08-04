import { MAPS_LOADER_OPTIONS } from './maps.config';
import type {
  GeoBounds,
  GeoCoordinates,
  RouteCalculationRequest,
  RouteCalculationResponse,
  RouteResult,
  RouteWaypoint,
} from './maps.types';

function toRouteEndpoint(
  waypoint: RouteWaypoint,
): string | google.maps.LatLngLiteral {
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

export function parseViewportBounds(viewport: google.maps.LatLngBounds): GeoBounds {
  const ne = viewport.getNorthEast();
  const sw = viewport.getSouthWest();

  return {
    northeast: { lat: ne.lat(), lng: ne.lng() },
    southwest: { lat: sw.lat(), lng: sw.lng() },
  };
}

function parseRoutesApiRoute(
  routesRoute: google.maps.routes.Route,
  request: RouteCalculationRequest,
  googleMaps: typeof google,
): RouteResult {
  const distanceMeters = routesRoute.distanceMeters;
  const durationMillis = routesRoute.durationMillis ?? routesRoute.staticDurationMillis;
  const path = routesRoute.path;
  const viewport = routesRoute.viewport;
  const leg = routesRoute.legs?.[0];

  if (!distanceMeters || !durationMillis || !path?.length || !viewport) {
    throw new Error('ROUTE_NOT_FOUND');
  }

  const polyline = googleMaps.maps.geometry.encoding.encodePath(
    path.map((point) => ({ lat: point.lat, lng: point.lng })),
  );

  if (!polyline) {
    throw new Error('ROUTE_POLYLINE_MISSING');
  }

  const startLocation = leg?.startLocation;
  const endLocation = leg?.endLocation;

  return {
    distanceKm: metersToKilometers(distanceMeters),
    durationMinutes: secondsToMinutes(durationMillis / 1000),
    polyline,
    bounds: parseViewportBounds(viewport),
    origin: {
      address: request.origin.address,
      placeId: request.origin.placeId,
      location: startLocation
        ? { lat: startLocation.lat, lng: startLocation.lng }
        : request.origin.location,
    },
    destination: {
      address: request.destination.address,
      placeId: request.destination.placeId,
      location: endLocation
        ? { lat: endLocation.lat, lng: endLocation.lng }
        : request.destination.location,
    },
  };
}

export async function calculateDrivingRoute(
  googleMaps: typeof google,
  request: RouteCalculationRequest,
): Promise<RouteCalculationResponse> {
  await googleMaps.maps.importLibrary('routes');

  const { routes } = await googleMaps.maps.routes.Route.computeRoutes({
    origin: toRouteEndpoint(request.origin),
    destination: toRouteEndpoint(request.destination),
    travelMode: googleMaps.maps.TravelMode.DRIVING,
    fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs'],
    language: MAPS_LOADER_OPTIONS.language,
    region: MAPS_LOADER_OPTIONS.region,
  });

  const routesRoute = routes?.[0];
  if (!routesRoute) {
    throw new Error('ROUTE_NOT_FOUND');
  }

  return {
    route: parseRoutesApiRoute(routesRoute, request, googleMaps),
    routesRoute,
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
