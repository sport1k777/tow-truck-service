import { NOTIFICATION_CHANNELS } from '@/lib/constants';
import { logger } from '@/lib/logger';
import type {
  NotificationAdapter,
  NotificationPayload,
  NotificationResult,
} from './notifications.types';

/**
 * Orchestrates multi-channel notification dispatch.
 * Failures on individual channels never block order creation.
 */
export class NotificationService {
  constructor(private readonly adapters: NotificationAdapter[]) {}

  async notify(payload: NotificationPayload): Promise<NotificationResult[]> {
    const results = await Promise.allSettled(
      this.adapters.map((adapter) => adapter.send(payload)),
    );

    return results.map((result, index) => {
      const adapter = this.adapters[index];

      if (result.status === 'fulfilled') {
        if (!result.value.success) {
          logger.warn('Notification delivery failed', {
            module: 'notifications',
            action: 'notify',
            metadata: { channel: adapter.channel, error: result.value.error },
          });
        }
        return result.value;
      }

      logger.error('Notification adapter threw', {
        module: 'notifications',
        action: 'notify',
        metadata: { channel: adapter.channel, error: String(result.reason) },
      });

      return {
        channel: adapter.channel,
        success: false,
        error: String(result.reason),
      };
    });
  }
}

/** Phase 8: register real adapters (WhatsApp, Email, Telegram) */
export function createNotificationService(_adapters: NotificationAdapter[] = []) {
  return new NotificationService(_adapters);
}

export { NOTIFICATION_CHANNELS };
