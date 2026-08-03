import { NOTIFICATION_CHANNELS } from '@/lib/constants';
import type { NotificationAdapter, NotificationPayload, NotificationResult } from '../notifications.types';

/**
 * WhatsApp Business Cloud API adapter.
 * Phase 9: full Meta Graph API integration.
 */
export class WhatsAppAdapter implements NotificationAdapter {
  readonly channel = NOTIFICATION_CHANNELS.WHATSAPP;

  async send(_payload: NotificationPayload): Promise<NotificationResult> {
    // Phase 9: POST to Meta Graph API with approved template
    return { channel: this.channel, success: false, error: 'Not implemented' };
  }
}
