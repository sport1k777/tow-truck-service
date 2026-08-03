'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { persistCalculatorQuote } from '@/modules/booking/booking-quote.storage';
import { useMaps } from '@/modules/maps/maps-provider';
import type { PlaceLocation } from '@/modules/maps/maps.types';
import { PRICING_VEHICLE_TYPES } from '@/modules/pricing/pricing.config';
import {
  calculateCalculatorQuote,
  calculateLivePrice,
} from './calculator.pricing';
import { useCalculatorRoute } from './use-calculator-route';
import type {
  CalculatorFormErrors,
  CalculatorFormState,
  CalculatorResult,
  CalculatorStatus,
} from './calculator.types';

const INITIAL_FORM: CalculatorFormState = {
  pickupAddress: '',
  pickupPlaceId: null,
  pickupLocation: null,
  destinationAddress: '',
  destinationPlaceId: null,
  destinationLocation: null,
  vehicleType: PRICING_VEHICLE_TYPES.PASSENGER_CAR,
  isEmergencyDispatch: false,
  isDifficultLoading: false,
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
  const { isConfigured, status: mapsStatus } = useMaps();
  const [form, setForm] = useState<CalculatorFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<CalculatorFormErrors>({});
  const [status, setStatus] = useState<CalculatorStatus>('idle');
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const { route, routeStatus, routeError, distanceKm, durationMinutes } = useCalculatorRoute({
    pickupAddress: form.pickupAddress,
    destinationAddress: form.destinationAddress,
    pickupPlaceId: form.pickupPlaceId,
    pickupLocation: form.pickupLocation,
    destinationPlaceId: form.destinationPlaceId,
    destinationLocation: form.destinationLocation,
  });

  const livePrice = useMemo(
    () => calculateLivePrice(form, distanceKm),
    [form, distanceKm],
  );

  useEffect(() => {
    if (livePrice && distanceKm !== null && durationMinutes !== null) {
      persistCalculatorQuote({
        pickupAddress: form.pickupAddress.trim(),
        destinationAddress: form.destinationAddress.trim(),
        distanceKm,
        durationMinutes,
        estimatedPrice: livePrice.total,
        currency: livePrice.currency,
        currencySymbol: livePrice.currencySymbol,
        mapsAvailable: isConfigured && mapsStatus === 'ready',
      });
    }
  }, [
    livePrice,
    distanceKm,
    durationMinutes,
    form.pickupAddress,
    form.destinationAddress,
    isConfigured,
    mapsStatus,
  ]);

  const updateField = useCallback(
    <K extends keyof CalculatorFormState>(key: K, value: CalculatorFormState[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };

        if (key === 'pickupAddress') {
          next.pickupPlaceId = null;
          next.pickupLocation = null;
        }

        if (key === 'destinationAddress') {
          next.destinationPlaceId = null;
          next.destinationLocation = null;
        }

        return next;
      });
      setErrors((prev) => ({ ...prev, [key]: undefined, route: undefined }));
      if (
        status === 'success' &&
        (key === 'pickupAddress' || key === 'destinationAddress')
      ) {
        setStatus('idle');
        setResult(null);
      }
    },
    [status],
  );

  const setPickupPlace = useCallback((place: PlaceLocation) => {
    setForm((prev) => ({
      ...prev,
      pickupAddress: place.address,
      pickupPlaceId: place.placeId,
      pickupLocation: place.location,
    }));
    setErrors((prev) => ({ ...prev, pickupAddress: undefined, route: undefined }));
  }, []);

  const setDestinationPlace = useCallback((place: PlaceLocation) => {
    setForm((prev) => ({
      ...prev,
      destinationAddress: place.address,
      destinationPlaceId: place.placeId,
      destinationLocation: place.location,
    }));
    setErrors((prev) => ({ ...prev, destinationAddress: undefined, route: undefined }));
  }, []);

  const calculate = useCallback(async () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isConfigured && mapsStatus === 'ready') {
      if (routeStatus === 'calculating') {
        setErrors({ route: 'Зачекайте, поки маршрут буде побудовано' });
        return;
      }

      if (routeStatus === 'error' || !route) {
        setErrors({
          route: routeError ?? 'Не вдалося побудувати маршрут. Перевірте адреси.',
        });
        return;
      }
    } else if (isConfigured) {
      setErrors({ route: 'Зачекайте, поки карта завантажиться' });
      return;
    } else {
      setErrors({
        route: 'Додайте NEXT_PUBLIC_GOOGLE_MAPS_API_KEY для автоматичного розрахунку маршруту.',
      });
      return;
    }

    const price = calculateLivePrice(form, distanceKm);
    if (!price || !route) {
      setErrors({ route: 'Не вдалося розрахувати вартість для цього маршруту.' });
      return;
    }

    setStatus('calculating');
    setErrors({});

    try {
      const quote = await calculateCalculatorQuote(form, price, route);
      setResult(quote);
      setStatus('success');
    } catch {
      setStatus('error');
      setResult(null);
    }
  }, [form, isConfigured, mapsStatus, route, routeError, routeStatus, distanceKm]);

  return {
    form,
    errors,
    status,
    result,
    route,
    routeStatus,
    routeError,
    livePrice,
    displayDistanceKm: distanceKm,
    displayDurationMinutes: durationMinutes,
    updateField,
    setPickupPlace,
    setDestinationPlace,
    calculate,
    isCalculating: status === 'calculating',
    hasResult: status === 'success' && result !== null,
    isCalculatingRoute: routeStatus === 'calculating',
  };
}
