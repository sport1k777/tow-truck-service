import type {
  BookingDispatchResult,
  BookingSubmissionPayload,
  BookingSubmissionResult,
} from './booking.types';
import { BOOKING_DISPATCH_TARGETS } from './booking.types';

function generateReferenceNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `TT-${y}${m}${d}-${seq}`;
}

/**
 * Phase 7.1 placeholder — simulates order creation latency.
 * Phase 7.2+: replace with createOrderAction + real dispatch pipeline.
 */
export async function placeholderSubmitBooking(
  _payload: BookingSubmissionPayload,
): Promise<BookingSubmissionResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    orderId: null,
    referenceNumber: generateReferenceNumber(),
    message: 'Заявку прийнято. Диспетчер звʼяжеться з вами найближчим часом.',
  };
}

/**
 * Phase 7.2+: route to WhatsApp Business, AI dispatcher, and admin notifications.
 */
export async function placeholderDispatchBooking(
  _payload: BookingSubmissionPayload,
): Promise<BookingDispatchResult[]> {
  return [
    { target: BOOKING_DISPATCH_TARGETS.DATABASE, success: true },
    { target: BOOKING_DISPATCH_TARGETS.WHATSAPP, success: true },
    { target: BOOKING_DISPATCH_TARGETS.AI_DISPATCHER, success: true },
    { target: BOOKING_DISPATCH_TARGETS.ADMIN_DASHBOARD, success: true },
  ];
}
