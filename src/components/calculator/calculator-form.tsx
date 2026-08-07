'use client';

import { ArrowUpDown, Car, Loader2, MapPin, MessageSquare, Zap } from 'lucide-react';
import { AddressAutocomplete } from '@/components/maps/address-autocomplete';
import type { CalculatorFormErrors, CalculatorFormState } from './calculator.types';
import { VEHICLE_TYPE_OPTIONS } from './calculator.pricing';
import { useCalculatorConfig } from './calculator-config-context';
import type { PlaceLocation } from '@/modules/maps/maps.types';

interface CalculatorFormProps {
  form: CalculatorFormState;
  errors: CalculatorFormErrors;
  isCalculating: boolean;
  isServiceAreaBlocked?: boolean;
  onFieldChange: <K extends keyof CalculatorFormState>(
    key: K,
    value: CalculatorFormState[K],
  ) => void;
  onPickupPlaceSelect: (place: PlaceLocation) => void;
  onPickupGeolocationSelect?: (place: PlaceLocation) => void;
  onDestinationPlaceSelect: (place: PlaceLocation) => void;
  onSwapAddresses: () => void;
  onCalculate: () => void;
}

export function CalculatorForm({
  form,
  errors,
  isCalculating,
  isServiceAreaBlocked = false,
  onFieldChange,
  onPickupPlaceSelect,
  onPickupGeolocationSelect,
  onDestinationPlaceSelect,
  onSwapAddresses,
  onCalculate,
}: CalculatorFormProps) {
  const { vehicleOptions } = useCalculatorConfig();
  const options = vehicleOptions.length > 0 ? vehicleOptions : VEHICLE_TYPE_OPTIONS;

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      noValidate
    >
      <AddressAutocomplete
        id="pickup-address"
        label="Звідки забрати"
        icon={MapPin}
        iconClassName="text-sky-400"
        value={form.pickupAddress}
        placeholder="вул. Хрещатик, 1, Київ"
        error={errors.pickupAddress}
        onAddressChange={(address) => onFieldChange('pickupAddress', address)}
        onPlaceSelect={onPickupPlaceSelect}
        onGeolocationSelect={onPickupGeolocationSelect}
        showLocationButton={true}
      />

      <div className="flex justify-end">
        <button
          type="button"
          className="calculator-swap-btn"
          onClick={onSwapAddresses}
          aria-label="Поміняти адреси місцями"
          title="Поміняти адреси місцями"
        >
          <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <AddressAutocomplete
        id="destination-address"
        label="Куди доставити"
        icon={MapPin}
        iconClassName="text-blue-400"
        value={form.destinationAddress}
        placeholder="вул. Борщагівська, 150, Київ"
        error={errors.destinationAddress}
        onAddressChange={(address) => onFieldChange('destinationAddress', address)}
        onPlaceSelect={onDestinationPlaceSelect}
      />

      {errors.serviceArea && (
        <div
          className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-200/90"
          role="alert"
        >
          {errors.serviceArea}
        </div>
      )}

      {errors.route && (
        <div
          className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-200/90"
          role="alert"
        >
          {errors.route}
        </div>
      )}

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
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#0a1628] text-white">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-3">
        <legend className="flex items-center gap-2 text-sm font-medium text-white/80">
          <Zap className="h-4 w-4 text-white/50" aria-hidden="true" />
          Додаткові послуги
        </legend>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/[0.1]">
          <input
            type="checkbox"
            checked={form.isEmergencyDispatch}
            onChange={(e) => onFieldChange('isEmergencyDispatch', e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/[0.04] text-sky-500 focus:ring-sky-500/40"
          />
          <span className="text-sm text-white/70">Термінова подача</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/[0.1]">
          <input
            type="checkbox"
            checked={form.isDifficultLoading}
            onChange={(e) => onFieldChange('isDifficultLoading', e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/[0.04] text-sky-500 focus:ring-sky-500/40"
          />
          <span className="text-sm text-white/70">Складне навантаження</span>
        </label>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="comments" className="flex items-center gap-2 text-sm font-medium text-white/80">
          <MessageSquare className="h-4 w-4 text-white/50" aria-hidden="true" />
          Коментар
          <span className="text-xs font-normal text-white/60">(необов&apos;язково)</span>
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
        disabled={isCalculating || isServiceAreaBlocked}
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
