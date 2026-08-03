import type { BookingSubmissionPayload } from './booking.types';

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
    `👤 Клієнт: ${payload.customerName}`,
    `📞 Телефон: ${payload.customerPhone}`,
    `📍 Забір: ${payload.pickupAddress}`,
    `🏁 Призначення: ${payload.destinationAddress}`,
    `🚗 Авто: ${payload.vehicleMakeModel}`,
  ];

  if (payload.additionalNotes) {
    lines.push(`📝 Примітки: ${payload.additionalNotes}`);
  }

  lines.push('', `⏱ ${new Date(payload.submittedAt).toLocaleString('uk-UA')}`);

  return lines.join('\n');
}

/**
 * Sends a booking request to WhatsApp Business.
 *
 * Phase 7.2: simulated dispatch (no API).
 * Phase 7.3: replace the implementation body with the WhatsApp Business Cloud API
 *             while keeping this function as the single integration point.
 */
export async function sendBookingToWhatsApp(
  payload: BookingSubmissionPayload,
  referenceNumber: string,
): Promise<WhatsAppDispatchResult> {
  const message = formatBookingWhatsAppMessage(payload, referenceNumber);

  // Phase 7.3: call WhatsApp Business API here using businessPhoneNumber + message
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console -- dev preview of WhatsApp payload
    console.log('[sendBookingToWhatsApp]', message);
  }

  return { success: true };
}
