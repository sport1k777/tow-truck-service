'use client';

import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Hash,
  Phone,
  PlusCircle,
  Route,
  Wallet,
} from 'lucide-react';
import { BookingOrderTimeline } from './booking-order-timeline';
import { formatEstimatedArrival } from '@/modules/booking/booking.eta';
import { INITIAL_ORDER_TRACKING_STEPS } from '@/modules/booking/booking.tracking';
import type { BookingSubmissionPayload, BookingSubmissionResult } from '@/modules/booking/booking.types';

interface BookingConfirmationScreenProps {
  result: BookingSubmissionResult;
  payload: BookingSubmissionPayload;
  onCreateAnother: () => void;
}

function formatSubmittedAt(isoDate: string): string {
  return new Date(isoDate).toLocaleString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(result: BookingSubmissionResult): string {
  const { quote } = result;
  if (quote.estimatedPrice === null) {
    return 'Уточнюється диспетчером';
  }

  return `${quote.currencySymbol}${quote.estimatedPrice.toLocaleString('uk-UA')}`;
}

export function BookingConfirmationScreen({
  result,
  payload,
  onCreateAnother,
}: BookingConfirmationScreenProps) {
  const { quote } = result;

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#030712] pb-20 pt-8 sm:pt-12"
      aria-labelledby="booking-confirmation-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(59,130,246,0.1),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(52,211,153,0.06),transparent_65%)]"
        aria-hidden="true"
      />
      <div className="landing-section-divider" aria-hidden="true" />

      <div className="landing-container relative mx-auto max-w-2xl px-4 sm:px-0">
        <div className="booking-success-animate text-center">
          <div className="booking-success-icon mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_64px_rgba(52,211,153,0.2)] sm:h-24 sm:w-24">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 sm:h-12 sm:w-12" aria-hidden="true" />
          </div>

          <p className="landing-eyebrow">Підтвердження</p>
          <h1
            id="booking-confirmation-heading"
            className="landing-title mt-2 text-2xl sm:text-3xl"
          >
            Замовлення успішно створено!
          </h1>
          <p className="landing-subtitle mx-auto mt-4 max-w-md">
            {result.message}
          </p>
        </div>

        <div className="booking-success-animate mt-10 space-y-5" style={{ animationDelay: '0.08s' }}>
          <div className="landing-panel p-6 sm:p-8">
            <dl className="grid gap-5 sm:grid-cols-2">
              <DetailItem
                icon={Hash}
                label="Номер заявки"
                value={result.referenceNumber}
                mono
              />
              <DetailItem
                icon={Phone}
                label="Телефон клієнта"
                value={payload.customerPhone}
              />
              <DetailItem
                icon={Route}
                label="Відстань"
                value={
                  quote.distanceKm !== null
                    ? `${quote.distanceKm.toLocaleString('uk-UA', { maximumFractionDigits: 1 })} км`
                    : 'Уточнюється'
                }
              />
              <DetailItem
                icon={Wallet}
                label="Орієнтовна вартість"
                value={formatPrice(result)}
                highlight
              />
              <DetailItem
                icon={Clock}
                label="Орієнтовний час прибуття"
                value={
                  quote.estimatedArrivalAt
                    ? formatEstimatedArrival(quote.estimatedArrivalAt)
                    : 'Уточнюється диспетчером'
                }
                className="sm:col-span-2"
              />
              <DetailItem
                icon={CalendarClock}
                label="Дата та час заявки"
                value={formatSubmittedAt(payload.submittedAt)}
                className="sm:col-span-2"
              />
            </dl>
          </div>

          <div
            className="booking-success-animate landing-panel p-6 sm:p-8"
            style={{ animationDelay: '0.14s' }}
          >
            <p className="mb-5 text-xs font-medium uppercase tracking-widest text-white/35">
              Статус замовлення
            </p>
            <BookingOrderTimeline steps={INITIAL_ORDER_TRACKING_STEPS} />
          </div>

          <div
            className="booking-success-animate flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: '0.2s' }}
          >
            <a
              href={result.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-whatsapp hero-cta-primary inline-flex h-12 min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white"
            >
              <span aria-hidden="true">💬</span>
              Open WhatsApp Conversation
            </a>
            <button
              type="button"
              onClick={onCreateAnother}
              className="hero-cta-secondary inline-flex h-12 min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-white/90"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Create Another Order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  mono = false,
  highlight = false,
  className,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/35">
        <Icon className="h-3.5 w-3.5 text-sky-400/80" aria-hidden="true" />
        {label}
      </dt>
      <dd
        className={`mt-2 text-sm text-white/85 ${
          mono ? 'font-mono tracking-wide text-sky-300' : ''
        } ${highlight ? 'text-lg font-semibold text-white' : ''}`}
      >
        {value}
      </dd>
    </div>
  );
}
