import { z } from 'zod';
import { DEFAULT_PHONE_COUNTRY_CODE } from '@/lib/locale.defaults';
import type { BookingFormErrors, BookingFormState } from './booking.types';

const MIN_ADDRESS_LENGTH = 5;
const MAX_ADDRESS_LENGTH = 500;
const MAX_NAME_LENGTH = 100;
const MAX_VEHICLE_LENGTH = 120;
const MAX_NOTES_LENGTH = 2000;

export const bookingFormSchema = z
  .object({
    customerName: z
      .string()
      .trim()
      .min(2, 'Імʼя має містити щонайменше 2 символи')
      .max(MAX_NAME_LENGTH, 'Імʼя занадто довге'),
    customerPhone: z
      .string()
      .trim()
      .min(1, 'Вкажіть номер телефону')
      .refine(isValidUkrainePhone, {
        message: `Вкажіть коректний номер (${DEFAULT_PHONE_COUNTRY_CODE}…)`,
      }),
    pickupAddress: z
      .string()
      .trim()
      .min(MIN_ADDRESS_LENGTH, 'Вкажіть адресу забору')
      .max(MAX_ADDRESS_LENGTH, 'Адреса занадто довга'),
    destinationAddress: z
      .string()
      .trim()
      .min(MIN_ADDRESS_LENGTH, 'Вкажіть адресу призначення')
      .max(MAX_ADDRESS_LENGTH, 'Адреса занадто довга'),
    vehicleMakeModel: z
      .string()
      .trim()
      .min(2, 'Вкажіть марку та модель автомобіля')
      .max(MAX_VEHICLE_LENGTH, 'Значення занадто довге'),
    additionalNotes: z
      .string()
      .trim()
      .max(MAX_NOTES_LENGTH, 'Коментар занадто довгий'),
  })
  .superRefine((data, ctx) => {
    if (
      data.pickupAddress.toLowerCase() === data.destinationAddress.toLowerCase()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Оберіть іншу адресу призначення',
        path: ['destinationAddress'],
      });
    }
  });

export function validateBookingForm(form: BookingFormState): BookingFormErrors {
  const result = bookingFormSchema.safeParse(form);

  if (result.success) {
    return {};
  }

  const errors: BookingFormErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !errors[field as keyof BookingFormErrors]) {
      errors[field as keyof BookingFormErrors] = issue.message;
    }
  }

  return errors;
}

export function normalizeUkrainePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('380') && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith('0') && digits.length === 10) {
    return `+38${digits}`;
  }

  if (digits.length === 9) {
    return `+380${digits}`;
  }

  return phone.trim().startsWith('+') ? phone.trim() : `+${digits}`;
}

function isValidUkrainePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('380') && digits.length === 12) {
    return true;
  }

  if (digits.startsWith('0') && digits.length === 10) {
    return true;
  }

  if (digits.length === 9) {
    return true;
  }

  return false;
}

/** Maps validated form state to normalized field values before submission envelope is built */
export function toBookingSubmissionPayload(form: BookingFormState) {
  const parsed = bookingFormSchema.parse(form);

  return {
    customerName: parsed.customerName,
    customerPhone: normalizeUkrainePhone(parsed.customerPhone),
    pickupAddress: parsed.pickupAddress,
    destinationAddress: parsed.destinationAddress,
    vehicleMakeModel: parsed.vehicleMakeModel,
    additionalNotes: parsed.additionalNotes,
  };
}
