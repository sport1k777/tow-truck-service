'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useMaps } from '@/modules/maps/maps-provider';
import { MAPS_GEOLOCATION_DENIED_MESSAGE } from '@/modules/maps/maps.config';
import {
  createAutocompleteSessionToken,
  fetchAddressSuggestions,
  getBrowserGeolocation,
  resolvePlaceFromSuggestion,
  reverseGeocodeCoordinates,
} from '@/modules/maps/maps.service';
import type { AddressSuggestionSelection } from '@/modules/maps/maps.types';
import type { PlaceLocation } from '@/modules/maps/maps.types';

interface AddressAutocompleteProps {
  id: string;
  label: string;
  icon: LucideIcon;
  iconClassName?: string;
  value: string;
  placeholder: string;
  error?: string;
  showLocationButton?: boolean;
  onAddressChange: (address: string) => void;
  onPlaceSelect: (place: PlaceLocation) => void;
  onGeolocationSelect?: (location: PlaceLocation) => void;
}

const SUGGESTION_DEBOUNCE_MS = 300;

export function AddressAutocomplete({
  id,
  label,
  icon: Icon,
  iconClassName,
  value,
  placeholder,
  error,
  showLocationButton = false,
  onAddressChange,
  onPlaceSelect,
  onGeolocationSelect,
}: AddressAutocompleteProps) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const { status, google } = useMaps();
  const [suggestions, setSuggestions] = useState<AddressSuggestionSelection[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const displayError = locationError ?? error;

  const resetSessionToken = useCallback(() => {
    if (!google) {
      sessionTokenRef.current = null;
      return;
    }

    sessionTokenRef.current = createAutocompleteSessionToken(google);
  }, [google]);

  const closeSuggestions = useCallback(() => {
    setSuggestions([]);
    setActiveIndex(-1);
    setIsOpen(false);
  }, []);

  const loadSuggestions = useCallback(
    async (input: string) => {
      if (status !== 'ready' || !google) {
        closeSuggestions();
        return;
      }

      const trimmedInput = input.trim();
      if (trimmedInput.length < 2) {
        closeSuggestions();
        return;
      }

      if (!sessionTokenRef.current) {
        resetSessionToken();
      }

      const token = sessionTokenRef.current;
      if (!token) {
        return;
      }

      const requestId = ++requestIdRef.current;

      try {
        const nextSuggestions = await fetchAddressSuggestions(google, trimmedInput, token);

        if (requestId !== requestIdRef.current) {
          return;
        }

        setSuggestions(nextSuggestions);
        setActiveIndex(nextSuggestions.length > 0 ? 0 : -1);
        setIsOpen(nextSuggestions.length > 0);
      } catch {
        if (requestId !== requestIdRef.current) {
          return;
        }

        closeSuggestions();
      }
    },
    [closeSuggestions, google, resetSessionToken, status],
  );

  const selectSuggestion = useCallback(
    async (selection: AddressSuggestionSelection) => {
      if (!google || isResolving) {
        return;
      }

      setIsResolving(true);
      closeSuggestions();
      onAddressChange(selection.suggestion.description);

      try {
        const parsed = await resolvePlaceFromSuggestion(selection.placePrediction);
        if (parsed) {
          onPlaceSelect(parsed);
        }
      } catch {
        // Keep the selected description in the input when place details fail.
      } finally {
        setIsResolving(false);
        resetSessionToken();
      }
    },
    [closeSuggestions, google, isResolving, onAddressChange, onPlaceSelect, resetSessionToken],
  );

  const handleLocationClick = useCallback(async () => {
    if (isResolving || isLocating) {
      return;
    }

    setLocationError(null);
    setIsLocating(true);
    closeSuggestions();

    try {
      if (status !== 'ready' || !google) {
        return;
      }

      const position = await getBrowserGeolocation();
      const coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const place = await reverseGeocodeCoordinates(google, coordinates);
      const resolvedPlace: PlaceLocation =
        place ?? {
          address: `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`,
          placeId: null,
          location: coordinates,
          addressComponents: [],
        };

      onAddressChange(resolvedPlace.address);
      onPlaceSelect(resolvedPlace);
      onGeolocationSelect?.(resolvedPlace);
    } catch (caughtError) {
      if (
        caughtError instanceof GeolocationPositionError &&
        caughtError.code === GeolocationPositionError.PERMISSION_DENIED
      ) {
        setLocationError(MAPS_GEOLOCATION_DENIED_MESSAGE);
      }
    } finally {
      setIsLocating(false);
    }
  }, [
    closeSuggestions,
    google,
    isLocating,
    isResolving,
    onAddressChange,
    onGeolocationSelect,
    onPlaceSelect,
    status,
  ]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return;
    }

    document.getElementById(`${listboxId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen, listboxId]);

  useEffect(() => {
    if (status === 'ready' && google && !sessionTokenRef.current) {
      resetSessionToken();
    }
  }, [google, resetSessionToken, status]);

  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeSuggestions();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [closeSuggestions]);

  const handleInputChange = (nextValue: string) => {
    if (locationError) {
      setLocationError(null);
    }

    onAddressChange(nextValue);

    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      void loadSuggestions(nextValue);
    }, SUGGESTION_DEBOUNCE_MS);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      void selectSuggestion(suggestions[activeIndex]);
      return;
    }

    if (event.key === 'Escape') {
      closeSuggestions();
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-white/80">
        <Icon className={`h-4 w-4 ${iconClassName ?? 'text-white/50'}`} aria-hidden="true" />
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.trim().length >= 2) {
              void loadSuggestions(value);
            } else if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={
            isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${id}-error` : undefined}
          disabled={isResolving || isLocating}
          className={`calculator-input w-full${showLocationButton ? ' calculator-input--with-action' : ''}`}
        />
        {showLocationButton ? (
          <button
            type="button"
            className="calculator-input-location-btn"
            onClick={() => {
              void handleLocationClick();
            }}
            disabled={isResolving || isLocating}
            aria-label="Визначити поточне місцезнаходження"
            title="Визначити поточне місцезнаходження"
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <span aria-hidden="true">📍</span>
            )}
          </button>
        ) : null}
      </div>
      {isOpen && suggestions.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          className="pac-container pac-container--anchored absolute left-0 right-0 top-full z-[10000]"
        >
          {suggestions.map((selection, index) => (
            <button
              key={selection.suggestion.placeId}
              id={`${listboxId}-option-${index}`}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={`pac-item block w-full text-left ${index === activeIndex ? 'pac-item-selected' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                void selectSuggestion(selection);
              }}
            >
              <span className="pac-item-query">{selection.suggestion.mainText}</span>
              {selection.suggestion.secondaryText ? (
                <span>{` ${selection.suggestion.secondaryText}`}</span>
              ) : null}
            </button>
          ))}
        </div>
      )}
      {displayError && (
        <p id={`${id}-error`} className="text-xs text-red-400" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
