import { getWhatsAppHref } from '@/lib/contact';
import {
  buildSubmissionResult,
  generateReferenceNumber,
  simulateBookingProcessing,
} from './booking.placeholder';
import { formatBookingWhatsAppMessage, sendBookingToWhatsApp } from './booking.whatsapp';
import { toBookingSubmissionPayload, validateBookingForm } from './booking.validation';
import type {
  BookingFormErrors,
  BookingFormState,
  BookingQuoteSnapshot,
  BookingSubmissionPayload,
  BookingSubmissionResult,
} from './booking.types';

/**
 * Client-side booking workflow.
 * Phase 8+: persist via createOrderAction before WhatsApp dispatch.
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
   * Submit a booking: validate → process → open WhatsApp with order details.
   */
  static async submit(
    form: BookingFormState,
    quote: BookingQuoteSnapshot,
  ): Promise<{
    result: BookingSubmissionResult;
    payload: BookingSubmissionPayload;
  }> {
    const errors = this.validate(form);
    if (Object.keys(errors).length > 0) {
      throw new Error('VALIDATION_ERROR');
    }

    const payload = this.buildPayload(form);
    const referenceNumber = generateReferenceNumber();
    const whatsappMessage = formatBookingWhatsAppMessage(payload, referenceNumber);
    const whatsappUrl = getWhatsAppHref(whatsappMessage);

    await simulateBookingProcessing();

    const whatsappResult = await sendBookingToWhatsApp(payload, referenceNumber);
    if (!whatsappResult.success) {
      throw new Error(whatsappResult.error ?? 'WHATSAPP_DISPATCH_FAILED');
    }

    return {
      result: buildSubmissionResult(referenceNumber, { quote, whatsappUrl }),
      payload,
    };
  }
}
