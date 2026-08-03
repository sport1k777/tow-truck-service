'use client';

import { useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useMaps } from '@/modules/maps/maps-provider';
import { createPlaceAutocomplete, parsePlaceFromAutocomplete } from '@/modules/maps/maps.service';
import type { PlaceLocation } from '@/modules/maps/maps.types';

interface AddressAutocompleteProps {
  id: string;
  label: string;
  icon: LucideIcon;
  iconClassName?: string;
  value: string;
  placeholder: string;
  error?: string;
  onAddressChange: (address: string) => void;
  onPlaceSelect: (place: PlaceLocation) => void;
}

export function AddressAutocomplete({
  id,
  label,
  icon: Icon,
  iconClassName,
  value,
  placeholder,
  error,
  onAddressChange,
  onPlaceSelect,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { status, google } = useMaps();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    if (status !== 'ready' || !google || !inputRef.current) {
      return;
    }

    autocompleteRef.current = createPlaceAutocomplete(google, inputRef.current);

    listenerRef.current = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place) {
        return;
      }

      const parsed = parsePlaceFromAutocomplete(place);
      if (parsed) {
        onPlaceSelect(parsed);
      }
    });

    return () => {
      listenerRef.current?.remove();
      listenerRef.current = null;
      autocompleteRef.current = null;
    };
  }, [status, google, onPlaceSelect]);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-white/80">
        <Icon className={`h-4 w-4 ${iconClassName ?? 'text-white/50'}`} aria-hidden="true" />
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="calculator-input w-full"
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
