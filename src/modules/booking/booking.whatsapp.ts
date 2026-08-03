import type { BookingSubmissionPayload } from './booking.types';
import { getWhatsAppHref } from '@/lib/contact';

export interface WhatsAppDispatchResult {
  success: boolean;
  error?: string;
}

/**
 * Formats the booking request as a WhatsApp message for the dispatcher.
 * Used by sendBookingToWhatsApp — keep in sync when fields change.
 */
export function formatBookingWhatsAppMessage(
  payload: BookingSubmissionPayload,
  referenceNumber: string,
): string {
  const lines = [
    `🚚 Нова заявка: ${referenceNumber}`,
    '',
    `Customer Name: ${payload.customerName}`,
    `Phone Number: ${payload.customerPhone}`,
    `Pickup Address: ${payload.pickupAddress}`,
    `Destination Address: ${payload.destinationAddress}`,
    `Vehicle Make/Model: ${payload.vehicleMakeModel}`,
  ];

  if (payload.additionalNotes) {
    lines.push(`Notes: ${payload.additionalNotes}`);
  }

  lines.push('', `⏱ ${new Date(payload.submittedAt).toLocaleString('uk-UA')}`);

  return lines.join('\n');
}

/**
 * Opens WhatsApp (wa.me) with a pre-filled booking message.
 * Phase 7.3+: optional WhatsApp Business Cloud API can replace the window.open path.
 */
export async function sendBookingToWhatsApp(
  payload: BookingSubmissionPayload,
  referenceNumber: string,
): Promise<WhatsAppDispatchResult> {
  const message = formatBookingWhatsAppMessage(payload, referenceNumber);
  const url = getWhatsAppHref(message);

  if (typeof window === 'undefined') {
    return { success: false, error: 'WhatsApp dispatch requires a browser environment' };
  }

  const whatsappWindow = window.open(url, '_blank', 'noopener,noreferrer');

  if (!whatsappWindow) {
    return { success: false, error: 'Unable to open WhatsApp. Allow pop-ups and try again.' };
  }

  return { success: true };
}
