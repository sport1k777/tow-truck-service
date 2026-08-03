'use client';

import { Car, Loader2, MapPin, MessageSquare } from 'lucide-react';
import type { CalculatorFormErrors, CalculatorFormState } from './calculator.types';
import { VEHICLE_TYPE_OPTIONS } from './calculator.placeholder';

interface CalculatorFormProps {
  form: CalculatorFormState;
  errors: CalculatorFormErrors;
  isCalculating: boolean;
  onFieldChange: <K extends keyof CalculatorFormState>(
    key: K,
    value: CalculatorFormState[K],
  ) => void;
  onCalculate: () => void;
}

export function CalculatorForm({
  form,
  errors,
  isCalculating,
  onFieldChange,
  onCalculate,
}: CalculatorFormProps) {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      noValidate
    >
      {/* Pickup — Phase 7: replace with AddressAutocomplete */}
      <div className="space-y-2">
        <label htmlFor="pickup-address" className="flex items-center gap-2 text-sm font-medium text-white/80">
          <MapPin className="h-4 w-4 text-sky-400" aria-hidden="true" />
          Звідки забрати
        </label>
        <input
          id="pickup-address"
          type="text"
          value={form.pickupAddress}
          onChange={(e) => onFieldChange('pickupAddress', e.target.value)}
          placeholder="вул. Хрещатик, 1, Київ"
          autoComplete="off"
          aria-invalid={!!errors.pickupAddress}
          aria-describedby={errors.pickupAddress ? 'pickup-error' : undefined}
          className="calculator-input w-full"
        />
        {errors.pickupAddress && (
          <p id="pickup-error" className="text-xs text-red-400" role="alert">
            {errors.pickupAddress}
          </p>
        )}
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <label
          htmlFor="destination-address"
          className="flex items-center gap-2 text-sm font-medium text-white/80"
        >
          <MapPin className="h-4 w-4 text-blue-400" aria-hidden="true" />
          Куди доставити
        </label>
        <input
          id="destination-address"
          type="text"
          value={form.destinationAddress}
          onChange={(e) => onFieldChange('destinationAddress', e.target.value)}
          placeholder="вул. Борщагівська, 150, Київ"
          autoComplete="off"
          aria-invalid={!!errors.destinationAddress}
          aria-describedby={errors.destinationAddress ? 'destination-error' : undefined}
          className="calculator-input w-full"
        />
        {errors.destinationAddress && (
          <p id="destination-error" className="text-xs text-red-400" role="alert">
            {errors.destinationAddress}
          </p>
        )}
      </div>

      {/* Vehicle type */}
      <div className="space-y-2">
        <label htmlFor="vehicle-type" className="flex items-center gap-2 text-sm font-medium text-white/80">
          <Car className="h-4 w-4 text-white/50" aria-hidden="true" />
          Тип транспорту
        </label>
        <select
          id="vehicle-type"
          value={form.vehicleType}
          onChange={(e) => onFieldChange('vehicleType', e.target.value as CalculatorFormState['vehicleType'])}
          className="calculator-input w-full appearance-none"
        >
          {VEHICLE_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#0a1628] text-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label htmlFor="comments" className="flex items-center gap-2 text-sm font-medium text-white/80">
          <MessageSquare className="h-4 w-4 text-white/50" aria-hidden="true" />
          Коментар
          <span className="text-xs font-normal text-white/35">(необов&apos;язково)</span>
        </label>
        <textarea
          id="comments"
          value={form.comments}
          onChange={(e) => onFieldChange('comments', e.target.value)}
          placeholder="Додаткова інформація про автомобіль або ситуацію"
          rows={3}
          className="calculator-input w-full resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isCalculating}
        className="hero-cta-primary flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCalculating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Розраховуємо...
          </>
        ) : (
          'Розрахувати вартість'
        )}
      </button>
    </form>
  );
}
