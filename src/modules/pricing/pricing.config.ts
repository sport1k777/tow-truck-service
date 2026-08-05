/**
 * Default pricing configuration — single source of truth for Phase 7.6.
 * Phase 8+: load overrides from database; do not hardcode rates elsewhere.
 */

export const PRICING_VEHICLE_TYPES = {
  PASSENGER_CAR: 'PASSENGER_CAR',
  SUV: 'SUV',
  VAN: 'VAN',
  LARGE_SUV: 'LARGE_SUV',
} as const;

export type PricingVehicleType =
  (typeof PRICING_VEHICLE_TYPES)[keyof typeof PRICING_VEHICLE_TYPES];

export interface PricingVehicleRate {
  perKmRate: number;
  label: string;
  flatSurcharge?: number;
}

export interface PricingPercentageSurcharge {
  enabled: boolean;
  percent: number;
  label: string;
}

export interface PricingNightSurcharge extends PricingPercentageSurcharge {
  startHour: number;
  endHour: number;
}

export interface PricingFlatSurcharge {
  enabled: boolean;
  flatFee: number;
  label: string;
}

export interface PricingConfig {
  currency: string;
  currencySymbol: string;
  baseCallOutFee: number;
  minCharge: number;
  cityPerKmRate: number;
  outsideCityPerKmRate: number;
  vehicleRates: Record<PricingVehicleType, PricingVehicleRate>;
  additionalServices: {
    nightSurcharge: PricingNightSurcharge;
    emergencyDispatch: PricingFlatSurcharge;
    difficultLoading: PricingFlatSurcharge;
    weekendSurcharge: PricingPercentageSurcharge;
    holidaySurcharge: PricingPercentageSurcharge;
  };
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  currency: 'UAH',
  currencySymbol: '₴',
  baseCallOutFee: 900,
  minCharge: 900,
  cityPerKmRate: 25,
  outsideCityPerKmRate: 30,
  vehicleRates: {
    PASSENGER_CAR: {
      perKmRate: 25,
      label: 'Легковий автомобіль',
    },
    SUV: {
      perKmRate: 30,
      label: 'Кросовер / SUV',
    },
    VAN: {
      perKmRate: 35,
      label: 'Мінівен / фургон',
    },
    LARGE_SUV: {
      perKmRate: 35,
      label: 'Великий SUV',
    },
  },
  additionalServices: {
    nightSurcharge: {
      enabled: true,
      percent: 20,
      startHour: 22,
      endHour: 6,
      label: 'Нічна доплата (22:00–06:00)',
    },
    emergencyDispatch: {
      enabled: true,
      flatFee: 300,
      label: 'Термінова подача',
    },
    difficultLoading: {
      enabled: true,
      flatFee: 500,
      label: 'Складне навантаження',
    },
    weekendSurcharge: {
      enabled: false,
      percent: 15,
      label: 'Доплата за вихідні',
    },
    holidaySurcharge: {
      enabled: true,
      percent: 30,
      label: 'Святкова доплата',
    },
  },
};

export function getDefaultPricingConfig(): PricingConfig {
  return DEFAULT_PRICING_CONFIG;
}

export function getCalculatorVehicleOptions(
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
): Array<{
  value: PricingVehicleType;
  label: string;
}> {
  return Object.entries(config.vehicleRates).map(([value, rate]) => ({
    value: value as PricingVehicleType,
    label: rate.label,
  }));
}
