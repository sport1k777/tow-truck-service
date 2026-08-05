import { getAppUrl } from '@/lib/app-url';
import { COMPANY_PHONE_DISPLAY, COMPANY_WHATSAPP_URL } from '@/lib/contact.defaults';
import { DEFAULT_LOCALE, DEFAULT_MAP_CENTER } from '@/lib/locale.defaults';

interface LocalBusinessJsonLdOptions {
  companyName: string;
  description: string;
  url: string;
  telephone?: string | null;
  email?: string | null;
}

export function buildLocalBusinessJsonLd(options: LocalBusinessJsonLdOptions): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: options.companyName,
    description: options.description,
    url: options.url,
    telephone: options.telephone || COMPANY_PHONE_DISPLAY,
    email: options.email || undefined,
    sameAs: [COMPANY_WHATSAPP_URL],
    areaServed: {
      '@type': 'Country',
      name: 'Ukraine',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: DEFAULT_MAP_CENTER.lat,
      longitude: DEFAULT_MAP_CENTER.lng,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    inLanguage: DEFAULT_LOCALE,
  };
}

export function buildOrganizationJsonLd(options: {
  companyName: string;
  url: string;
  telephone?: string | null;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: options.companyName,
    url: options.url,
    telephone: options.telephone || COMPANY_PHONE_DISPLAY,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Rivne Oblast',
      alternateName: 'Рівненська область',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    inLanguage: DEFAULT_LOCALE,
  };
}

export function buildWebSiteJsonLd(options: {
  companyName: string;
  description: string;
  url: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: options.companyName,
    description: options.description,
    url: options.url,
    inLanguage: DEFAULT_LOCALE,
  };
}

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function getDefaultSiteUrl(): string {
  return getAppUrl();
}
