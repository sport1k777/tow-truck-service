import type { Metadata } from 'next';
import { baseAppConfig } from '@/config/base.config';
import { getAppUrl } from '@/lib/app-url';
import { DEFAULT_LOCALE } from '@/lib/locale.defaults';
import { SETTINGS_DEFAULTS } from '@/modules/settings/settings.defaults';

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  ogImage?: string;
}

/** Sync metadata builder — avoids Suspense fallbacks that cause layout shift. */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const siteName = SETTINGS_DEFAULTS.companyName || baseAppConfig.defaultSiteName;
  const appUrl = getAppUrl();
  const canonicalPath = options.path ?? '/';
  const canonicalUrl = `${appUrl}${canonicalPath}`;
  const ogImageUrl = options.ogImage ?? `${appUrl}/opengraph-image`;

  const fullTitle = `${options.title} | ${siteName}`;

  return {
    title: fullTitle,
    description: options.description,
    metadataBase: new URL(appUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [DEFAULT_LOCALE]: canonicalUrl,
      },
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url: canonicalUrl,
      locale: DEFAULT_LOCALE,
      type: baseAppConfig.seo.defaultOgType,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: baseAppConfig.seo.twitterCard,
      title: options.title,
      description: options.description,
      images: [ogImageUrl],
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: {
      icon: [{ url: '/icon', type: 'image/png' }],
      apple: [{ url: '/apple-icon', type: 'image/png' }],
    },
  };
}
