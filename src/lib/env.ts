import {
  envSchema,
  PRODUCTION_RECOMMENDED_ENV_KEYS,
  PRODUCTION_REQUIRED_ENV_KEYS,
  type Env,
} from '@/config/env.schema';

export type { Env };

function warnMissingRecommendedEnv(missing: string[]): void {
  if (missing.length === 0) {
    return;
  }

  console.warn(
    `[env] Recommended production variables are not set: ${missing.join(', ')}`,
  );
}

function isNextProductionBuild(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  const data = parsed.data;

  if (data.NODE_ENV === 'production' && !isNextProductionBuild()) {
    for (const key of PRODUCTION_REQUIRED_ENV_KEYS) {
      if (!data[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }

    const missingRecommended = PRODUCTION_RECOMMENDED_ENV_KEYS.filter((key) => !data[key]);
    warnMissingRecommendedEnv(missingRecommended);
  }

  return data;
}

export const env = validateEnv();
