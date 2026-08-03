'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BookingService } from '@/modules/booking/booking.service';
import {
  clearBookingFormDraft,
  clearStoredCalculatorQuote,
  loadBookingFormDraft,
  mergeQuoteAddressesIntoForm,
  persistBookingFormDraft,
  loadStoredCalculatorQuote,
} from '@/modules/booking/booking-quote.storage';
import { useBookingQuote } from './use-booking-quote';
import type {
  BookingFormErrors,
  BookingFormField,
  BookingFormState,
  BookingFormStatus,
  BookingSubmissionPayload,
  BookingSubmissionResult,
} from '@/modules/booking/booking.types';

const INITIAL_FORM: BookingFormState = {
  customerName: '',
  customerPhone: '',
  pickupAddress: '',
  destinationAddress: '',
  vehicleMakeModel: '',
  additionalNotes: '',
};

function loadInitialForm(): BookingFormState {
  const draft = loadBookingFormDraft();
  const quote = loadStoredCalculatorQuote();
  const base = draft ?? INITIAL_FORM;
  return mergeQuoteAddressesIntoForm(base, quote);
}

export function useBookingForm() {
  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM);
  const [isHydrated, setIsHydrated] = useState(false);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [status, setStatus] = useState<BookingFormStatus>('idle');
  const [result, setResult] = useState<BookingSubmissionResult | null>(null);
  const [submittedPayload, setSubmittedPayload] = useState<BookingSubmissionPayload | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitInFlightRef = useRef(false);

  const { quoteSnapshot, hasQuote, isQuoteStale, mapsUnavailable, noQuoteAvailable } =
    useBookingQuote(form);

  useEffect(() => {
    setForm(loadInitialForm());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || status === 'success' || status === 'submitting') {
      return;
    }

    persistBookingFormDraft(form);
  }, [form, isHydrated, status]);

  const updateField = useCallback(
    <K extends BookingFormField>(key: K, value: BookingFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  const submit = useCallback(async () => {
    if (submitInFlightRef.current || status === 'submitting') {
      return;
    }

    const validationErrors = BookingService.validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('idle');
      return;
    }

    submitInFlightRef.current = true;
    setStatus('submitting');
    setErrors({});
    setSubmitError(null);

    try {
      const { result: submissionResult, payload } = await BookingService.submit(form, quoteSnapshot);
      setResult(submissionResult);
      setSubmittedPayload(payload);
      setStatus('success');
      clearBookingFormDraft();
      clearStoredCalculatorQuote();
    } catch (error) {
      setStatus('error');
      setResult(null);
      setSubmittedPayload(null);
      setSubmitError(
        error instanceof Error && error.message !== 'VALIDATION_ERROR'
          ? error.message
          : 'Не вдалося надіслати заявку. Перевірте дані та спробуйте ще раз.',
      );
    } finally {
      submitInFlightRef.current = false;
    }
  }, [form, quoteSnapshot, status]);

  const reset = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus('idle');
    setResult(null);
    setSubmittedPayload(null);
    setSubmitError(null);
    submitInFlightRef.current = false;
    clearBookingFormDraft();
  }, []);

  return {
    form,
    errors,
    status,
    result,
    submittedPayload,
    submitError,
    quoteSnapshot,
    hasQuote,
    isQuoteStale,
    mapsUnavailable,
    noQuoteAvailable,
    isHydrated,
    updateField,
    submit,
    reset,
    isSubmitting: status === 'submitting',
    isSuccess: status === 'success' && result !== null,
  };
}
