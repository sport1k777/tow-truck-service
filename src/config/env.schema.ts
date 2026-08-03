import { z } from 'zod';

/**
 * Shared environment variable schema — validated at startup via src/lib/env.ts.
 * Client-safe vars must use the NEXT_PUBLIC_ prefix.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  AUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY: z.string().optional(),
  GOOGLE_MAPS_SERVER_KEY: z.string().optional(),
  WHATSAPP_API_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z.string().optional(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_ADMIN_CHAT_ID: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_ADMIN: z.string().email().optional(),
  CRON_SECRET: z.string().min(16).optional(),
  SENTRY_DSN: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

/** Required when NODE_ENV=production */
export const PRODUCTION_REQUIRED_ENV_KEYS = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'CRON_SECRET',
] as const satisfies ReadonlyArray<keyof Env>;

/** Recommended for full production feature set (warn if missing) */
export const PRODUCTION_RECOMMENDED_ENV_KEYS = [
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'AUTH_URL',
] as const satisfies ReadonlyArray<keyof Env>;
