'use client';

import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Shield, Zap, type LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { HeroArtwork } from './hero-image';
import type { WebsiteContentSettings } from '@/modules/settings/settings.types';

const FALLBACK_ICONS: Record<string, LucideIcon> = {
  Zap,
  MapPin,
  Shield,
  Clock,
};

function resolveIcon(name: string): LucideIcon {
  const icon = (LucideIcons as unknown as Record<string, LucideIcon | undefined>)[name];
  return icon ?? FALLBACK_ICONS[name] ?? Zap;
}

export function HeroSection({
  desktopImageUrl,
  mobileImageUrl,
  content,
}: {
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  content?: WebsiteContentSettings;
}) {
  const badge = content?.heroBadge ?? '24/7 по всій Україні';
  const title = content?.heroTitle ?? 'Евакуатор';
  const titleHighlight = content?.heroTitleHighlight ?? 'за 30 секунд';
  const subtitle =
    content?.heroSubtitle ??
    'Професійна евакуація автомобілів по всій Україні. Миттєвий розрахунок вартості, маршрут на карті та онлайн-замовлення — без зайвих дзвінків і очікування.';
  const ctaPrimary = content?.heroCtaPrimary ?? 'Замовити евакуатор';
  const ctaSecondary = content?.heroCtaSecondary ?? 'Розрахувати вартість';
  const trustItems = content?.heroTrustItems ?? [
    { label: 'Швидкий виїзд', icon: 'Zap' },
    { label: 'Вся Україна', icon: 'MapPin' },
    { label: 'Надійний сервіс', icon: 'Shield' },
    { label: '24/7', icon: 'Clock' },
  ];

  return (
    <section
      className="relative overflow-hidden bg-[#030712]"
      aria-labelledby="hero-heading"
    >
      <div className="hero-artwork-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <HeroArtwork variant="desktop" imageUrl={desktopImageUrl} />

      <div className="relative z-10 mx-auto grid max-w-7xl lg:min-h-screen lg:grid-cols-[minmax(0,520px)_1fr] lg:items-center xl:grid-cols-[minmax(0,560px)_1fr]">
        <div className="flex flex-col justify-center px-6 pb-16 pt-28 sm:px-10 lg:px-14 lg:py-28 xl:px-16">
          <div
            className="hero-animate hero-animate-1 mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/90 backdrop-blur-md"
            role="status"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
            </span>
            {badge}
          </div>

          <h1
            id="hero-heading"
            className="hero-animate hero-animate-2 max-w-[18ch] text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-5xl xl:text-[3.5rem]"
          >
            {title}{' '}
            <span className="text-sky-300">{titleHighlight}</span>
          </h1>

          <p className="hero-animate hero-animate-3 mt-6 max-w-md text-base leading-[1.7] text-white/80 sm:text-[1.0625rem]">
            {subtitle}
          </p>

          <div className="hero-animate hero-animate-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/order"
              className="hero-cta-primary group inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full px-8 text-[0.9375rem] font-semibold text-white transition-all duration-300"
            >
              {ctaPrimary}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/order"
              className="hero-cta-secondary inline-flex h-[3.25rem] items-center justify-center rounded-full px-8 text-[0.9375rem] font-medium text-white"
            >
              {ctaSecondary}
            </Link>
          </div>

          <ul
            className="hero-animate hero-animate-5 mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.08] pt-8 sm:max-w-lg"
            aria-label="Переваги сервісу"
          >
            {trustItems.map(({ icon, label }) => {
              const Icon = resolveIcon(icon);
              return (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
                    <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-white/80">{label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>

      <div className="relative z-10 px-2 pb-20 pt-6 sm:px-4 sm:pt-8 lg:hidden">
        <HeroArtwork variant="mobile" priority={false} imageUrl={mobileImageUrl} />
      </div>
    </section>
  );
}
