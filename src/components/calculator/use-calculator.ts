'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { persistCalculatorQuote } from '@/modules/booking/booking-quote.storage';
import { useMaps } from '@/modules/maps/maps-provider';
import { validateServiceAreaRoute } from '@/modules/maps/service-area';
import type { PlaceLocation } from '@/modules/maps/maps.types';
import { PRICING_VEHICLE_TYPES } from '@/modules/pricing/pricing.config';
import {
  calculateCalculatorQuote,
  calculateLivePrice,
} from './calculator.pricing';
import { useCalculatorConfig } from './calculator-config-context';
import {
  loadStoredCalculatorForm,
  persistCalculatorForm,
  storedCalculatorFormToState,
} from './calculator-form.storage';
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
  pickupAddressComponents: null,
  destinationAddress: '',
  destinationPlaceId: null,
  destinationLocation: null,
  destinationAddressComponents: null,
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

function buildAutoCalcKey(form: CalculatorFormState, distanceKm: number | null): string | null {
  if (!form.pickupPlaceId || !form.destinationPlaceId || distanceKm === null) {
    return null;
  }

  return [
    form.pickupPlaceId,
    form.destinationPlaceId,
    distanceKm,
    form.vehicleType,
    form.isEmergencyDispatch,
    form.isDifficultLoading,
  ].join(':');
}

export function useCalculator() {
  const { isConfigured, status: mapsStatus } = useMaps();
  const { pricingConfig, serviceAreaConfig } = useCalculatorConfig();
  const [form, setForm] = useState<CalculatorFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<CalculatorFormErrors>({});
  const [status, setStatus] = useState<CalculatorStatus>('idle');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const lastAutoCalcKeyRef = useRef<string | null>(null);

  const { route, routeStatus, routeError, distanceKm, durationMinutes } = useCalculatorRoute({
    pickupAddress: form.pickupAddress,
    destinationAddress: form.destinationAddress,
    pickupPlaceId: form.pickupPlaceId,
    pickupLocation: form.pickupLocation,
    destinationPlaceId: form.destinationPlaceId,
    destinationLocation: form.destinationLocation,
  });

  const serviceAreaValidation = useMemo(
    () =>
      validateServiceAreaRoute(
        {
          pickupPlaceId: form.pickupPlaceId,
          destinationPlaceId: form.destinationPlaceId,
          pickupComponents: form.pickupAddressComponents,
          destinationComponents: form.destinationAddressComponents,
          pickupLocation: form.pickupLocation,
          destinationLocation: form.destinationLocation,
        },
        serviceAreaConfig,
      ),
    [
      form.pickupPlaceId,
      form.destinationPlaceId,
      form.pickupAddressComponents,
      form.destinationAddressComponents,
      form.pickupLocation,
      form.destinationLocation,
      serviceAreaConfig,
    ],
  );

  const livePrice = useMemo(() => {
    if (serviceAreaValidation.isBlocked) {
      return null;
    }

    return calculateLivePrice(form, distanceKm, pricingConfig);
  }, [form, distanceKm, serviceAreaValidation.isBlocked, pricingConfig]);

  const clearTransientErrors = useCallback(() => {
    setErrors({});
    lastAutoCalcKeyRef.current = null;
  }, []);

  const resetCalculationState = useCallback(() => {
    setStatus('idle');
    setResult(null);
    lastAutoCalcKeyRef.current = null;
  }, []);

  useEffect(() => {
    const stored = loadStoredCalculatorForm();
    if (stored) {
      setForm(storedCalculatorFormToState(stored));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    persistCalculatorForm(form);
  }, [form, isHydrated]);

  useEffect(() => {
    if (serviceAreaValidation.isBlocked) {
      setErrors((prev) => ({
        ...prev,
        serviceArea: serviceAreaValidation.message ?? undefined,
      }));
      resetCalculationState();
      return;
    }

    setErrors((prev) => ({ ...prev, serviceArea: undefined }));
  }, [serviceAreaValidation.isBlocked, serviceAreaValidation.message, resetCalculationState]);

  useEffect(() => {
    if (serviceAreaValidation.isBlocked) {
      return;
    }

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
    serviceAreaValidation.isBlocked,
  ]);

  const executeCalculation = useCallback(
    async (options: { silent?: boolean } = {}) => {
      const validationErrors = validateForm(form);
      if (Object.keys(validationErrors).length > 0) {
        if (!options.silent) {
          setErrors(validationErrors);
        }
        return false;
      }

      if (serviceAreaValidation.isBlocked) {
        if (!options.silent) {
          setErrors({ serviceArea: serviceAreaValidation.message ?? undefined });
        }
        return false;
      }

      if (isConfigured && mapsStatus === 'ready') {
        if (routeStatus === 'calculating') {
          if (!options.silent) {
            setErrors({ route: 'Зачекайте, поки маршрут буде побудовано' });
          }
          return false;
        }

        if (routeStatus === 'error' || !route) {
          if (!options.silent) {
            setErrors({
              route: routeError ?? 'Не вдалося побудувати маршрут. Перевірте адреси.',
            });
          }
          return false;
        }
      } else if (isConfigured) {
        if (!options.silent) {
          setErrors({ route: 'Зачекайте, поки карта завантажиться' });
        }
        return false;
      } else {
        if (!options.silent) {
          setErrors({
            route: 'Додайте NEXT_PUBLIC_GOOGLE_MAPS_API_KEY для автоматичного розрахунку маршруту.',
          });
        }
        return false;
      }

      const price = calculateLivePrice(form, distanceKm, pricingConfig);
      if (!price || !route) {
        if (!options.silent) {
          setErrors({ route: 'Не вдалося розрахувати вартість для цього маршруту.' });
        }
        return false;
      }

      setStatus('calculating');
      setErrors({});

      try {
        const quote = await calculateCalculatorQuote(form, price, route, serviceAreaConfig);
        setResult(quote);
        setStatus('success');

        void fetch('/api/analytics/calculation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pickupAddress: form.pickupAddress.trim(),
            destinationAddress: form.destinationAddress.trim(),
            pickupLat: form.pickupLocation?.lat,
            pickupLng: form.pickupLocation?.lng,
            destinationLat: form.destinationLocation?.lat,
            destinationLng: form.destinationLocation?.lng,
            distanceKm: route.route.distanceKm,
            estimatedPrice: price.total,
            vehicleType: form.vehicleType,
          }),
        }).catch(() => undefined);

        return true;
      } catch {
        setStatus('error');
        setResult(null);
        return false;
      }
    },
    [
      form,
      isConfigured,
      mapsStatus,
      route,
      routeError,
      routeStatus,
      distanceKm,
      serviceAreaValidation,
      pricingConfig,
      serviceAreaConfig,
    ],
  );

  useEffect(() => {
    const autoCalcKey = buildAutoCalcKey(form, distanceKm);
    if (
      !autoCalcKey ||
      serviceAreaValidation.isBlocked ||
      routeStatus !== 'ready' ||
      !route ||
      !livePrice ||
      status === 'calculating'
    ) {
      return;
    }

    if (lastAutoCalcKeyRef.current === autoCalcKey) {
      return;
    }

    lastAutoCalcKeyRef.current = autoCalcKey;
    void executeCalculation({ silent: true });
  }, [
    form,
    distanceKm,
    serviceAreaValidation.isBlocked,
    routeStatus,
    route,
    livePrice,
    status,
    executeCalculation,
  ]);

  const updateField = useCallback(
    <K extends keyof CalculatorFormState>(key: K, value: CalculatorFormState[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };

        if (key === 'pickupAddress') {
          next.pickupPlaceId = null;
          next.pickupLocation = null;
          next.pickupAddressComponents = null;
        }

        if (key === 'destinationAddress') {
          next.destinationPlaceId = null;
          next.destinationLocation = null;
          next.destinationAddressComponents = null;
        }

        return next;
      });

      if (key === 'pickupAddress' || key === 'destinationAddress') {
        clearTransientErrors();
        resetCalculationState();
        return;
      }

      setErrors((prev) => ({ ...prev, [key]: undefined }));
      if (status === 'success') {
        resetCalculationState();
      }
    },
    [clearTransientErrors, resetCalculationState, status],
  );

  const setPickupPlace = useCallback(
    (place: PlaceLocation) => {
      setForm((prev) => ({
        ...prev,
        pickupAddress: place.address,
        pickupPlaceId: place.placeId,
        pickupLocation: place.location,
        pickupAddressComponents: place.addressComponents,
      }));
      clearTransientErrors();
      resetCalculationState();
    },
    [clearTransientErrors, resetCalculationState],
  );

  const setDestinationPlace = useCallback(
    (place: PlaceLocation) => {
      setForm((prev) => ({
        ...prev,
        destinationAddress: place.address,
        destinationPlaceId: place.placeId,
        destinationLocation: place.location,
        destinationAddressComponents: place.addressComponents,
      }));
      clearTransientErrors();
      resetCalculationState();
    },
    [clearTransientErrors, resetCalculationState],
  );

  const swapAddresses = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      pickupAddress: prev.destinationAddress,
      pickupPlaceId: prev.destinationPlaceId,
      pickupLocation: prev.destinationLocation,
      pickupAddressComponents: prev.destinationAddressComponents,
      destinationAddress: prev.pickupAddress,
      destinationPlaceId: prev.pickupPlaceId,
      destinationLocation: prev.pickupLocation,
      destinationAddressComponents: prev.pickupAddressComponents,
    }));
    clearTransientErrors();
    resetCalculationState();
  }, [clearTransientErrors, resetCalculationState]);

  const calculate = useCallback(async () => {
    await executeCalculation();
  }, [executeCalculation]);

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
    swapAddresses,
    calculate,
    isCalculating: status === 'calculating',
    hasResult: status === 'success' && result !== null,
    isCalculatingRoute: routeStatus === 'calculating',
    isServiceAreaBlocked: serviceAreaValidation.isBlocked,
    isHydrated,
  };
}
