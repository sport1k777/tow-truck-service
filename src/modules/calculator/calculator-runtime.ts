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
      allowedRegions: serviceAreaSettings.allowedRegions,
      outOfCoverageMessage: serviceAreaSettings.outOfCoverageMessage,
      availableMessage: serviceAreaSettings.availableMessage,
      areaName: serviceAreaSettings.areaName,
    },
  };
}

export type { PricingConfig };
