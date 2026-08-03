import type { BookingSubmissionPayload, BookingSubmissionResult } from './booking.types';

export function generateReferenceNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `TT-${y}${m}${d}-${seq}`;
}

export async function simulateBookingProcessing(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));
}

export function buildSubmissionResult(referenceNumber: string): BookingSubmissionResult {
  return {
    orderId: null,
    referenceNumber,
    message:
      'Заявку надіслано диспетчеру. Очікуйте дзвінок для підтвердження — евакуатор буде у шляху найближчим часом.',
  };
}

export type { BookingSubmissionPayload };
