import type { BookingSubmissionPayload } from './booking.types';
import { getWhatsAppHref } from '@/lib/contact';

export interface WhatsAppDispatchResult {
  success: boolean;
  error?: string;
}

const WHATSAPP_UNAVAILABLE_ERROR =
  'Не вдалося відкрити WhatsApp. Дозвольте спливаючі вікна в браузері або напишіть нам напряму в WhatsApp.';

function formatLocalDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

/**
 * Formats the booking request as a WhatsApp message for the dispatcher.
 * Used by sendBookingToWhatsApp — keep in sync when fields change.
 */
export function formatBookingWhatsAppMessage(
  payload: BookingSubmissionPayload,
  referenceNumber: string,
): string {
  const notes = payload.additionalNotes?.trim() || '—';
  const localDateTime = formatLocalDateTime(payload.submittedAt);

  return [
    '🚚 НОВЕ ЗАМОВЛЕННЯ ЕВАКУАТОРА',
    '',
    "👤 Ім'я:",
    payload.customerName,
    '',
    '📞 Телефон:',
    payload.customerPhone,
    '',
    '📍 Адреса подачі:',
    payload.pickupAddress,
    '',
    '📍 Адреса доставки:',
    payload.destinationAddress,
    '',
    '🚗 Автомобіль:',
    payload.vehicleMakeModel,
    '',
    '📝 Коментар:',
    notes,
    '',
    '🆔 Номер заявки:',
    referenceNumber,
    '',
    '⏰ Час:',
    localDateTime,
  ].join('\n');
}

function tryOpenWhatsApp(url: string): boolean {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch {
    // Fall through to window.open.
  }

  try {
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    return popup !== null;
  } catch {
    return false;
  }
}

/**
 * Opens WhatsApp (wa.me) with a pre-filled booking message.
 * Uses wa.me + encodeURIComponent — no WhatsApp Business API.
 */
export async function sendBookingToWhatsApp(
  payload: BookingSubmissionPayload,
  referenceNumber: string,
): Promise<WhatsAppDispatchResult> {
  const message = formatBookingWhatsAppMessage(payload, referenceNumber);
  const url = getWhatsAppHref(message);

  if (typeof window === 'undefined') {
    return { success: false, error: WHATSAPP_UNAVAILABLE_ERROR };
  }

  if (!tryOpenWhatsApp(url)) {
    return { success: false, error: WHATSAPP_UNAVAILABLE_ERROR };
  }

  return { success: true };
}
