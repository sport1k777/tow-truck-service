'use client';

import { AlertCircle, CheckCircle2, Clock, Loader2, MapPin, Route } from 'lucide-react';
import type { PriceCalculationResult } from '@/modules/pricing/pricing.types';
import { CALCULATOR_DEFAULTS } from './calculator.pricing';
import type { CalculatorResult, CalculatorStatus } from './calculator.types';

import type { RouteStatus } from './use-calculator-route';

interface CalculatorResultsProps {
  status: CalculatorStatus;
  result: CalculatorResult | null;
  livePrice: PriceCalculationResult | null;
  displayDistanceKm: number | null;
  displayDurationMinutes: number | null;
  isCalculatingRoute: boolean;
  routeStatus: RouteStatus;
}

function formatCurrency(amount: number): string {
  return `${CALCULATOR_DEFAULTS.currencySymbol}${amount.toLocaleString('uk-UA')}`;
}

export function CalculatorResults({
  status,
  result,
  livePrice,
  displayDistanceKm,
  displayDurationMinutes,
  isCalculatingRoute,
  routeStatus,
}: CalculatorResultsProps) {
  if (status === 'calculating') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-4">
        <Loader2 className="h-5 w-5 animate-spin text-sky-400" aria-hidden="true" />
        <p className="text-sm text-white/60">Розраховуємо маршрут та вартість...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
        <p className="text-sm text-red-300/90">Не вдалося розрахувати вартість. Спробуйте ще раз.</p>
      </div>
    );
  }

  const availability = result?.availability;
  const durationMinutes = displayDurationMinutes ?? result?.route.durationMinutes;
  const hasLiveEstimate = livePrice !== null;
  const isRoutePending = routeStatus === 'calculating' || isCalculatingRoute;

  if (!hasLiveEstimate && !result) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Route, label: 'Відстань', value: '—' },
          { icon: Clock, label: 'Час у дорозі', value: '—' },
          { icon: MapPin, label: 'Зона', value: '—' },
          { icon: CheckCircle2, label: 'Вартість', value: '—' },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
          >
            <Icon className="mb-2 h-4 w-4 text-white/25" aria-hidden="true" />
            <p className="text-[11px] uppercase tracking-wider text-white/60">{label}</p>
            <p className="mt-0.5 text-lg font-semibold text-white/30">{value}</p>
          </div>
        ))}
      </div>
    );
  }

  const lineItems = livePrice?.breakdown.filter((item) => item.type !== 'total') ?? [];
  const totalItem = livePrice?.breakdown.find((item) => item.type === 'total');

  return (
    <div className="space-y-4">
      {availability && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
            availability.isAvailable
              ? 'border-emerald-500/20 bg-emerald-500/[0.06]'
              : 'border-amber-500/20 bg-amber-500/[0.06]'
          }`}
          role="status"
        >
          <CheckCircle2
            className={`h-5 w-5 shrink-0 ${availability.isAvailable ? 'text-emerald-400' : 'text-amber-400'}`}
            aria-hidden="true"
          />
          <div>
            <p
              className={`text-sm font-medium ${availability.isAvailable ? 'text-emerald-300' : 'text-amber-300'}`}
            >
              {availability.message}
            </p>
            {availability.areaName && (
              <p className="mt-0.5 text-xs text-white/40">{availability.areaName}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
          <Route className="mb-2 h-4 w-4 text-sky-400" aria-hidden="true" />
          <p className="text-[11px] uppercase tracking-wider text-white/40">Відстань</p>
          <p className="mt-0.5 text-lg font-semibold text-white">
            {isRoutePending
              ? '...'
              : displayDistanceKm !== null
                ? `${displayDistanceKm.toLocaleString('uk-UA', { maximumFractionDigits: 1 })} км`
                : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
          <Clock className="mb-2 h-4 w-4 text-sky-400" aria-hidden="true" />
          <p className="text-[11px] uppercase tracking-wider text-white/40">Час у дорозі</p>
          <p className="mt-0.5 text-lg font-semibold text-white">
            {isRoutePending ? '...' : durationMinutes !== null && durationMinutes !== undefined ? `${durationMinutes} хв` : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 sm:col-span-2">
          <p className="text-[11px] uppercase tracking-wider text-white/40">Орієнтовна вартість</p>
          <p className="mt-0.5 text-2xl font-semibold tracking-tight text-white">
            {livePrice ? formatCurrency(livePrice.total) : '—'}
          </p>
          <p className="mt-1 text-xs text-white/35">Остаточна ціна може відрізнятися</p>
        </div>
      </div>

      {livePrice && lineItems.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">
            Деталізація
          </p>
          <ul className="space-y-1.5">
            {lineItems.map((item) => (
              <li key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-white/55">{item.label}</span>
                <span className="font-medium text-white/80">{formatCurrency(item.amount)}</span>
              </li>
            ))}
            {totalItem && (
              <li className="flex items-center justify-between border-t border-white/[0.06] pt-2 text-sm">
                <span className="font-medium text-white/80">{totalItem.label}</span>
                <span className="text-base font-semibold text-white">
                  {formatCurrency(totalItem.amount)}
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
