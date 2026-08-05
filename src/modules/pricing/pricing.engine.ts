/**
 * Pure pricing engine — no side effects, no database access.
 * All rates come from PricingConfig (see pricing.config.ts).
 */

import type { PricingConfig } from './pricing.config';
import { PRICING_SURCHARGE_TYPES } from '@/lib/constants';
import type { PriceCalculationResult, PricingInput } from './pricing.types';

function isNightHour(hour: number, startHour: number, endHour: number): boolean {
  if (startHour === endHour) {
    return false;
  }

  if (startHour < endHour) {
    return hour >= startHour && hour < endHour;
  }

  return hour >= startHour || hour < endHour;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function roundAmount(amount: number): number {
  return Math.round(amount);
}

export function calculatePrice(
  input: PricingInput,
  config: PricingConfig,
): PriceCalculationResult {
  const vehicleRate = config.vehicleRates[input.vehicleType];
  const baseAmount = config.baseCallOutFee;
  const perKmRate = input.isOutsideCity ? config.outsideCityPerKmRate : config.cityPerKmRate;
  const distanceAmount = input.distanceKm * perKmRate;
  const vehicleFlatSurcharge = vehicleRate.flatSurcharge ?? 0;
  const subtotal = baseAmount + distanceAmount + vehicleFlatSurcharge;

  const breakdown: PriceCalculationResult['breakdown'] = [
    {
      label: 'Базовий виїзд',
      amount: roundAmount(baseAmount),
      type: 'base',
    },
    {
      label: `Відстань (${input.distanceKm.toLocaleString('uk-UA', { maximumFractionDigits: 1 })} км × ${perKmRate} ₴/км)`,
      amount: roundAmount(distanceAmount),
      type: 'distance',
    },
  ];

  if (vehicleFlatSurcharge > 0) {
    breakdown.push({
      label: `${vehicleRate.label} (доплата)`,
      amount: roundAmount(vehicleFlatSurcharge),
      type: 'surcharge',
      surchargeType: PRICING_SURCHARGE_TYPES.VEHICLE_TYPE,
    });
  }

  let total = subtotal;
  const { additionalServices } = config;

  if (
    additionalServices.nightSurcharge.enabled &&
    isNightHour(
      input.timestamp.getHours(),
      additionalServices.nightSurcharge.startHour,
      additionalServices.nightSurcharge.endHour,
    )
  ) {
    const nightAmount = subtotal * (additionalServices.nightSurcharge.percent / 100);
    breakdown.push({
      label: `${additionalServices.nightSurcharge.label} (+${additionalServices.nightSurcharge.percent}%)`,
      amount: roundAmount(nightAmount),
      type: 'surcharge',
      surchargeType: PRICING_SURCHARGE_TYPES.NIGHT,
    });
    total += nightAmount;
  }

  if (additionalServices.weekendSurcharge.enabled && isWeekend(input.timestamp)) {
    const weekendAmount = subtotal * (additionalServices.weekendSurcharge.percent / 100);
    breakdown.push({
      label: `${additionalServices.weekendSurcharge.label} (+${additionalServices.weekendSurcharge.percent}%)`,
      amount: roundAmount(weekendAmount),
      type: 'surcharge',
      surchargeType: PRICING_SURCHARGE_TYPES.WEEKEND,
    });
    total += weekendAmount;
  }

  if (input.isEmergencyDispatch && additionalServices.emergencyDispatch.enabled) {
    breakdown.push({
      label: additionalServices.emergencyDispatch.label,
      amount: additionalServices.emergencyDispatch.flatFee,
      type: 'surcharge',
      surchargeType: PRICING_SURCHARGE_TYPES.EMERGENCY_DISPATCH,
    });
    total += additionalServices.emergencyDispatch.flatFee;
  }

  if (input.isDifficultLoading && additionalServices.difficultLoading.enabled) {
    breakdown.push({
      label: additionalServices.difficultLoading.label,
      amount: additionalServices.difficultLoading.flatFee,
      type: 'surcharge',
      surchargeType: PRICING_SURCHARGE_TYPES.DIFFICULT_LOADING,
    });
    total += additionalServices.difficultLoading.flatFee;
  }

  if (additionalServices.holidaySurcharge.enabled && input.isHoliday) {
    const holidayAmount = subtotal * (additionalServices.holidaySurcharge.percent / 100);
    breakdown.push({
      label: `${additionalServices.holidaySurcharge.label} (+${additionalServices.holidaySurcharge.percent}%)`,
      amount: roundAmount(holidayAmount),
      type: 'surcharge',
      surchargeType: PRICING_SURCHARGE_TYPES.HOLIDAY,
    });
    total += holidayAmount;
  }

  const roundedTotal = Math.max(roundAmount(total), config.minCharge);

  breakdown.push({
    label: 'Разом (орієнтовно)',
    amount: roundedTotal,
    type: 'total',
  });

  return {
    total: roundedTotal,
    currency: config.currency,
    currencySymbol: config.currencySymbol,
    distanceKm: input.distanceKm,
    breakdown,
  };
}
