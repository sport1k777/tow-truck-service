/**
 * Notification module — provider-based architecture.
 * Each channel implements NotificationAdapter interface.
 * New channels (SMS, Push, Viber) are added by creating a new adapter.
 */

import { NOTIFICATION_CHANNELS, NOTIFICATION_EVENTS } from '@/lib/constants';
import type { NotificationChannel, NotificationEvent } from '@/lib/constants';

export interface NotificationPayload {
  event: NotificationEvent;
  orderId: string;
  referenceNumber: string;
  pickupAddress: string;
  destinationAddress: string;
  estimatedPrice: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}

export interface NotificationResult {
  channel: NotificationChannel;
  success: boolean;
  error?: string;
}

export interface NotificationAdapter {
  readonly channel: NotificationChannel;
  send(payload: NotificationPayload): Promise<NotificationResult>;
}

export { NOTIFICATION_CHANNELS, NOTIFICATION_EVENTS };
