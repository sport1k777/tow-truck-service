import { unstable_cache } from 'next/cache';
import { SETTINGS_DEFAULTS } from './settings.defaults';
import type { BusinessSettings, SeoSettings, ServiceAreaSettings, WebsiteContentSettings } from './settings.types';
import { fetchAllSettings } from './settings.repository';
import {
  mapSettingsToBusiness,
  mapSettingsToContent,
  mapSettingsToSeo,
} from './settings.mapper';
import { SETTING_KEYS } from './settings.defaults';
import {
  SERVICE_AREA_AVAILABLE_MESSAGE,
  SERVICE_AREA_NAME,
  SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE,
} from '@/modules/maps/service-area.constants';
import { DEFAULT_MAP_CENTER } from '@/lib/locale.defaults';

const CACHE_TAG = 'business-settings';
const REVALIDATE_SECONDS = 60;

function parseRegions(value: string | undefined): string[] {
  if (!value) {
    return ['рівненська область', 'rivne oblast'];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  } catch {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return ['рівненська область', 'rivne oblast'];
}

async function loadSettingsRecord(): Promise<Record<string, string>> {
  try {
    const rows = await fetchAllSettings();
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } catch {
    return {};
  }
}

const getCachedSettingsRecord = unstable_cache(loadSettingsRecord, [CACHE_TAG], {
  revalidate: REVALIDATE_SECONDS,
  tags: [CACHE_TAG],
});

export const SettingsService = {
  async getBusinessSettings(): Promise<BusinessSettings> {
    const record = await getCachedSettingsRecord();
    const map = new Map(Object.entries(record));

    if (map.size === 0) {
      return SETTINGS_DEFAULTS;
    }

    return mapSettingsToBusiness(map);
  },

  async getSeoSettings(): Promise<SeoSettings> {
    const record = await getCachedSettingsRecord();
    return mapSettingsToSeo(new Map(Object.entries(record)));
  },

  async getServiceAreaSettings(): Promise<ServiceAreaSettings> {
    const record = await getCachedSettingsRecord();
    const map = new Map(Object.entries(record));
    const mode = map.get(SETTING_KEYS.SERVICE_AREA_MODE) === 'radius' ? 'radius' : 'regions';
    const validationRaw = map.get(SETTING_KEYS.SERVICE_AREA_VALIDATION_ENABLED);

    let radiusArea: { centerLat: number; centerLng: number; radiusKm: number } = {
      centerLat: DEFAULT_MAP_CENTER.lat,
      centerLng: DEFAULT_MAP_CENTER.lng,
      radiusKm: 50,
    };
    try {
      const { prisma } = await import('@/lib/prisma');
      const area = await prisma.serviceArea.findFirst({
        where: { isActive: true },
        orderBy: { priority: 'asc' },
      });
      if (area?.centerLat && area?.centerLng && area?.radiusKm) {
        radiusArea = {
          centerLat: Number(area.centerLat),
          centerLng: Number(area.centerLng),
          radiusKm: Number(area.radiusKm),
        };
      }
    } catch {
      // fall back to defaults
    }

    return {
      mode,
      validationEnabled: validationRaw !== 'false',
      allowedRegions: parseRegions(map.get(SETTING_KEYS.SERVICE_AREA_REGIONS)),
      outOfCoverageMessage:
        map.get(SETTING_KEYS.SERVICE_AREA_MESSAGE) || SERVICE_AREA_OUT_OF_COVERAGE_MESSAGE,
      availableMessage:
        map.get(SETTING_KEYS.SERVICE_AREA_AVAILABLE_MESSAGE) || SERVICE_AREA_AVAILABLE_MESSAGE,
      areaName: map.get(SETTING_KEYS.SERVICE_AREA_NAME) || SERVICE_AREA_NAME,
      centerLat: radiusArea.centerLat,
      centerLng: radiusArea.centerLng,
      radiusKm: radiusArea.radiusKm,
    };
  },

  async getContentSettings(): Promise<WebsiteContentSettings> {
    const record = await getCachedSettingsRecord();
    return mapSettingsToContent(new Map(Object.entries(record)));
  },

  async get(key: string): Promise<string | null> {
    const record = await getCachedSettingsRecord();
    return record[key] ?? null;
  },
};

export function revalidateSettingsCache() {
  // next/cache revalidation is triggered from server actions via revalidateTag
  return CACHE_TAG;
}
