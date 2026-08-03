'use client';

import { useCallback, useState } from 'react';
import { VEHICLE_TYPES } from '@/lib/constants';
import { placeholderCalculateQuote } from './calculator.placeholder';
import type {
  CalculatorFormErrors,
  CalculatorFormState,
  CalculatorResult,
  CalculatorStatus,
} from './calculator.types';

const INITIAL_FORM: CalculatorFormState = {
  pickupAddress: '',
  destinationAddress: '',
  vehicleType: VEHICLE_TYPES.PASSENGER_CAR,
  comments: '',
};

function validateForm(form: CalculatorFormState): CalculatorFormErrors {
  const errors: CalculatorFormErrors = {};

  if (!form.pickupAddress.trim()) {
    errors.pickupAddress = 'Вкажіть адресу забору';
  } else if (form.pickupAddress.trim().length < 5) {
    errors.pickupAddress = 'Адреса занадто коротка';
  }

  if (!form.destinationAddress.trim()) {
    errors.destinationAddress = 'Вкажіть адресу призначення';
  } else if (form.destinationAddress.trim().length < 5) {
    errors.destinationAddress = 'Адреса занадто коротка';
  }

  if (
    form.pickupAddress.trim() &&
    form.destinationAddress.trim() &&
    form.pickupAddress.trim().toLowerCase() === form.destinationAddress.trim().toLowerCase()
  ) {
    errors.destinationAddress = 'Оберіть іншу адресу призначення';
  }

  return errors;
}

export function useCalculator() {
  const [form, setForm] = useState<CalculatorFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<CalculatorFormErrors>({});
  const [status, setStatus] = useState<CalculatorStatus>('idle');
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const updateField = useCallback(
    <K extends keyof CalculatorFormState>(key: K, value: CalculatorFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
      if (status === 'success') {
        setStatus('idle');
        setResult(null);
      }
    },
    [status],
  );

  const calculate = useCallback(async () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('calculating');
    setErrors({});

    try {
      // Phase 7: replace with parallel calls to
      // POST /api/v1/maps/directions + calculatePriceAction
      const quote = await placeholderCalculateQuote(form);
      setResult(quote);
      setStatus('success');
    } catch {
      setStatus('error');
      setResult(null);
    }
  }, [form]);

  return {
    form,
    errors,
    status,
    result,
    updateField,
    calculate,
    isCalculating: status === 'calculating',
    hasResult: status === 'success' && result !== null,
  };
}
