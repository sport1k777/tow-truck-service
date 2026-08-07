'use client';

import { useEffect, useRef } from 'react';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { MAPS_PLACEHOLDER_MESSAGES } from '@/modules/maps/maps.config';
import { useMaps } from '@/modules/maps/maps-provider';
import {
  clearRoutePolylinesFromMap,
  centerMapOnLocation,
  createStyledMap,
  fitMapToRouteViewport,
  renderRouteOnMap,
} from '@/modules/maps/maps.service';
import type { GeoCoordinates, RouteCalculationResponse } from '@/modules/maps/maps.types';

interface CalculatorRouteMapProps {
  pickupAddress: string;
  destinationAddress: string;
  focusLocation: GeoCoordinates | null;
  route: RouteCalculationResponse | null;
  distanceKm?: number | null;
  durationMinutes?: number | null;
  isCalculatingRoute: boolean;
}

export function CalculatorRouteMap({
  pickupAddress,
  destinationAddress,
  focusLocation,
  route,
  distanceKm,
  durationMinutes,
  isCalculatingRoute,
}: CalculatorRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const { status, google, error, isConfigured } = useMaps();

  const isRouteActive = Boolean(route);
  const showStats =
    isRouteActive && distanceKm !== undefined && distanceKm !== null && durationMinutes !== undefined;

  useEffect(() => {
    if (status !== 'ready' || !google || !mapContainerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = createStyledMap(google, mapContainerRef.current);
  }, [status, google]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    clearRoutePolylinesFromMap(polylinesRef.current);
    polylinesRef.current = [];

    if (route?.routesRoute) {
      polylinesRef.current = renderRouteOnMap(mapRef.current, route.routesRoute);
      fitMapToRouteViewport(mapRef.current, route.routesRoute);
    }
  }, [route]);

  useEffect(() => {
    if (!mapRef.current || !focusLocation) {
      return;
    }

    centerMapOnLocation(mapRef.current, focusLocation);
  }, [focusLocation]);

  return (
    <div className="calculator-map relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a1628] sm:min-h-[360px] lg:min-h-0 lg:rounded-none lg:rounded-r-2xl lg:border-0 lg:border-l lg:border-white/[0.06]">
      {status === 'ready' && google ? (
        <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" aria-label="Карта маршруту" />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(56,189,248,0.15) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(59,130,246,0.12),transparent)]"
            aria-hidden="true"
          />
        </>
      )}

      <div className="absolute left-3 top-3 flex flex-col gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#030712]/80 text-white/60 backdrop-blur-md">
          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 right-3 space-y-2">
        <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-[#030712]/85 px-3 py-2 backdrop-blur-md">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-[10px] font-bold text-sky-400">
            A
          </span>
          <p className="line-clamp-1 text-xs text-white/70">{pickupAddress || 'Адреса забору'}</p>
        </div>
        <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-[#030712]/85 px-3 py-2 backdrop-blur-md">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-400">
            B
          </span>
          <p className="line-clamp-1 text-xs text-white/70">
            {destinationAddress || 'Адреса призначення'}
          </p>
        </div>
      </div>

      {showStats && (
        <div className="pointer-events-none absolute right-3 top-3 flex gap-2">
          <div className="rounded-lg border border-white/10 bg-[#030712]/85 px-3 py-1.5 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-wider text-white/60">Відстань</p>
            <p className="text-sm font-semibold text-white">
              {distanceKm!.toLocaleString('uk-UA', { maximumFractionDigits: 1 })} км
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#030712]/85 px-3 py-1.5 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-wider text-white/60">Час</p>
            <p className="text-sm font-semibold text-white">{durationMinutes} хв</p>
          </div>
        </div>
      )}

      {!isRouteActive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex max-w-[240px] flex-col items-center gap-2 px-4 text-center">
            {status === 'loading' || isCalculatingRoute ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-sky-400/70" aria-hidden="true" />
                <p className="text-sm text-white/45">
                  {isCalculatingRoute
                    ? MAPS_PLACEHOLDER_MESSAGES.calculatingRoute
                    : MAPS_PLACEHOLDER_MESSAGES.loading}
                </p>
              </>
            ) : (
              <>
                <MapPin className="h-8 w-8 text-white/20" aria-hidden="true" />
                <p className="text-sm text-white/35">
                  {!isConfigured
                    ? MAPS_PLACEHOLDER_MESSAGES.notConfigured
                    : error || MAPS_PLACEHOLDER_MESSAGES.awaitingRoute}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
