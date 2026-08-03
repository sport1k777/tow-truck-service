'use client';

import { Banknote, MapPin, Navigation, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: 1,
    icon: MapPin,
    title: 'Вкажіть адресу забору',
    description: 'Введіть місце, де знаходиться ваш автомобіль. Підтримка всіх адрес по Україні.',
  },
  {
    number: 2,
    icon: Navigation,
    title: 'Оберіть пункт призначення',
    description: 'Вкажіть, куди потрібно доставити авто — СТО, парковка або інша адреса.',
  },
  {
    number: 3,
    icon: Banknote,
    title: 'Миттєво отримайте ціну',
    description: 'Система автоматично розрахує відстань, час у дорозі та орієнтовну вартість.',
  },
  {
    number: 4,
    icon: Truck,
    title: 'Евакуатор виїжджає негайно',
    description: 'Після підтвердження замовлення найближчий евакуатор одразу прямує до вас.',
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="landing-section"
      aria-labelledby="how-it-works-heading"
    >
      <div className="landing-section-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="landing-section-divider" aria-hidden="true" />

      <div className="landing-container">
        <div className="landing-header">
          <p className="landing-eyebrow">Як це працює</p>
          <h2 id="how-it-works-heading" className="landing-title">
            Чотири кроки до евакуації
          </h2>
          <p className="landing-subtitle">
            Простий процес без зайвих дзвінків — від адреси до виїзду евакуатора за лічені хвилини
          </p>
        </div>

        {/* Steps grid with connector line (desktop) */}
        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[4.5rem] hidden h-px bg-gradient-to-r from-transparent via-sky-500/25 to-transparent lg:block"
            aria-hidden="true"
          />

          <ol className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5">
            {STEPS.map((step, index) => (
              <li key={step.number} className="how-step-animate" style={{ animationDelay: `${index * 0.1}s` }}>
                <StepCard step={step} />
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030712] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  const Icon = step.icon;

  return (
    <article className="how-step-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-md">
      <div className="landing-card-glow" aria-hidden="true" />

      {/* Step number */}
      <div className="mb-5 flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-bold text-sky-400">
          {step.number}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-widest text-white/25">
          Крок {step.number}
        </span>
      </div>

      <div className="landing-icon-box mb-4">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Content */}
      <h3 className="landing-card-title">{step.title}</h3>
      <p className="landing-body mt-2 flex-1 transition-colors duration-300 group-hover:text-white/60">
        {step.description}
      </p>
    </article>
  );
}
