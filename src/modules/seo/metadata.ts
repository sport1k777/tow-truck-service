import type { Metadata } from 'next';
import { SettingsService } from '@/modules/settings/settings.service';
import { DEFAULT_LOCALE } from '@/lib/locale.defaults';

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}

/**
 * Generates Next.js Metadata for public pages with Ukrainian SEO defaults.
 * Phase 7: JSON-LD structured data helpers.
 */
export async function generatePageMetadata(options: PageMetadataOptions): Promise<Metadata> {
  const settings = await SettingsService.getBusinessSettings();
  const siteName = settings.companyName || 'Tow Truck Service';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    title: `${options.title} | ${siteName}`,
    description: options.description,
    metadataBase: new URL(appUrl),
    alternates: {
      canonical: options.path ? `${appUrl}${options.path}` : appUrl,
    },
    openGraph: {
      title: options.title,
      description: options.description,
      locale: DEFAULT_LOCALE,
      type: 'website',
      siteName,
    },
    robots: options.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
