'use client';

import { createContext, useContext } from 'react';
import {
  DEFAULT_PRICING_CONFIG,
  getCalculatorVehicleOptions,
  type PricingConfig,
} from '@/modules/pricing/pricing.config';
import type { ServiceAreaValidationConfig } from '@/modules/maps/service-area';
import type { CityPricingConfig } from '@/modules/pricing/city-pricing';
import {
  SERVICE_AREA_AVAILABLE_MESSAGE,
  SERVICE_AREA_NAME,
  SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE,
} from '@/modules/maps/service-area.constants';

export interface CalculatorRuntimeConfig {
  pricingConfig: PricingConfig;
  vehicleOptions: ReturnType<typeof getCalculatorVehicleOptions>;
  serviceAreaConfig: ServiceAreaValidationConfig & {
    availableMessage: string;
    areaName: string;
  };
  cityPricingConfig: CityPricingConfig;
}

const DEFAULT_RUNTIME_CONFIG: CalculatorRuntimeConfig = {
  pricingConfig: DEFAULT_PRICING_CONFIG,
  vehicleOptions: getCalculatorVehicleOptions(),
  serviceAreaConfig: {
    validationEnabled: true,
    mode: 'regions',
    allowedRegions: ['рівненська область', 'rivne oblast'],
    outOfCoverageMessage: SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE,
    availableMessage: SERVICE_AREA_AVAILABLE_MESSAGE,
    areaName: SERVICE_AREA_NAME,
  },
  cityPricingConfig: {
    homeCenterLat: 50.6199,
    homeCenterLng: 26.2516,
    cityServiceRadiusKm: 50,
    freeCityRadiusKm: 0,
  },
};

const CalculatorConfigContext = createContext<CalculatorRuntimeConfig>(DEFAULT_RUNTIME_CONFIG);

export function CalculatorConfigProvider({
  value,
  children,
}: {
  value: CalculatorRuntimeConfig;
  children: React.ReactNode;
}) {
  return (
    <CalculatorConfigContext.Provider value={value}>{children}</CalculatorConfigContext.Provider>
  );
}

export function useCalculatorConfig() {
  return useContext(CalculatorConfigContext);
}
