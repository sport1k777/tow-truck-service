import { calculateEstimatedArrival } from './booking.eta';
import type { BookingQuoteSnapshot, BookingSubmissionResult } from './booking.types';

export function generateReferenceNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `TT-${y}${m}${d}-${seq}`;
}

export async function simulateBookingProcessing(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 900));
}

export function finalizeQuoteSnapshot(quote: BookingQuoteSnapshot): BookingQuoteSnapshot {
  const estimatedArrivalAt = calculateEstimatedArrival(quote.durationMinutes).toISOString();

  return {
    ...quote,
    estimatedArrivalAt,
  };
}

export function buildSubmissionResult(
  referenceNumber: string,
  extras: {
    quote: BookingQuoteSnapshot;
    whatsappUrl: string;
  },
): BookingSubmissionResult {
  return {
    orderId: null,
    referenceNumber,
    message: 'Наш диспетчер зв\'яжеться з вами найближчим часом.',
    quote: finalizeQuoteSnapshot(extras.quote),
    whatsappUrl: extras.whatsappUrl,
  };
}
