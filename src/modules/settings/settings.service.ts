import { SETTINGS_DEFAULTS } from './settings.defaults';
import type { BusinessSettings } from './settings.types';

/**
 * Public service interface for the Settings module.
 * Phase 8: replace with database-backed implementation + cache.
 */
export const SettingsService = {
  async getBusinessSettings(): Promise<BusinessSettings> {
    return SETTINGS_DEFAULTS;
  },

  async get(key: string): Promise<string | null> {
    const settings = await this.getBusinessSettings();
    const entry = Object.entries(settings).find(([k]) => k === key);
    return entry ? String(entry[1]) : null;
  },
};
