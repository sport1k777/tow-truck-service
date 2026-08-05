'use client';

import { Star } from 'lucide-react';

type ServiceType = 'Екстрена евакуація' | 'Міжміське перевезення' | 'Евакуація після ДТП';

interface Testimonial {
  id: string;
  initials: string;
  avatarGradient: string;
  name: string;
  city: string;
  review: string;
  serviceType: ServiceType;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'andrii-kyiv',
    initials: 'АК',
    avatarGradient: 'from-sky-500/40 to-blue-600/30',
    name: 'Андрій',
    city: 'Київ',
    review:
      'Зламалась машина о півночі на Оболоні. Евакуатор приїхав за 35 хвилин, водій професійний. Ціна збіглася з калькулятором на сайті.',
    serviceType: 'Екстрена евакуація',
  },
  {
    id: 'olena-lviv',
    initials: 'ОЛ',
    avatarGradient: 'from-violet-500/35 to-blue-600/25',
    name: 'Олена',
    city: 'Львів',
    review:
      'Потрібно було перевезти авто до Харкова. Усе чітко по часу, жодних прихованих доплат. Рекомендую для міжміських перевезень.',
    serviceType: 'Міжміське перевезення',
  },
  {
    id: 'viktor-odesa',
    initials: 'ВМ',
    avatarGradient: 'from-cyan-500/35 to-sky-600/25',
    name: 'Віктор',
    city: 'Одеса',
    review:
      'Після ДТП на трасі швидко організували евакуацію. Авто доставили на СТО без додаткових пошкоджень. Дякую за спокій у стресовій ситуації.',
    serviceType: 'Евакуація після ДТП',
  },
  {
    id: 'maria-kharkiv',
    initials: 'МС',
    avatarGradient: 'from-blue-500/35 to-indigo-600/25',
    name: 'Марія',
    city: 'Харків',
    review:
      'Замовила через сайт за хвилину — дуже зручно. Оператор передзвонив, підтвердив адресу, евакуатор був на місці швидше, ніж очікувала.',
    serviceType: 'Екстрена евакуація',
  },
  {
    id: 'dmytro-dnipro',
    initials: 'ДК',
    avatarGradient: 'from-teal-500/30 to-blue-600/25',
    name: 'Дмитро',
    city: 'Дніпро',
    review:
      'Везли позашляховик у інше місто — 400 км без проблем. Водій тримав звʼязок у дорозі, авто прибуло вчасно і в ідеальному стані.',
    serviceType: 'Міжміське перевезення',
  },
  {
    id: 'natalia-vinnytsia',
    initials: 'НП',
    avatarGradient: 'from-sky-400/35 to-blue-500/30',
    name: 'Наталія',
    city: 'Вінниця',
    review:
      'Потрапили в незначну аварію в центрі міста. Приїхали оперативно, акуратно завантажили авто. Сервіс на високому рівні, буду звертатись знову.',
    serviceType: 'Евакуація після ДТП',
  },
];

const SERVICE_TYPE_STYLES: Record<ServiceType, string> = {
  'Екстрена евакуація': 'border-sky-500/20 bg-sky-500/10 text-sky-300/90',
  'Міжміське перевезення': 'border-blue-500/20 bg-blue-500/10 text-blue-300/90',
  'Евакуація після ДТП': 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300/90',
};

interface TestimonialsSectionProps {
  companyName: string;
}

export function TestimonialsSection({ companyName }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="landing-section" aria-labelledby="testimonials-heading">
      <div className="landing-section-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(59,130,246,0.07),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="landing-section-divider" aria-hidden="true" />

      <div className="landing-container">
        <div className="landing-header">
          <p className="landing-eyebrow">Відгуки клієнтів</p>
          <h2 id="testimonials-heading" className="landing-title">
            Клієнти довіряють {companyName}
          </h2>
          <p className="landing-subtitle">Реальні відгуки клієнтів з різних міст України.</p>
        </div>

        <ul
          className="testimonial-carousel -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:snap-none md:px-0 md:pb-0"
          aria-label="Відгуки клієнтів"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <li
              key={testimonial.id}
              className="testimonial-card-animate w-[min(85vw,320px)] shrink-0 snap-center md:w-auto md:shrink"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-center gap-2 text-center">
          <StarRating count={5} size="lg" />
          <p className="text-sm font-medium text-white/70">Відгуки наших клієнтів</p>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="testimonial-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-md">
      <div className="landing-card-glow" aria-hidden="true" />

      <div className="relative flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-gradient-to-br ${testimonial.avatarGradient} text-sm font-semibold text-white/90`}
          aria-hidden="true"
        >
          {testimonial.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">
            {testimonial.name}
            <span className="font-normal text-white/35"> — </span>
            <span className="font-normal text-white/55">{testimonial.city}</span>
          </p>
          <div className="mt-1.5">
            <StarRating count={5} size="sm" />
          </div>
        </div>
      </div>

      <blockquote className="landing-body relative mt-4 flex-1 transition-colors duration-300 group-hover:text-white/60">
        &ldquo;{testimonial.review}&rdquo;
      </blockquote>

      <p className="relative mt-4">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${SERVICE_TYPE_STYLES[testimonial.serviceType]}`}
        >
          {testimonial.serviceType}
        </span>
      </p>
    </article>
  );
}

function StarRating({ count, size }: { count: number; size: 'sm' | 'lg' }) {
  const starSize = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  const gap = size === 'lg' ? 'gap-1' : 'gap-0.5';

  return (
    <div className={`flex items-center justify-center ${gap}`} role="img" aria-label={`${count} з 5 зірок`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={`${starSize} fill-amber-400 text-amber-400`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
