'use client';

import { Car, Loader2, MapPin, MessageSquare, Phone, Send, User } from 'lucide-react';
import type { BookingFormErrors, BookingFormState } from '@/modules/booking/booking.types';
import { DEFAULT_PHONE_COUNTRY_CODE } from '@/lib/locale.defaults';
import { BookingFormField } from './booking-form-field';

interface BookingFormProps {
  form: BookingFormState;
  errors: BookingFormErrors;
  isSubmitting: boolean;
  onFieldChange: <K extends keyof BookingFormState>(
    key: K,
    value: BookingFormState[K],
  ) => void;
  onSubmit: () => void;
}

export function BookingForm({
  form,
  errors,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: BookingFormProps) {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <BookingFormField
          id="customer-name"
          label="Імʼя клієнта"
          icon={<User className="h-4 w-4 text-sky-400" aria-hidden="true" />}
          error={errors.customerName}
          required
        >
          <input
            id="customer-name"
            type="text"
            value={form.customerName}
            onChange={(event) => onFieldChange('customerName', event.target.value)}
            placeholder="Андрій"
            autoComplete="name"
            aria-invalid={!!errors.customerName}
            aria-describedby={errors.customerName ? 'customer-name-error' : undefined}
            className="calculator-input w-full"
          />
        </BookingFormField>

        <BookingFormField
          id="customer-phone"
          label="Номер телефону"
          icon={<Phone className="h-4 w-4 text-sky-400" aria-hidden="true" />}
          error={errors.customerPhone}
          required
        >
          <input
            id="customer-phone"
            type="tel"
            value={form.customerPhone}
            onChange={(event) => onFieldChange('customerPhone', event.target.value)}
            placeholder={`${DEFAULT_PHONE_COUNTRY_CODE} XX XXX XX XX`}
            autoComplete="tel"
            inputMode="tel"
            aria-invalid={!!errors.customerPhone}
            aria-describedby={errors.customerPhone ? 'customer-phone-error' : undefined}
            className="calculator-input w-full"
          />
        </BookingFormField>
      </div>

      <BookingFormField
        id="pickup-address"
        label="Адреса забору"
        icon={<MapPin className="h-4 w-4 text-sky-400" aria-hidden="true" />}
        error={errors.pickupAddress}
        required
      >
        <input
          id="pickup-address"
          type="text"
          value={form.pickupAddress}
          onChange={(event) => onFieldChange('pickupAddress', event.target.value)}
          placeholder="вул. Хрещатик, 1, Київ"
          autoComplete="street-address"
          aria-invalid={!!errors.pickupAddress}
          aria-describedby={errors.pickupAddress ? 'pickup-address-error' : undefined}
          className="calculator-input w-full"
        />
      </BookingFormField>

      <BookingFormField
        id="destination-address"
        label="Адреса призначення"
        icon={<MapPin className="h-4 w-4 text-blue-400" aria-hidden="true" />}
        error={errors.destinationAddress}
        required
      >
        <input
          id="destination-address"
          type="text"
          value={form.destinationAddress}
          onChange={(event) => onFieldChange('destinationAddress', event.target.value)}
          placeholder="вул. Борщагівська, 150, Київ"
          autoComplete="off"
          aria-invalid={!!errors.destinationAddress}
          aria-describedby={
            errors.destinationAddress ? 'destination-address-error' : undefined
          }
          className="calculator-input w-full"
        />
      </BookingFormField>

      <BookingFormField
        id="vehicle-make-model"
        label="Марка та модель авто"
        icon={<Car className="h-4 w-4 text-white/50" aria-hidden="true" />}
        error={errors.vehicleMakeModel}
        required
      >
        <input
          id="vehicle-make-model"
          type="text"
          value={form.vehicleMakeModel}
          onChange={(event) => onFieldChange('vehicleMakeModel', event.target.value)}
          placeholder="Toyota Camry, BMW X5…"
          autoComplete="off"
          aria-invalid={!!errors.vehicleMakeModel}
          aria-describedby={errors.vehicleMakeModel ? 'vehicle-make-model-error' : undefined}
          className="calculator-input w-full"
        />
      </BookingFormField>

      <BookingFormField
        id="additional-notes"
        label="Додаткові примітки"
        icon={<MessageSquare className="h-4 w-4 text-white/50" aria-hidden="true" />}
        hint="необовʼязково"
        error={errors.additionalNotes}
      >
        <textarea
          id="additional-notes"
          value={form.additionalNotes}
          onChange={(event) => onFieldChange('additionalNotes', event.target.value)}
          placeholder="Стан авто, особливості завантаження, час виїзду…"
          rows={4}
          className="calculator-input w-full resize-none"
        />
      </BookingFormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="hero-cta-primary flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Надсилаємо заявку…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Надіслати заявку
          </>
        )}
      </button>
    </form>
  );
}
