'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { BookingConfirmationScreen } from './booking-confirmation-screen';
import { BookingForm } from './booking-form';
import { BookingLoadingState } from './booking-loading-state';
import { BookingQuoteSummary } from './booking-quote-summary';
import { useBookingForm } from './use-booking-form';

export function BookingPageContent() {
  const {
    form,
    errors,
    status,
    result,
    submittedPayload,
    submitError,
    quoteSnapshot,
    isQuoteStale,
    mapsUnavailable,
    noQuoteAvailable,
    isHydrated,
    updateField,
    submit,
    reset,
    isSubmitting,
    isSuccess,
  } = useBookingForm();

  if (isSuccess && result && submittedPayload) {
    return (
      <BookingConfirmationScreen
        result={result}
        payload={submittedPayload}
        onCreateAnother={reset}
      />
    );
  }

  if (!isHydrated) {
    return (
      <section className="relative min-h-screen bg-[#030712] pb-20 pt-8 sm:pt-12">
        <div className="landing-container relative max-w-3xl">
          <div className="landing-panel p-8">
            <div className="h-40 animate-pulse rounded-xl bg-white/[0.03]" aria-hidden="true" />
          </div>
        </div>
      </section>
    );
  }

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

        <div className="mb-6">
          <BookingQuoteSummary
            quote={quoteSnapshot}
            isQuoteStale={isQuoteStale}
            mapsUnavailable={mapsUnavailable}
            noQuoteAvailable={noQuoteAvailable}
          />
        </div>

        <div className="landing-panel relative p-6 sm:p-8">
          {isSubmitting && <BookingLoadingState />}

          {status === 'error' && (
            <div
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-4"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
              <p className="text-sm text-red-300/90">
                {submitError ??
                  'Не вдалося надіслати заявку. Перевірте дані та спробуйте ще раз.'}
              </p>
            </div>
          )}

          <div
            className={
              isSubmitting ? 'pointer-events-none opacity-40 transition-opacity duration-300' : undefined
            }
            aria-hidden={isSubmitting}
          >
            <BookingForm
              form={form}
              errors={errors}
              isSubmitting={isSubmitting}
              onFieldChange={updateField}
              onSubmit={submit}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          Надсилаючи заявку, ви погоджуєтесь на обробку контактних даних для організації
          евакуації.
        </p>
      </div>
    </section>
  );
}
