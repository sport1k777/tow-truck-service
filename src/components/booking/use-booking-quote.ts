'use client';

import { useMemo } from 'react';
import type { BookingFormState, BookingQuoteSnapshot } from '@/modules/booking/booking.types';
import {
  loadStoredCalculatorQuote,
  storedQuoteToSnapshot,
  type StoredCalculatorQuote,
} from '@/modules/booking/booking-quote.storage';

function isQuoteMatchingForm(quote: StoredCalculatorQuote, form: BookingFormState): boolean {
  return (
    quote.pickupAddress.trim().toLowerCase() === form.pickupAddress.trim().toLowerCase() &&
    quote.destinationAddress.trim().toLowerCase() === form.destinationAddress.trim().toLowerCase()
  );
}

export function useBookingQuote(form: BookingFormState) {
  const storedQuote = useMemo(() => loadStoredCalculatorQuote(), []);

  const activeStoredQuote = useMemo(() => {
    if (!storedQuote) {
      return null;
    }

    if (!form.pickupAddress.trim() || !form.destinationAddress.trim()) {
      return storedQuote;
    }

    return isQuoteMatchingForm(storedQuote, form) ? storedQuote : null;
  }, [storedQuote, form]);

  const isQuoteStale = Boolean(
    storedQuote &&
      form.pickupAddress.trim() &&
      form.destinationAddress.trim() &&
      !isQuoteMatchingForm(storedQuote, form),
  );

  const quoteSnapshot: BookingQuoteSnapshot = useMemo(
    () => storedQuoteToSnapshot(activeStoredQuote),
    [activeStoredQuote],
  );

  const mapsUnavailable = storedQuote !== null && !storedQuote.mapsAvailable;
  const hasQuote = activeStoredQuote !== null;

  return {
    quoteSnapshot,
    hasQuote,
    isQuoteStale,
    mapsUnavailable,
    noQuoteAvailable: storedQuote === null,
  };
}
