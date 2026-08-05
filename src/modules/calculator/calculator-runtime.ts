import { SettingsService } from '@/modules/settings/settings.service';
import { PricingService } from '@/modules/pricing/pricing.service';
import { getCalculatorVehicleOptions } from '@/modules/pricing/pricing.config';
import type { CalculatorRuntimeConfig } from '@/components/calculator/calculator-config-context';

export async function getCalculatorRuntimeConfig(): Promise<CalculatorRuntimeConfig> {
  const [pricingConfig, serviceAreaSettings, homeCity] = await Promise.all([
    PricingService.getConfig(),
    SettingsService.getServiceAreaSettings(),
    SettingsService.getHomeCityCenter(),
  ]);

  return {
    pricingConfig,
    vehicleOptions: getCalculatorVehicleOptions(pricingConfig),
    serviceAreaConfig: {
      validationEnabled: serviceAreaSettings.validationEnabled,
      mode: serviceAreaSettings.mode,
      allowedRegions: serviceAreaSettings.allowedRegions,
      centerLat: serviceAreaSettings.centerLat,
      centerLng: serviceAreaSettings.centerLng,
      radiusKm: serviceAreaSettings.radiusKm,
      outOfCoverageMessage: serviceAreaSettings.outOfCoverageMessage,
      availableMessage: serviceAreaSettings.availableMessage,
      areaName: serviceAreaSettings.areaName,
    },
    cityPricingConfig: {
      homeCenterLat: homeCity.lat,
      homeCenterLng: homeCity.lng,
      cityServiceRadiusKm: serviceAreaSettings.cityServiceRadiusKm,
      freeCityRadiusKm: serviceAreaSettings.freeCityRadiusKm,
    },
  };
}

export type { PricingConfig } from '@/modules/pricing/pricing.config';
