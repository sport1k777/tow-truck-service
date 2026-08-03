'use client';

import { Check } from 'lucide-react';
import type { OrderTrackingStep } from '@/modules/booking/booking.tracking';

interface BookingOrderTimelineProps {
  steps: OrderTrackingStep[];
}

export function BookingOrderTimeline({ steps }: BookingOrderTimelineProps) {
  return (
    <ol className="booking-order-timeline space-y-0" aria-label="Статус замовлення">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px ${
                  step.status === 'completed'
                    ? 'bg-gradient-to-b from-emerald-400/50 to-white/10'
                    : 'bg-white/10'
                }`}
                aria-hidden="true"
              />
            )}

            <span
              className={`booking-timeline-marker relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                step.status === 'current' ? 'booking-timeline-marker-current ' : ''
              }${
                step.status === 'completed'
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.2)]'
                  : step.status === 'current'
                    ? 'border-sky-500/40 bg-sky-500/10 text-sky-400 shadow-[0_0_24px_rgba(56,189,248,0.15)]'
                    : 'border-white/10 bg-white/[0.03] text-white/25'
              }`}
              aria-hidden="true"
            >
              {step.status === 'completed' ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <span className="h-2 w-2 rounded-full bg-current opacity-60" />
              )}
            </span>

            <div className="min-w-0 pt-1">
              <p
                className={`text-sm font-medium ${
                  step.status === 'completed'
                    ? 'text-white'
                    : step.status === 'current'
                      ? 'text-sky-300'
                      : 'text-white/40'
                }`}
              >
                {step.label}
              </p>
              {step.status === 'current' && (
                <p className="mt-1 text-xs text-white/40">Поточний етап</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
