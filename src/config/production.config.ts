import { baseAppConfig } from './base.config';

export const productionConfig = {
  ...baseAppConfig,
  environment: 'production' as const,
  features: {
    showDetailedErrors: false,
    logDebug: false,
    strictEnvWarnings: true,
  },
  security: {
    exposeErrorDetails: false,
  },
} as const;
