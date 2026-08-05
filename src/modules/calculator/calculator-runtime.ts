import { getCalculatorVehicleOptions, type PricingConfig } from '@/modules/pricing/pricing.config';
import { PricingService } from '@/modules/pricing/pricing.service';
import { SettingsService } from '@/modules/settings/settings.service';
import type { CalculatorRuntimeConfig } from '@/components/calculator/calculator-config-context';

export async function getCalculatorRuntimeConfig(): Promise<CalculatorRuntimeConfig> {
  const [pricingConfig, serviceAreaSettings] = await Promise.all([
    PricingService.getConfig(),
    SettingsService.getServiceAreaSettings(),
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
  };
}

export type { PricingConfig };
