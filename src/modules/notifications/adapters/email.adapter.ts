import { NOTIFICATION_CHANNELS } from '@/lib/constants';
import type { NotificationAdapter, NotificationPayload, NotificationResult } from '../notifications.types';

/**
 * Resend email adapter.
 * Phase 9: React Email templates + Resend API integration.
 */
export class EmailAdapter implements NotificationAdapter {
  readonly channel = NOTIFICATION_CHANNELS.EMAIL;

  async send(_payload: NotificationPayload): Promise<NotificationResult> {
    // Phase 9: send via Resend API
    return { channel: this.channel, success: false, error: 'Not implemented' };
  }
}
