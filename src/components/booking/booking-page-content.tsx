'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { BookingForm } from './booking-form';
import { useBookingForm } from './use-booking-form';

export function BookingPageContent() {
  const { form, errors, status, result, updateField, submit, reset, isSubmitting, isSuccess } =
    useBookingForm();

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#030712] pb-20 pt-8 sm:pt-12"
      aria-labelledby="booking-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="landing-section-divider" aria-hidden="true" />

      <div className="landing-container relative max-w-3xl">
        <div className="landing-header mb-10 sm:mb-12">
          <p className="landing-eyebrow">Онлайн-замовлення</p>
          <h1 id="booking-heading" className="landing-title">
            Замовити евакуатор
          </h1>
          <p className="landing-subtitle">
            Заповніть форму — диспетчер підтвердить заявку та надішле евакуатор. Орієнтовний
            розрахунок доступний у{' '}
            <Link href="/#pricing" className="text-sky-400/90 transition-colors hover:text-sky-300">
              калькуляторі
            </Link>
            .
          </p>
        </div>

        <div className="landing-panel p-6 sm:p-8">
          {isSuccess && result ? (
            <BookingSuccessState
              referenceNumber={result.referenceNumber}
              message={result.message}
              onReset={reset}
            />
          ) : (
            <>
              {status === 'error' && (
                <div
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-4"
                  role="alert"
                >
                  <AlertCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-red-300/90">
                    Не вдалося надіслати заявку. Перевірте дані та спробуйте ще раз.
                  </p>
                </div>
              )}

              <BookingForm
                form={form}
                errors={errors}
                isSubmitting={isSubmitting}
                onFieldChange={updateField}
                onSubmit={submit}
              />
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          Надсилаючи заявку, ви погоджуєтесь на обробку контактних даних для організації
          евакуації.
        </p>
      </div>
    </section>
  );
}

function BookingSuccessState({
  referenceNumber,
  message,
  onReset,
}: {
  referenceNumber: string;
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="py-4 text-center" role="status">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10">
        <CheckCircle2 className="h-7 w-7 text-emerald-400" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-semibold text-white">Заявку прийнято</h2>
      <p className="landing-subtitle mx-auto mt-3 max-w-md">{message}</p>
      <p className="mt-6 text-sm text-white/45">
        Номер заявки:{' '}
        <span className="font-mono font-semibold text-sky-300">{referenceNumber}</span>
      </p>
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
