'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, MapPin, Phone, User, Car } from 'lucide-react';
import type { BookingSubmissionPayload, BookingSubmissionResult } from '@/modules/booking/booking.types';

interface BookingSuccessStateProps {
  result: BookingSubmissionResult;
  payload: BookingSubmissionPayload;
  onReset: () => void;
}

export function BookingSuccessState({ result, payload, onReset }: BookingSuccessStateProps) {
  return (
    <div className="booking-success-animate py-2" role="status">
      <div className="text-center">
        <div className="booking-success-icon mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_48px_rgba(52,211,153,0.15)]">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Заявку прийнято</h2>
        <p className="landing-subtitle mx-auto mt-3 max-w-md">{result.message}</p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-300">
          <span className="text-white/45">№</span>
          <span className="font-mono tracking-wide">{result.referenceNumber}</span>
        </p>
      </div>

      <div className="mt-8 space-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-md">
        <p className="text-xs font-medium uppercase tracking-widest text-white/35">
          Деталі заявки
        </p>
        <ul className="space-y-3">
          <SummaryRow icon={User} label="Клієнт" value={payload.customerName} />
          <SummaryRow icon={Phone} label="Телефон" value={payload.customerPhone} />
          <SummaryRow icon={MapPin} label="Забір" value={payload.pickupAddress} />
          <SummaryRow icon={MapPin} label="Призначення" value={payload.destinationAddress} />
          <SummaryRow icon={Car} label="Авто" value={payload.vehicleMakeModel} />
          {payload.additionalNotes && (
            <SummaryRow icon={Clock} label="Примітки" value={payload.additionalNotes} />
          )}
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="hero-cta-primary inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white"
        >
          На головну
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="hero-cta-secondary inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-white/85"
        >
          Нова заявка
        </button>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-sky-400/80">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-medium uppercase tracking-wider text-white/35">
          {label}
        </span>
        <span className="mt-0.5 block text-sm text-white/75">{value}</span>
      </span>
    </li>
  );
}
