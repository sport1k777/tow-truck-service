import { APP_NAME } from '@/lib/constants';

export const baseAppConfig = {
  name: APP_NAME,
  defaultLocale: 'uk' as const,
  defaultSiteName: 'Evakuator24',
  defaultDescription:
    'Професійна служба евакуації автомобілів в Україні. Швидкий розрахунок вартості, онлайн-замовлення, цілодобова підтримка.',
  seo: {
    titleTemplate: '%s | %siteName%',
    defaultOgType: 'website' as const,
    twitterCard: 'summary_large_image' as const,
  },
  performance: {
    fontDisplay: 'swap' as const,
  },
} as const;
