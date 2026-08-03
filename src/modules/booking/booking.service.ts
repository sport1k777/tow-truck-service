import { logger } from '@/lib/logger';
import { placeholderDispatchBooking, placeholderSubmitBooking } from './booking.placeholder';
import { toBookingSubmissionPayload, validateBookingForm } from './booking.validation';
import type {
  BookingDispatchResult,
  BookingFormErrors,
  BookingFormState,
  BookingSubmissionPayload,
  BookingSubmissionResult,
} from './booking.types';

/**
 * Booking orchestration layer.
 * Phase 7.2+: wire createOrderAction, NotificationsService, and AI dispatcher here.
 */
export class BookingService {
  static validate(form: BookingFormState): BookingFormErrors {
    return validateBookingForm(form);
  }

  static buildPayload(form: BookingFormState): BookingSubmissionPayload {
    const normalized = toBookingSubmissionPayload(form);

    return {
      customerName: normalized.customerName,
      customerPhone: normalized.customerPhone,
      pickupAddress: normalized.pickupAddress,
      destinationAddress: normalized.destinationAddress,
      vehicleMakeModel: normalized.vehicleMakeModel,
      additionalNotes: normalized.additionalNotes?.trim() || null,
      submittedAt: new Date().toISOString(),
      source: 'web_booking_form',
    };
  }

  /**
   * Submit a booking request.
   * Future: persist order, notify WhatsApp, trigger AI dispatcher, update admin dashboard.
   */
  static async submit(form: BookingFormState): Promise<{
    result: BookingSubmissionResult;
    dispatch: BookingDispatchResult[];
  }> {
    const errors = this.validate(form);
    if (Object.keys(errors).length > 0) {
      throw new Error('VALIDATION_ERROR');
    }

    const payload = this.buildPayload(form);

    logger.info('Booking submission received', {
      module: 'booking',
      action: 'submit',
      metadata: {
        source: payload.source,
        pickup: payload.pickupAddress,
        destination: payload.destinationAddress,
      },
    });

    const [result, dispatch] = await Promise.all([
      placeholderSubmitBooking(payload),
      placeholderDispatchBooking(payload),
    ]);

    return { result, dispatch };
  }
}
