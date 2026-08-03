import { baseAppConfig } from './base.config';

export const developmentConfig = {
  ...baseAppConfig,
  environment: 'development' as const,
  features: {
    showDetailedErrors: true,
    logDebug: true,
    strictEnvWarnings: false,
  },
  security: {
    exposeErrorDetails: true,
  },
} as const;
