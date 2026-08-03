'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CalculatorForm } from './calculator-form';
import { CalculatorMapPreview } from './calculator-map-preview';
import { CalculatorResults } from './calculator-results';
import { useCalculator } from './use-calculator';

export function PriceCalculatorSection() {
  const { form, errors, status, result, updateField, calculate, isCalculating, hasResult } =
    useCalculator();

  return (
    <section
      id="pricing"
      className="landing-section scroll-mt-24 bg-[#030712]"
      aria-labelledby="calculator-heading"
    >
      <div className="landing-section-divider" aria-hidden="true" />
      {/* Bridge from hero */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#030712] to-transparent"
        aria-hidden="true"
      />
      {/* Bridge into How It Works */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(59,130,246,0.07),transparent)]"
        aria-hidden="true"
      />

      <div className="landing-container">
        <div className="landing-header">
          <p className="landing-eyebrow">Калькулятор</p>
          <h2 id="calculator-heading" className="landing-title">
            Розрахуйте вартість евакуації
          </h2>
          <p className="landing-subtitle">
            Вкажіть маршрут та тип автомобіля — отримайте орієнтовну ціну за кілька секунд
          </p>
        </div>

        <div className="landing-panel">
          <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] xl:grid-cols-[minmax(0,440px)_1fr]">
            {/* LEFT — form + results */}
            <div className="flex flex-col gap-8 border-b border-white/[0.06] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="flex flex-col gap-3">
                <CalculatorForm
                  form={form}
                  errors={errors}
                  isCalculating={isCalculating}
                  onFieldChange={updateField}
                  onCalculate={calculate}
                />

                <Link
                  href="/order"
                  className="hero-cta-secondary inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-white/90"
                >
                  Замовити евакуатор
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <div aria-live="polite" aria-atomic="true">
                <CalculatorResults status={status} result={result} />
              </div>
            </div>

            {/* RIGHT — map preview */}
            <div className="relative min-h-[320px] lg:min-h-[560px]">
              <CalculatorMapPreview
                pickupAddress={form.pickupAddress}
                destinationAddress={form.destinationAddress}
                distanceKm={result?.route.distanceKm}
                durationMinutes={result?.route.durationMinutes}
                isActive={hasResult}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
