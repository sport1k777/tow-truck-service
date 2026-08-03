'use client';

import { useEffect, useRef, useState } from 'react';
import { useMaps } from '@/modules/maps/maps-provider';
import { createDirectionsService } from '@/modules/maps/maps.service';
import { calculateDrivingRoute } from '@/modules/maps/route-calculator';
import type { RouteCalculationRequest, RouteCalculationResponse } from '@/modules/maps/maps.types';

export type RouteStatus = 'idle' | 'calculating' | 'ready' | 'error';

interface UseCalculatorRouteOptions {
  pickupAddress: string;
  destinationAddress: string;
  pickupPlaceId: string | null;
  pickupLocation: { lat: number; lng: number } | null;
  destinationPlaceId: string | null;
  destinationLocation: { lat: number; lng: number } | null;
}

interface UseCalculatorRouteResult {
  route: RouteCalculationResponse | null;
  routeStatus: RouteStatus;
  routeError: string | null;
  distanceKm: number | null;
  durationMinutes: number | null;
}

const ROUTE_DEBOUNCE_MS = 700;

function canCalculateRoute(options: UseCalculatorRouteOptions): boolean {
  if (!options.pickupAddress.trim() || !options.destinationAddress.trim()) {
    return false;
  }

  if (options.pickupAddress.trim().length < 5 || options.destinationAddress.trim().length < 5) {
    return false;
  }

  if (
    options.pickupAddress.trim().toLowerCase() === options.destinationAddress.trim().toLowerCase()
  ) {
    return false;
  }

  return true;
}

function buildRouteRequest(options: UseCalculatorRouteOptions): RouteCalculationRequest {
  return {
    origin: {
      address: options.pickupAddress.trim(),
      placeId: options.pickupPlaceId,
      location: options.pickupLocation,
    },
    destination: {
      address: options.destinationAddress.trim(),
      placeId: options.destinationPlaceId,
      location: options.destinationLocation,
    },
  };
}

export function useCalculatorRoute(options: UseCalculatorRouteOptions): UseCalculatorRouteResult {
  const { status, google } = useMaps();
  const [route, setRoute] = useState<RouteCalculationResponse | null>(null);
  const [routeStatus, setRouteStatus] = useState<RouteStatus>('idle');
  const [routeError, setRouteError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (status !== 'ready' || !google) {
      setRoute(null);
      setRouteStatus('idle');
      setRouteError(null);
      return;
    }

    if (!canCalculateRoute(options)) {
      setRoute(null);
      setRouteStatus('idle');
      setRouteError(null);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    const timer = window.setTimeout(async () => {
      setRouteStatus('calculating');
      setRouteError(null);

      try {
        const directionsService = createDirectionsService(google);
        const response = await calculateDrivingRoute(
          directionsService,
          buildRouteRequest(options),
        );

        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        setRoute(response);
        setRouteStatus('ready');
      } catch {
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        setRoute(null);
        setRouteStatus('error');
        setRouteError('Не вдалося побудувати маршрут. Перевірте адреси та спробуйте ще раз.');
      }
    }, ROUTE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- route recalculates on individual address fields
  }, [
    status,
    google,
    options.pickupAddress,
    options.destinationAddress,
    options.pickupPlaceId,
    options.pickupLocation?.lat,
    options.pickupLocation?.lng,
    options.destinationPlaceId,
    options.destinationLocation?.lat,
    options.destinationLocation?.lng,
  ]);

  return {
    route,
    routeStatus,
    routeError,
    distanceKm: route?.route.distanceKm ?? null,
    durationMinutes: route?.route.durationMinutes ?? null,
  };
}
