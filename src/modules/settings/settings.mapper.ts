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
import { COMPANY_PHONE_DISPLAY, COMPANY_PHONE_E164 } from '@/lib/contact.defaults';
import { CANONICAL_SITE_URL } from '@/config/site-url';
import { baseAppConfig } from '@/config/base.config';
import { SETTINGS_DEFAULTS, SETTING_KEYS } from './settings.defaults';
import { DEFAULT_WEBSITE_CONTENT } from './content.defaults';
import type { BusinessSettings, SeoSettings, WebsiteContentSettings } from './settings.types';

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseJsonRecord(value: string | undefined): Record<string, string> {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed).map(([key, val]) => [key, String(val ?? '')]),
      );
    }
  } catch {
    return {};
  }

  return {};
}

export function mapSettingsToBusiness(settings: Map<string, string>): BusinessSettings {
  const socialLinks = parseJsonRecord(settings.get(SETTING_KEYS.SOCIAL_LINKS));

  return {
    companyName: settings.get(SETTING_KEYS.COMPANY_NAME) || SETTINGS_DEFAULTS.companyName,
    logoUrl: settings.get(SETTING_KEYS.LOGO_URL) || null,
    primaryColor: settings.get(SETTING_KEYS.PRIMARY_COLOR) || null,
    secondaryColor: settings.get(SETTING_KEYS.SECONDARY_COLOR) || null,
    phone: settings.get(SETTING_KEYS.PHONE) || COMPANY_PHONE_DISPLAY,
    whatsappNumber: settings.get(SETTING_KEYS.WHATSAPP_NUMBER) || COMPANY_PHONE_E164,
    telegram: settings.get(SETTING_KEYS.TELEGRAM) || socialLinks.telegram || null,
    viber: settings.get(SETTING_KEYS.VIBER) || socialLinks.viber || null,
    email: settings.get(SETTING_KEYS.EMAIL) || null,
    websiteUrl: settings.get(SETTING_KEYS.WEBSITE_URL) || null,
    address: settings.get(SETTING_KEYS.ADDRESS) || null,
    mapsLink: settings.get(SETTING_KEYS.MAPS_LINK) || null,
    socialLinks,
    countryCode: settings.get(SETTING_KEYS.COUNTRY_CODE) || DEFAULT_COUNTRY_CODE,
    locale: settings.get(SETTING_KEYS.LOCALE) || DEFAULT_LOCALE,
    currency: settings.get(SETTING_KEYS.CURRENCY) || DEFAULT_CURRENCY,
    currencySymbol: DEFAULT_CURRENCY_SYMBOL,
    phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
    timezone: settings.get(SETTING_KEYS.TIMEZONE) || DEFAULT_TIMEZONE,
    mapCenterLat: parseNumber(settings.get(SETTING_KEYS.MAP_CENTER_LAT), DEFAULT_MAP_CENTER.lat),
    mapCenterLng: parseNumber(settings.get(SETTING_KEYS.MAP_CENTER_LNG), DEFAULT_MAP_CENTER.lng),
    mapZoom: parseNumber(settings.get(SETTING_KEYS.MAP_ZOOM), DEFAULT_MAP_ZOOM),
    workingHours: settings.get(SETTING_KEYS.WORKING_HOURS) || null,
  };
}

export function mapSettingsToSeo(settings: Map<string, string>): SeoSettings {
  return {
    title: settings.get(SETTING_KEYS.SEO_TITLE) || 'Evakuator24 — Евакуатор за 30 секунд',
    description:
      settings.get(SETTING_KEYS.SEO_DESCRIPTION) || baseAppConfig.defaultDescription,
    keywords: settings.get(SETTING_KEYS.SEO_KEYWORDS) || '',
    ogImage: settings.get(SETTING_KEYS.SEO_OG_IMAGE) || '/opengraph-image',
    canonicalUrl: settings.get(SETTING_KEYS.SEO_CANONICAL_URL) || CANONICAL_SITE_URL,
  };
}

function parseTrustItems(value: string | undefined): WebsiteContentSettings['heroTrustItems'] {
  if (!value) return DEFAULT_WEBSITE_CONTENT.heroTrustItems;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (item && typeof item === 'object' && 'label' in item) {
            return {
              label: String((item as { label: unknown }).label ?? ''),
              icon: String((item as { icon?: unknown }).icon ?? 'Zap'),
            };
          }
          return null;
        })
        .filter(Boolean) as WebsiteContentSettings['heroTrustItems'];
    }
  } catch {
    return DEFAULT_WEBSITE_CONTENT.heroTrustItems;
  }

  return DEFAULT_WEBSITE_CONTENT.heroTrustItems;
}

export function mapSettingsToContent(settings: Map<string, string>): WebsiteContentSettings {
  return {
    heroBadge: settings.get(SETTING_KEYS.HERO_BADGE) || DEFAULT_WEBSITE_CONTENT.heroBadge,
    heroTitle: settings.get(SETTING_KEYS.HERO_TITLE) || DEFAULT_WEBSITE_CONTENT.heroTitle,
    heroTitleHighlight:
      settings.get(SETTING_KEYS.HERO_TITLE_HIGHLIGHT) || DEFAULT_WEBSITE_CONTENT.heroTitleHighlight,
    heroSubtitle: settings.get(SETTING_KEYS.HERO_SUBTITLE) || DEFAULT_WEBSITE_CONTENT.heroSubtitle,
    heroCtaPrimary:
      settings.get(SETTING_KEYS.HERO_CTA_PRIMARY) || DEFAULT_WEBSITE_CONTENT.heroCtaPrimary,
    heroCtaSecondary:
      settings.get(SETTING_KEYS.HERO_CTA_SECONDARY) || DEFAULT_WEBSITE_CONTENT.heroCtaSecondary,
    heroTrustItems: parseTrustItems(settings.get(SETTING_KEYS.HERO_TRUST_ITEMS)),
    aboutTitle: settings.get(SETTING_KEYS.ABOUT_TITLE) || DEFAULT_WEBSITE_CONTENT.aboutTitle,
    aboutBody: settings.get(SETTING_KEYS.ABOUT_BODY) || DEFAULT_WEBSITE_CONTENT.aboutBody,
    footerTagline:
      settings.get(SETTING_KEYS.FOOTER_TAGLINE) || DEFAULT_WEBSITE_CONTENT.footerTagline,
  };
}
