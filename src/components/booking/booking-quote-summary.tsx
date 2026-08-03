'use client';

import Link from 'next/link';
import { AlertCircle, Clock, MapPin, Route, Wallet } from 'lucide-react';
import { formatEstimatedArrival, calculateEstimatedArrival } from '@/modules/booking/booking.eta';
import type { BookingQuoteSnapshot } from '@/modules/booking/booking.types';

interface BookingQuoteSummaryProps {
  quote: BookingQuoteSnapshot;
  isQuoteStale: boolean;
  mapsUnavailable: boolean;
  noQuoteAvailable: boolean;
}

function formatPrice(quote: BookingQuoteSnapshot): string {
  if (quote.estimatedPrice === null) {
    return '—';
  }

  return `${quote.currencySymbol}${quote.estimatedPrice.toLocaleString('uk-UA')}`;
}

export function BookingQuoteSummary({
  quote,
  isQuoteStale,
  mapsUnavailable,
  noQuoteAvailable,
}: BookingQuoteSummaryProps) {
  if (noQuoteAvailable) {
    return (
      <div
        className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-4"
        role="note"
      >
        <p className="text-sm text-white/60">
          Орієнтовну вартість можна розрахувати в{' '}
          <Link href="/#pricing" className="text-sky-400/90 transition-colors hover:text-sky-300">
            калькуляторі
          </Link>
          . Заявку можна надіслати й без попереднього розрахунку.
        </p>
      </div>
    );
  }

  if (isQuoteStale) {
    return (
      <div
        className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-4"
        role="note"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
        <p className="text-sm text-amber-200/90">
          Адреси змінено — попередній розрахунок неактуальний.{' '}
          <Link href="/#pricing" className="underline decoration-amber-400/40 underline-offset-2">
            Перерахуйте в калькуляторі
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mapsUnavailable && (
        <div
          className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3"
          role="note"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
          <p className="text-sm text-amber-200/90">
            Google Maps тимчасово недоступний. Вартість і відстань можуть бути неточними — диспетчер
            уточнить деталі.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-sky-500/15 bg-sky-500/[0.04] p-4 sm:p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/35">
          Орієнтовний розрахунок
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryMetric
            icon={Route}
            label="Відстань"
            value={
              quote.distanceKm !== null
                ? `${quote.distanceKm.toLocaleString('uk-UA', { maximumFractionDigits: 1 })} км`
                : '—'
            }
          />
          <SummaryMetric
            icon={Clock}
            label="Час у дорозі"
            value={quote.durationMinutes !== null ? `${quote.durationMinutes} хв` : '—'}
          />
          <SummaryMetric
            icon={MapPin}
            label="Прибуття"
            value={
              quote.durationMinutes !== null
                ? formatEstimatedArrival(
                    calculateEstimatedArrival(quote.durationMinutes).toISOString(),
                  )
                : '—'
            }
            className="sm:col-span-2"
          />
          <SummaryMetric
            icon={Wallet}
            label="Орієнтовна ціна"
            value={formatPrice(quote)}
            highlight
            className="col-span-2 sm:col-span-4"
          />
        </div>
      </div>
    </div>
  );
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
  highlight = false,
  className,
}: {
  icon: typeof Route;
  label: string;
  value: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Icon className="mb-2 h-4 w-4 text-sky-400/80" aria-hidden="true" />
      <p className="text-[11px] uppercase tracking-wider text-white/40">{label}</p>
      <p
        className={`mt-0.5 font-semibold text-white ${highlight ? 'text-xl tracking-tight' : 'text-base'}`}
      >
        {value}
      </p>
    </div>
  );
}
