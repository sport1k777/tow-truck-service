/**
 * Validates environment variables without starting Next.js.
 * Usage: npm run env:check
 */
import { envSchema, PRODUCTION_REQUIRED_ENV_KEYS } from '../src/config/env.schema';

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:');
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

console.log('✅ Environment schema valid');

if (result.data.NODE_ENV === 'production') {
  const missing = PRODUCTION_REQUIRED_ENV_KEYS.filter((key) => !result.data[key]);
  if (missing.length > 0) {
    console.error(`❌ Missing production-required variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  console.log('✅ Production-required variables present');
}

console.log(`   APP_URL: ${result.data.NEXT_PUBLIC_APP_URL}`);
console.log(`   NODE_ENV: ${result.data.NODE_ENV}`);
