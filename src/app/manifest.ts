import type { MetadataRoute } from 'next';
import { baseAppConfig } from '@/config/base.config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: baseAppConfig.defaultSiteName,
    short_name: baseAppConfig.defaultSiteName,
    description: baseAppConfig.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#0ea5e9',
    lang: 'uk',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
