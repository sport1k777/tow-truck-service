/** WhatsApp Business Cloud API — Phase 9+ integration contract (not connected yet). */
export interface WhatsAppIntegrationConfig {
  enabled: boolean;
  apiToken: string | undefined;
  phoneNumberId: string | undefined;
  businessAccountId: string | undefined;
  webhookVerifyToken: string | undefined;
  webhookPath: '/api/webhooks/whatsapp';
}

export interface WhatsAppIntegrationHealth {
  status: 'ready' | 'not_configured' | 'partial';
  missing: string[];
}
