import {
  DEFAULT_COUNTRY_CODE,
  DEFAULT_CURRENCY,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_LOCALE,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  DEFAULT_PHONE_COUNTRY_CODE,
  DEFAULT_TIMEZONE,
} from '@/lib/locale.defaults';
import type { BusinessSettings } from './settings.types';

/**
 * Fallback defaults for Ukraine — used until Settings are loaded from database.
 * All values are overridable via Admin Dashboard.
 */
export const SETTINGS_DEFAULTS: BusinessSettings = {
  companyName: '',
  logoUrl: null,
  primaryColor: null,
  secondaryColor: null,
  phone: '',
  whatsappNumber: null,
  email: null,
  websiteUrl: null,
  socialLinks: {},
  countryCode: DEFAULT_COUNTRY_CODE,
  locale: DEFAULT_LOCALE,
  currency: DEFAULT_CURRENCY,
  currencySymbol: DEFAULT_CURRENCY_SYMBOL,
  phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
  timezone: DEFAULT_TIMEZONE,
  mapCenterLat: DEFAULT_MAP_CENTER.lat,
  mapCenterLng: DEFAULT_MAP_CENTER.lng,
  mapZoom: DEFAULT_MAP_ZOOM,
  workingHours: null,
};

export const SETTING_KEYS = {
  COMPANY_NAME: 'company.name',
  LOGO_URL: 'company.logo_url',
  PRIMARY_COLOR: 'branding.primary_color',
  SECONDARY_COLOR: 'branding.secondary_color',
  PHONE: 'contact.phone',
  WHATSAPP_NUMBER: 'contact.whatsapp',
  EMAIL: 'contact.email',
  WEBSITE_URL: 'contact.website',
  SOCIAL_LINKS: 'contact.social_links',
  WORKING_HOURS: 'business.working_hours',
  COUNTRY_CODE: 'locale.country_code',
  LOCALE: 'locale.language',
  CURRENCY: 'locale.currency',
  TIMEZONE: 'locale.timezone',
  MAP_CENTER_LAT: 'maps.center_lat',
  MAP_CENTER_LNG: 'maps.center_lng',
  MAP_ZOOM: 'maps.zoom',
} as const;
