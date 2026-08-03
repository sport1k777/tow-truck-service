import { env } from '@/lib/env';
import { developmentConfig } from './development.config';
import { productionConfig } from './production.config';

export type AppConfig = typeof developmentConfig | typeof productionConfig;

export function getAppConfig(): AppConfig {
  return env.NODE_ENV === 'production' ? productionConfig : developmentConfig;
}

export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

export { baseAppConfig } from './base.config';
export { developmentConfig } from './development.config';
export { productionConfig } from './production.config';
