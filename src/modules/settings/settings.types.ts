/**
 * Settings module — centralized business configuration.
 * Branding values (company name, logo, colors, contacts) are stored in the
 * database and loaded at runtime. Never hardcode branding in components.
 *
 * Phase 4: Prisma repository implementation.
 * Phase 8: Full service with caching.
 */

export interface BrandingSettings {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  phone: string;
  whatsappNumber: string | null;
  email: string | null;
  websiteUrl: string | null;
  socialLinks: Record<string, string>;
}

export interface LocaleSettings {
  countryCode: string;
  locale: string;
  currency: string;
  currencySymbol: string;
  phoneCountryCode: string;
  timezone: string;
  mapCenterLat: number;
  mapCenterLng: number;
  mapZoom: number;
}

export interface BusinessSettings extends BrandingSettings, LocaleSettings {
  workingHours: string | null;
}
