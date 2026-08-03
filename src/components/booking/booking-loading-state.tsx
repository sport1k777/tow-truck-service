'use client';

import { Loader2, Truck } from 'lucide-react';

const LOADING_STEPS = [
  'Перевіряємо дані',
  'Формуємо заявку',
  'Надсилаємо диспетчеру',
] as const;

export function BookingLoadingState() {
  return (
    <div
      className="booking-loading-state absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[inherit] bg-[#030712]/75 px-6 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Надсилання заявки"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(59,130,246,0.12),transparent)]"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center text-center">
        <div className="booking-loading-ring relative mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-sky-500/25 bg-sky-500/10">
          <Loader2 className="h-7 w-7 animate-spin text-sky-400" aria-hidden="true" />
          <Truck
            className="absolute h-4 w-4 text-sky-300/80"
            aria-hidden="true"
          />
        </div>

        <p className="text-base font-semibold text-white">Надсилаємо заявку</p>
        <p className="mt-2 text-sm text-white/45">Зазвичай займає кілька секунд</p>

        <ul className="mt-8 space-y-2.5" aria-hidden="true">
          {LOADING_STEPS.map((step, index) => (
            <li
              key={step}
              className="booking-loading-step flex items-center gap-2.5 text-sm text-white/50"
              style={{ animationDelay: `${index * 0.4}s` }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400/80" />
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
