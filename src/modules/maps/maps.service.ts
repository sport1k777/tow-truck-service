import { DEFAULT_MAPS_CONFIG, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/locale.defaults';
import { SettingsService } from '@/modules/settings/settings.service';
import type { MapsConfig, RouteResult } from './maps.types';

/**
 * Public service interface for the Google Maps module.
 * Phase 9: Google Directions/Distance Matrix via server proxy.
 */
export const MapsService = {
  async getConfig(): Promise<MapsConfig> {
    const settings = await SettingsService.getBusinessSettings();

    return {
      center: {
        lat: settings.mapCenterLat,
        lng: settings.mapCenterLng,
      },
      zoom: settings.mapZoom,
      region: DEFAULT_MAPS_CONFIG.region,
      language: DEFAULT_MAPS_CONFIG.language,
      countryRestriction: DEFAULT_MAPS_CONFIG.componentRestrictions.country,
    };
  },

  async getRoute(_origin: string, _destination: string): Promise<RouteResult> {
    throw new Error('MapsService.getRoute — implemented in Phase 9');
  },

  getStaticMapUrl(_params: {
    pickup: { lat: number; lng: number };
    destination: { lat: number; lng: number };
  }): string {
    // Phase 9: generate Static Maps URL with server key
    return '';
  },
};

export { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM };
