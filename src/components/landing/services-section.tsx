'use client';

import {
  ArrowRight,
  BatteryCharging,
  Bike,
  Car,
  Cable,
  MapPinned,
  ShieldAlert,
  Truck,
  Bus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    id: 'emergency-tow',
    icon: Truck,
    title: 'Екстрена евакуація',
    description:
      'Цілодобовий виїзд евакуатора у будь-яку точку міста. Швидка реакція та професійне навантаження.',
  },
  {
    id: 'accident-recovery',
    icon: ShieldAlert,
    title: 'Евакуація після ДТП',
    description:
      'Безпечне транспортування пошкоджених автомобілів з місця аварії з дотриманням усіх норм.',
  },
  {
    id: 'vehicle-transport',
    icon: Car,
    title: 'Перевезення автомобілів',
    description:
      'Доставка легкових авто на СТО, стоянку або в інше місто. Надійне кріплення та контроль.',
  },
  {
    id: 'motorcycle-transport',
    icon: Bike,
    title: 'Перевезення мотоциклів',
    description:
      'Спеціалізована евакуація мотоциклів та скутерів без ризику пошкодження техніки.',
  },
  {
    id: 'suv-van-recovery',
    icon: Bus,
    title: 'Евакуація SUV та мінівенів',
    description:
      'Потужна техніка для кросоверів, позашляховиків та мінівенів будь-якої вагової категорії.',
  },
  {
    id: 'long-distance',
    icon: MapPinned,
    title: 'Евакуація на далекі відстані',
    description:
      'Міжміські перевезення по всій Україні. Фіксований маршрут, прозора ціна, комфортна доставка.',
  },
  {
    id: 'winch-recovery',
    icon: Cable,
    title: 'Лебідкова евакуація',
    description:
      'Витягнення автомобіля з кювету, снігу, бруду або важкодоступних місць за допомогою лебідки.',
  },
  {
    id: 'jump-start',
    icon: BatteryCharging,
    title: 'Прикурювання акумулятора',
    description:
      'Швидкий запуск двигуна при розрядженому акумуляторі. Виїзд майстра протягом кількох хвилин.',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="landing-section" aria-labelledby="services-heading">
      <div className="landing-section-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(59,130,246,0.07),transparent_65%)]"
        aria-hidden="true"
      />
      <div className="landing-section-divider" aria-hidden="true" />

      <div className="landing-container">
        <div className="landing-header">
          <p className="landing-eyebrow">Послуги</p>
          <h2 id="services-heading" className="landing-title">
            Повний спектр евакуаційних послуг
          </h2>
          <p className="landing-subtitle">
            Від екстреного виїзду до міжміських перевезень — професійна допомога для будь-якого
            транспорту
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {SERVICES.map((service, index) => (
            <li
              key={service.id}
              className="service-card-animate"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <article className="service-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-md">
      <div className="landing-card-glow" aria-hidden="true" />

      <div className="landing-icon-box relative">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <h3 className="landing-card-title relative mt-5">{service.title}</h3>
      <p className="landing-body relative mt-2 flex-1 transition-colors duration-300 group-hover:text-white/60">
        {service.description}
      </p>

      <a
        href="#pricing"
        className="service-learn-more relative mt-5 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-sky-400/80 transition-colors duration-300 group-hover:text-sky-300 focus-visible:outline-none focus-visible:text-sky-300 focus-visible:ring-2 focus-visible:ring-sky-400/50"
      >
        Детальніше
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </a>
    </article>
  );
}
