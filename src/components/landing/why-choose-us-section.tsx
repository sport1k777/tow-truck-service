'use client';

import {
  Clock,
  Globe,
  MousePointerClick,
  Receipt,
  ShieldCheck,
  Timer,
  Truck,
  UserCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Advantage {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const ADVANTAGES: Advantage[] = [
  {
    id: 'availability',
    icon: Clock,
    title: 'Цілодобова доступність',
    description: 'Працюємо 24/7 без вихідних та свят — допомога завжди під рукою, коли це потрібно.',
  },
  {
    id: 'arrival-time',
    icon: Timer,
    title: 'Прибуття за 30–40 хвилин',
    description: 'Середній час виїзду евакуатора по місту — швидка реакція у критичній ситуації.',
  },
  {
    id: 'transparent-pricing',
    icon: Receipt,
    title: 'Прозоре ціноутворення',
    description: 'Орієнтовна вартість до замовлення — без прихованих доплат та неприємних сюрпризів.',
  },
  {
    id: 'licensed',
    icon: ShieldCheck,
    title: 'Ліцензований сервіс',
    description: 'Офіційна діяльність, страхування та дотримання стандартів безпеки перевезення.',
  },
  {
    id: 'drivers',
    icon: UserCheck,
    title: 'Досвідчені водії',
    description: 'Професійні оператори з багаторічним досвідом евакуації різних типів транспорту.',
  },
  {
    id: 'ukraine-wide',
    icon: Globe,
    title: 'По всій Україні',
    description: 'Обслуговуємо міста по всій Україні — від міської евакуації до міжміських перевезень.',
  },
  {
    id: 'modern-fleet',
    icon: Truck,
    title: 'Сучасний автопарк',
    description: 'Надійні евакуатори для легкових авто, SUV, мінівенів та комерційного транспорту.',
  },
  {
    id: 'online-booking',
    icon: MousePointerClick,
    title: 'Миттєве онлайн-замовлення',
    description: 'Замовте евакуатор за 30 секунд через сайт — без довгих очікувань на лінії.',
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="landing-section" aria-labelledby="why-choose-heading">
      <div className="landing-section-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="landing-section-divider" aria-hidden="true" />

      <div className="landing-container">
        <div className="landing-header">
          <p className="landing-eyebrow">Наші переваги</p>
          <h2 id="why-choose-heading" className="landing-title">
            Чому нам довіряють тисячі водіїв
          </h2>
          <p className="landing-subtitle">
            Надійність, швидкість і прозорість — три принципи, на яких побудовано наш сервіс
            евакуації
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {ADVANTAGES.map((advantage, index) => (
            <li
              key={advantage.id}
              className="trust-card-animate"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <AdvantageCard advantage={advantage} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AdvantageCard({ advantage }: { advantage: Advantage }) {
  const Icon = advantage.icon;

  return (
    <article className="trust-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-md">
      <div className="landing-card-glow" aria-hidden="true" />

      {/* Check accent */}
      <div
        className="absolute right-5 top-5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-bold text-emerald-400 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      >
        ✓
      </div>

      <div className="landing-icon-box relative">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <h3 className="landing-card-title relative mt-5">{advantage.title}</h3>
      <p className="landing-body relative mt-2 transition-colors duration-300 group-hover:text-white/60">
        {advantage.description}
      </p>
    </article>
  );
}
