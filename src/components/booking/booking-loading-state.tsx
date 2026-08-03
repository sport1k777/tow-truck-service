'use client';

import { useEffect, useState } from 'react';
import { Loader2, Truck } from 'lucide-react';

const LOADING_STEPS = [
  'Перевіряємо дані',
  'Формуємо заявку',
  'Відкриваємо WhatsApp',
] as const;

export function BookingLoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % LOADING_STEPS.length);
    }, 1100);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="booking-loading-state absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[inherit] bg-[#030712]/80 px-6 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Надсилання заявки"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(59,130,246,0.14),transparent)]"
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-xs flex-col items-center text-center">
        <div className="booking-loading-ring relative mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10 shadow-[0_0_48px_rgba(56,189,248,0.15)] sm:h-20 sm:w-20">
          <Loader2 className="h-8 w-8 animate-spin text-sky-400" aria-hidden="true" />
          <Truck className="booking-loading-truck absolute h-5 w-5 text-sky-300/90" aria-hidden="true" />
        </div>

        <p className="text-base font-semibold text-white sm:text-lg">Надсилаємо заявку</p>
        <p className="mt-2 text-sm text-white/45">Зазвичай займає кілька секунд</p>

        <ul className="mt-8 w-full space-y-2.5" aria-hidden="true">
          {LOADING_STEPS.map((step, index) => {
            const isActive = index === activeStep;
            const isComplete = index < activeStep;

            return (
              <li
                key={step}
                className={`booking-loading-step flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-200'
                    : isComplete
                      ? 'text-white/55'
                      : 'text-white/35'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-sky-500/25 text-sky-300'
                      : isComplete
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 text-white/30'
                  }`}
                >
                  {isComplete ? '✓' : index + 1}
                </span>
                {step}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
