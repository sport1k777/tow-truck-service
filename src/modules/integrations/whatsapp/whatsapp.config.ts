import { env } from '@/lib/env';
import type { WhatsAppIntegrationConfig, WhatsAppIntegrationHealth } from './whatsapp.types';

const WEBHOOK_PATH = '/api/webhooks/whatsapp' as const;

/** Reads WhatsApp Business API env — does not connect to Meta. */
export function getWhatsAppIntegrationConfig(): WhatsAppIntegrationConfig {
  return {
    enabled: Boolean(env.WHATSAPP_API_TOKEN?.trim() && env.WHATSAPP_PHONE_NUMBER_ID?.trim()),
    apiToken: env.WHATSAPP_API_TOKEN,
    phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    webhookVerifyToken: env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
    webhookPath: WEBHOOK_PATH,
  };
}

export function getWhatsAppIntegrationHealth(): WhatsAppIntegrationHealth {
  const config = getWhatsAppIntegrationConfig();
  const missing: string[] = [];

  if (!config.apiToken) {
    missing.push('WHATSAPP_API_TOKEN');
  }
  if (!config.phoneNumberId) {
    missing.push('WHATSAPP_PHONE_NUMBER_ID');
  }
  if (!config.webhookVerifyToken) {
    missing.push('WHATSAPP_WEBHOOK_VERIFY_TOKEN');
  }

  if (missing.length === 0) {
    return { status: 'ready', missing: [] };
  }

  if (missing.length >= 3) {
    return { status: 'not_configured', missing };
  }

  return { status: 'partial', missing };
}
