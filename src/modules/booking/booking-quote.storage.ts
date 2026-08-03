import type { BookingFormState, BookingQuoteSnapshot } from './booking.types';

const QUOTE_STORAGE_KEY = 'tow-truck:booking-quote';
const FORM_DRAFT_STORAGE_KEY = 'tow-truck:booking-form-draft';

export interface StoredCalculatorQuote {
  pickupAddress: string;
  destinationAddress: string;
  distanceKm: number;
  durationMinutes: number;
  estimatedPrice: number;
  currency: string;
  currencySymbol: string;
  mapsAvailable: boolean;
  savedAt: string;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function persistCalculatorQuote(quote: Omit<StoredCalculatorQuote, 'savedAt'>): void {
  if (!isBrowser()) {
    return;
  }

  const payload: StoredCalculatorQuote = {
    ...quote,
    savedAt: new Date().toISOString(),
  };

  try {
    sessionStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / private mode errors — booking still works.
  }
}

export function loadStoredCalculatorQuote(): StoredCalculatorQuote | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredCalculatorQuote;
    if (
      typeof parsed.distanceKm !== 'number' ||
      typeof parsed.estimatedPrice !== 'number' ||
      !parsed.pickupAddress ||
      !parsed.destinationAddress
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearStoredCalculatorQuote(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.removeItem(QUOTE_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function persistBookingFormDraft(form: BookingFormState): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.setItem(FORM_DRAFT_STORAGE_KEY, JSON.stringify(form));
  } catch {
    // Ignore storage errors.
  }
}

export function loadBookingFormDraft(): BookingFormState | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(FORM_DRAFT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as BookingFormState;
    if (typeof parsed.customerName !== 'string') {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearBookingFormDraft(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    sessionStorage.removeItem(FORM_DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export function storedQuoteToSnapshot(quote: StoredCalculatorQuote | null): BookingQuoteSnapshot {
  if (!quote) {
    return {
      distanceKm: null,
      durationMinutes: null,
      estimatedPrice: null,
      currency: 'UAH',
      currencySymbol: '₴',
      estimatedArrivalAt: null,
      mapsAvailable: false,
    };
  }

  return {
    distanceKm: quote.distanceKm,
    durationMinutes: quote.durationMinutes,
    estimatedPrice: quote.estimatedPrice,
    currency: quote.currency,
    currencySymbol: quote.currencySymbol,
    estimatedArrivalAt: null,
    mapsAvailable: quote.mapsAvailable,
  };
}

export function mergeQuoteAddressesIntoForm(
  form: BookingFormState,
  quote: StoredCalculatorQuote | null,
): BookingFormState {
  if (!quote) {
    return form;
  }

  return {
    ...form,
    pickupAddress: form.pickupAddress.trim() || quote.pickupAddress,
    destinationAddress: form.destinationAddress.trim() || quote.destinationAddress,
  };
}
