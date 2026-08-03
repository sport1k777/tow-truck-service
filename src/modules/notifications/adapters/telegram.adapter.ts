import { NOTIFICATION_CHANNELS } from '@/lib/constants';
import type { NotificationAdapter, NotificationPayload, NotificationResult } from '../notifications.types';

/**
 * Telegram Bot API adapter for administrator alerts.
 * Phase 9: full Bot API integration.
 */
export class TelegramAdapter implements NotificationAdapter {
  readonly channel = NOTIFICATION_CHANNELS.TELEGRAM;

  async send(_payload: NotificationPayload): Promise<NotificationResult> {
    // Phase 9: POST to Telegram Bot API
    return { channel: this.channel, success: false, error: 'Not implemented' };
  }
}
