'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { MapsProvider } from '@/modules/maps/maps-provider';
import { CalculatorRouteMap } from '@/components/maps/calculator-route-map';
import { CalculatorForm } from './calculator-form';
import { CalculatorResults } from './calculator-results';
import { useCalculator } from './use-calculator';
import type { GeoCoordinates } from '@/modules/maps/maps.types';
import type { PlaceLocation } from '@/modules/maps/maps.types';

function PriceCalculatorSectionContent() {
  const [mapFocusLocation, setMapFocusLocation] = useState<GeoCoordinates | null>(null);

  const handlePickupGeolocationSelect = useCallback((place: PlaceLocation) => {
    if (place.location) {
      setMapFocusLocation(place.location);
    }
  }, []);
  const {
    form,
    errors,
    status,
    result,
    route,
    routeStatus,
    livePrice,
    displayDistanceKm,
    displayDurationMinutes,
    updateField,
    setPickupPlace,
    setDestinationPlace,
    calculate,
    isCalculating,
    isCalculatingRoute,
  } = useCalculator();

  return (
    <section
      id="pricing"
      className="landing-section bg-[#030712]"
      aria-labelledby="calculator-heading"
    >
      <div className="landing-section-divider" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#030712] to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(59,130,246,0.07),transparent)]"
        aria-hidden="true"
      />

      <div className="landing-container">
        <div className="landing-header">
          <p className="landing-eyebrow">Калькулятор</p>
          <h2 id="calculator-heading" className="landing-title">
            Розрахуйте вартість евакуації
          </h2>
          <p className="landing-subtitle">
            Вкажіть маршрут та тип автомобіля — отримайте орієнтовну ціну за кілька секунд
          </p>
        </div>

        <div className="landing-panel">
          <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] xl:grid-cols-[minmax(0,440px)_1fr]">
            <div className="flex flex-col gap-8 border-b border-white/[0.06] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="flex flex-col gap-3">
                <CalculatorForm
                  form={form}
                  errors={errors}
                  isCalculating={isCalculating}
                  onFieldChange={updateField}
                  onPickupPlaceSelect={setPickupPlace}
                  onPickupGeolocationSelect={handlePickupGeolocationSelect}
                  onDestinationPlaceSelect={setDestinationPlace}
                  onCalculate={calculate}
                />

                <Link
                  href="/order"
                  className="hero-cta-secondary inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-white/90"
                >
                  Замовити евакуатор
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div aria-live="polite" aria-atomic="true">
                <CalculatorResults
                  status={status}
                  result={result}
                  livePrice={livePrice}
                  displayDistanceKm={displayDistanceKm}
                  displayDurationMinutes={displayDurationMinutes}
                  isCalculatingRoute={isCalculatingRoute}
                  routeStatus={routeStatus}
                />
              </div>
            </div>

            <div className="relative min-h-[320px] lg:min-h-[560px]">
              <CalculatorRouteMap
                pickupAddress={form.pickupAddress}
                destinationAddress={form.destinationAddress}
                focusLocation={mapFocusLocation}
                route={route}
                distanceKm={displayDistanceKm}
                durationMinutes={displayDurationMinutes ?? undefined}
                isCalculatingRoute={isCalculatingRoute}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PriceCalculatorSection() {
  return (
    <MapsProvider>
      <PriceCalculatorSectionContent />
    </MapsProvider>
  );
}
