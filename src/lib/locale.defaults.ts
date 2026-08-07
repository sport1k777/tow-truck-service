/**
 * Country and locale defaults for the initial Ukrainian market release.
 * These are fallback values used before Settings are loaded from the database.
 * The architecture remains country-independent — additional locales are added
 * by extending SUPPORTED_LOCALES and providing translations, not by refactoring.
 */

export const DEFAULT_LOCALE = 'uk' as const;
export const DEFAULT_COUNTRY_CODE = 'UA' as const;
export const DEFAULT_CURRENCY = 'UAH' as const;
export const DEFAULT_CURRENCY_SYMBOL = '₴' as const;
export const DEFAULT_PHONE_COUNTRY_CODE = '+380' as const;
export const DEFAULT_TIMEZONE = 'Europe/Kyiv' as const;

/** Rivne city center — default map view for calculator (Ukraine-wide search still enabled) */
export const DEFAULT_MAP_CENTER = {
  lat: 50.6199,
  lng: 26.2516,
} as const;

export const DEFAULT_MAP_ZOOM = 11;

/** Google Maps region and language bias for Ukraine */
export const DEFAULT_MAPS_CONFIG = {
  region: 'UA',
  language: 'uk',
  componentRestrictions: { country: 'ua' },
} as const;

export const SUPPORTED_LOCALES = ['uk'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Future locales — add here when expanding to other markets */
export const FUTURE_LOCALES = ['en', 'pl', 'de'] as const;

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  uk: 'Українська',
};
