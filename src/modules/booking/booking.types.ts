/**
 * Booking module — form state and submission contracts.
 * Maps to CreateOrderInput once geocoding, pricing, and persistence are wired in Phase 7.2+.
 */

/** Client-side booking form — Phase 7.1 */
export interface BookingFormState {
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  destinationAddress: string;
  vehicleMakeModel: string;
  additionalNotes: string;
}

export type BookingFormField = keyof BookingFormState;

export type BookingFormErrors = Partial<Record<BookingFormField, string>>;

export type BookingFormStatus = 'idle' | 'submitting' | 'success' | 'error';

/** Normalized payload passed to BookingService — ready for server actions & integrations */
export interface BookingSubmissionPayload {
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  destinationAddress: string;
  vehicleMakeModel: string;
  additionalNotes: string | null;
  submittedAt: string;
  source: 'web_booking_form';
}

/** Future dispatch targets — WhatsApp Business, AI Dispatcher, Admin Dashboard */
export const BOOKING_DISPATCH_TARGETS = {
  DATABASE: 'database',
  WHATSAPP: 'whatsapp',
  AI_DISPATCHER: 'ai_dispatcher',
  ADMIN_DASHBOARD: 'admin_dashboard',
} as const;

export type BookingDispatchTarget =
  (typeof BOOKING_DISPATCH_TARGETS)[keyof typeof BOOKING_DISPATCH_TARGETS];

export interface BookingSubmissionResult {
  referenceNumber: string;
  message: string;
  /** Placeholder until createOrderAction returns real order id */
  orderId: string | null;
}

export interface BookingDispatchResult {
  target: BookingDispatchTarget;
  success: boolean;
  error?: string;
}
