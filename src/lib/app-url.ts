import { CANONICAL_SITE_URL } from '@/config/site-url';
import { env } from './env';

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

/** Canonical application URL — production always resolves to the public domain. */
export function getAppUrl(): string {
  if (env.NODE_ENV === 'production') {
    return CANONICAL_SITE_URL;
  }

  return normalizeSiteUrl(env.NEXT_PUBLIC_APP_URL);
}
