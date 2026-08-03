'use client';

import { useCallback, useState } from 'react';
import { BookingService } from '@/modules/booking/booking.service';
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

export function useBookingForm() {
  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [status, setStatus] = useState<BookingFormStatus>('idle');
  const [result, setResult] = useState<BookingSubmissionResult | null>(null);
  const [submittedPayload, setSubmittedPayload] = useState<BookingSubmissionPayload | null>(null);

  const updateField = useCallback(
    <K extends BookingFormField>(key: K, value: BookingFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
      if (status === 'success') {
        setStatus('idle');
        setResult(null);
        setSubmittedPayload(null);
      }
    },
    [status],
  );

  const submit = useCallback(async () => {
    const validationErrors = BookingService.validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('idle');
      return;
    }

    setStatus('submitting');
    setErrors({});

    try {
      const { result: submissionResult, payload } = await BookingService.submit(form);
      setResult(submissionResult);
      setSubmittedPayload(payload);
      setStatus('success');
    } catch {
      setStatus('error');
      setResult(null);
      setSubmittedPayload(null);
    }
  }, [form]);

  const reset = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus('idle');
    setResult(null);
    setSubmittedPayload(null);
  }, []);

  return {
    form,
    errors,
    status,
    result,
    submittedPayload,
    updateField,
    submit,
    reset,
    isSubmitting: status === 'submitting',
    isSuccess: status === 'success' && result !== null,
  };
}
