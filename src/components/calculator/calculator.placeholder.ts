import type { VehicleType } from '@/lib/constants';
import { VEHICLE_TYPES } from '@/lib/constants';

export const VEHICLE_TYPE_OPTIONS: Array<{ value: VehicleType; label: string }> = [
  { value: VEHICLE_TYPES.PASSENGER_CAR, label: 'Легковий автомобіль' },
  { value: VEHICLE_TYPES.SUV, label: 'Кросовер / SUV' },
  { value: VEHICLE_TYPES.VAN, label: 'Мінівен / фургон' },
  { value: VEHICLE_TYPES.TRUCK, label: 'Вантажний автомобіль' },
  { value: VEHICLE_TYPES.MOTORCYCLE, label: 'Мотоцикл' },
  { value: VEHICLE_TYPES.OTHER, label: 'Інше' },
];

export const CALCULATOR_DEFAULTS = {
  currency: 'UAH',
  currencySymbol: '₴',
} as const;

/**
 * Placeholder calculator — replace with calculatePriceAction + maps proxy in Phase 7.
 */
export async function placeholderCalculateQuote(
  form: import('./calculator.types').CalculatorFormState,
): Promise<import('./calculator.types').CalculatorResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  const vehicleSurcharge =
    form.vehicleType === 'TRUCK' ? 400 : form.vehicleType === 'VAN' ? 200 : form.vehicleType === 'SUV' ? 100 : 0;

  const baseFee = 500;
  const distanceKm = 12.4;
  const perKm = 25;
  const distanceFee = distanceKm * perKm;
  const total = baseFee + distanceFee + vehicleSurcharge;

  return {
    route: {
      distanceKm,
      durationMinutes: 28,
      polyline: null,
    },
    price: {
      total,
      currency: 'UAH',
      breakdown: [
        { label: 'Базовий виїзд', amount: baseFee },
        { label: `Відстань (${distanceKm} км)`, amount: distanceFee },
        ...(vehicleSurcharge > 0
          ? [{ label: 'Доплата за тип авто', amount: vehicleSurcharge }]
          : []),
      ],
    },
    availability: {
      isAvailable: true,
      message: 'Послуга доступна у вашій зоні',
      areaName: 'Київ та область',
    },
    calculatedAt: new Date().toISOString(),
  };
}
