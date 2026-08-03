import { env } from './env';

/** Canonical application URL — always validated in production. */
export function getAppUrl(): string {
  return env.NEXT_PUBLIC_APP_URL;
}
