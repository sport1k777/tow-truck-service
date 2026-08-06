'use client';

import Link from 'next/link';
import {
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  getDisplayPhone,
  getTelHref,
  getWhatsAppHref,
} from '@/lib/contact';
import { getPublicEmail } from '@/lib/contact-display';

interface ContactCtaSectionProps {
  phone: string;
  whatsappNumber: string | null;
  email: string | null;
  workingHours: string | null;
}

export function ContactCtaSection({
  phone,
  whatsappNumber,
  email,
  workingHours,
}: ContactCtaSectionProps) {
  const displayPhone = getDisplayPhone(phone);
  const displayWhatsApp = getDisplayPhone(whatsappNumber || phone);
  const displayEmail = getPublicEmail(email);
  const displayHours = workingHours || '24/7';

  const contactCards: {
    id: string;
    icon: LucideIcon;
    label: string;
    value: string;
    href?: string;
  }[] = [
    {
      id: 'phone',
      icon: Phone,
      label: 'Телефон',
      value: displayPhone,
      href: getTelHref(),
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      value: displayWhatsApp,
      href: getWhatsAppHref(),
    },
    ...(displayEmail
      ? [
          {
            id: 'email',
            icon: Mail,
            label: 'Email',
            value: displayEmail,
            href: `mailto:${displayEmail}`,
          },
        ]
      : []),
    {
      id: 'hours',
      icon: Clock,
      label: 'Години роботи',
      value: displayHours,
    },
    {
      id: 'area',
      icon: Globe,
      label: 'Зона обслуговування',
      value: 'Вся Україна',
    },
  ];

  return (
    <section id="contact" className="landing-section" aria-labelledby="contact-cta-heading">
      <div className="landing-section-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_100%,rgba(59,130,246,0.1),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="landing-section-divider" aria-hidden="true" />

      <div className="landing-container">
        <div className="contact-cta-animate landing-panel relative px-6 py-12 text-center sm:px-10 sm:py-14 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgba(59,130,246,0.12),transparent_65%)]"
            aria-hidden="true"
          />

          <p className="landing-eyebrow relative">Контакти</p>
          <h2 id="contact-cta-heading" className="landing-title relative">
            Потрібен евакуатор зараз?
          </h2>
          <p className="landing-subtitle relative mx-auto max-w-xl">
            Працюємо цілодобово по всій Україні. Отримайте миттєву оцінку вартості та викличте
            евакуатор за кілька хвилин.
          </p>

          <div className="relative mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Link
              href="/order"
              className="hero-cta-primary group inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full px-8 text-[0.9375rem] font-semibold text-white transition-all duration-300 sm:min-w-[14rem]"
            >
              <span aria-hidden="true">🚚</span>
              Замовити евакуатор
            </Link>
            <a
              href={getWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-whatsapp hero-cta-secondary group inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full px-8 text-[0.9375rem] font-medium text-white"
            >
              <span aria-hidden="true">💬</span>
              Написати в WhatsApp
            </a>
            <a
              href={getTelHref()}
              className="cta-phone hero-cta-secondary group inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full px-8 text-[0.9375rem] font-medium text-white"
            >
              <span aria-hidden="true">📞</span>
              {displayPhone}
            </a>
          </div>
        </div>

        {/* Contact cards + map */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <ul className="grid gap-4 sm:grid-cols-2">
            {contactCards.map((card, index) => (
              <li
                key={card.id}
                className="contact-card-animate sm:last:odd:col-span-2 lg:last:col-span-1"
                style={{ animationDelay: `${0.1 + index * 0.06}s` }}
              >
                <ContactCard card={card} />
              </li>
            ))}
          </ul>

          <ContactMapPlaceholder />
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  card,
}: {
  card: {
    id: string;
    icon: LucideIcon;
    label: string;
    value: string;
    href?: string;
  };
}) {
  const Icon = card.icon;
  const content = (
    <>
      <div className="landing-card-glow" aria-hidden="true" />

      <div className="landing-icon-box relative">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <p className="relative mt-4 text-xs font-medium uppercase tracking-wider text-white/70">
        {card.label}
      </p>
      <p className="relative mt-1 text-sm font-semibold text-white/90 transition-colors duration-300 group-hover:text-white">
        {card.value}
      </p>
    </>
  );

  const className =
    'contact-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-md';

  if (card.href) {
    return (
      <a href={card.href} className={className}>
        {content}
      </a>
    );
  }

  return <article className={className}>{content}</article>;
}

function ContactMapPlaceholder() {
  return (
    <div
      className="contact-map-placeholder contact-card-animate relative min-h-[280px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a1628] sm:min-h-[320px]"
      style={{ animationDelay: '0.4s' }}
      aria-label="Попередній перегляд карти"
      role="img"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(56,189,248,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(59,130,246,0.14),transparent)]"
        aria-hidden="true"
      />

      {/* Stylized roads */}
      <svg
        className="absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 400 280"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M 0 140 L 400 140"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
        />
        <path
          d="M 200 0 L 200 280"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
        />
        <path
          d="M 60 220 C 140 160, 260 100, 340 60"
          fill="none"
          stroke="rgba(56,189,248,0.2)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      </svg>

      {/* Map controls placeholder */}
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#030712]/80 text-white/60 backdrop-blur-md">
          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      </div>

      {/* Center pin */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/20 shadow-[0_0_32px_rgba(56,189,248,0.35)] backdrop-blur-sm">
          <MapPin className="h-5 w-5 text-sky-400" aria-hidden="true" />
        </div>
        <div className="mt-1 h-2 w-2 rotate-45 rounded-sm bg-sky-400/80" aria-hidden="true" />
      </div>

      {/* Location label */}
      <div className="absolute bottom-3 left-3 right-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#030712]/85 px-3 py-2.5 backdrop-blur-md">
          <MapPin className="h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-white/80">По всій Україні</p>
            <p className="text-[10px] text-white/35">Зона обслуговування — вся Україна</p>
          </div>
        </div>
      </div>
    </div>
  );
}
