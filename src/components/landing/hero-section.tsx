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
    'Професійна евакуація автомобілів по всій Україні. Миттєвий розрахунок вартості, побудова маршруту та онлайн-замовлення без зайвих дзвінків.';
  const ctaPrimary = content?.heroCtaPrimary ?? 'Розрахувати вартість';
  const ctaSecondary = content?.heroCtaSecondary ?? 'Замовити евакуатор';
  const trustItems = content?.heroTrustItems ?? [
    { label: 'Швидкий виїзд', icon: 'Zap' },
    { label: 'По всій Україні', icon: 'MapPin' },
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

      <div className="relative z-10 mx-auto max-w-7xl lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,520px)_1fr] lg:items-center xl:grid-cols-[minmax(0,560px)_1fr]">
        {/* Mobile — premium stacked hero (Apple / Tesla style) */}
        <div className="hero-mobile-stage flex flex-col px-5 pb-6 pt-[3.75rem] sm:px-8 lg:hidden">
          <div
            className="hero-animate hero-animate-1 mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.6875rem] font-medium text-white/90 backdrop-blur-md"
            role="status"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
            </span>
            {badge}
          </div>

          <div className="hero-mobile-composition flex min-h-0 flex-1 flex-col">
            <h1
              id="hero-heading"
              className="hero-mobile-title hero-animate hero-animate-2 relative z-20 max-w-[12ch] text-[1.875rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:max-w-[14ch] sm:text-[2.125rem]"
            >
              {title}{' '}
              <span className="bg-gradient-to-r from-sky-200 to-sky-400 bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            </h1>

            <div className="hero-mobile-visual hero-animate hero-animate-3 relative z-10 -mt-2 flex min-h-0 flex-[1_1_50%] flex-col justify-end sm:-mt-3">
              <div className="hero-mobile-glow pointer-events-none absolute inset-x-0 bottom-[8%] top-[15%]" aria-hidden="true" />
              <HeroArtwork variant="mobile" layout="premium" priority imageUrl={mobileImageUrl} />
            </div>

            <div className="hero-mobile-cta-panel hero-animate hero-animate-4 relative z-30 -mt-8 sm:-mt-10">
              <p className="mb-3 max-w-[28ch] text-[0.8125rem] leading-snug text-white/60">
                Професійна евакуація · швидкий виїзд · преміум-сервіс
              </p>
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/order"
                  className="hero-cta-primary group inline-flex h-11 min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-semibold text-white"
                >
                  {ctaPrimary}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/order"
                  className="hero-cta-secondary inline-flex h-11 min-h-11 items-center justify-center rounded-full px-6 text-[0.9375rem] font-medium text-white"
                >
                  {ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop — unchanged layout */}
        <div className="hidden flex-col px-5 pb-8 pt-[4.25rem] sm:px-8 sm:pt-24 lg:flex lg:justify-center lg:px-14 lg:py-28 xl:px-16">
          <div
            className="hero-animate hero-animate-1 mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-md sm:mb-5 sm:px-4 sm:py-2 sm:text-sm lg:mb-7"
            role="status"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
            </span>
            {badge}
          </div>

          <h1 className="hero-animate hero-animate-2 max-w-[14ch] text-[2rem] font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:max-w-[18ch] sm:text-[2.35rem] lg:text-5xl xl:text-[3.5rem]">
            {title}{' '}
            <span className="text-sky-300">{titleHighlight}</span>
          </h1>

          <p className="hero-animate hero-animate-3 mt-6 max-w-md text-[1.0625rem] leading-[1.7] text-white/80">
            {subtitle}
          </p>

          <div className="hero-animate hero-animate-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/order"
              className="hero-cta-primary group inline-flex h-12 min-h-12 items-center justify-center gap-2 rounded-full px-7 text-[0.9375rem] font-semibold text-white transition-all duration-300 sm:h-[3.25rem] sm:px-8"
            >
              {ctaPrimary}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/order"
              className="hero-cta-secondary inline-flex h-12 min-h-12 items-center justify-center rounded-full px-7 text-[0.9375rem] font-medium text-white sm:h-[3.25rem] sm:px-8"
            >
              {ctaSecondary}
            </Link>
          </div>

          <ul
            className="hero-animate hero-animate-5 mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.08] pt-8"
            aria-label="Переваги сервісу"
          >
            {trustItems.map(({ icon, label }) => {
              const Icon = resolveIcon(icon);
              return (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
                    <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-white/80">{label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile trust row — below first screen fold */}
        <ul
          className="hero-animate hero-animate-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/[0.08] px-5 py-6 sm:gap-x-6 sm:px-8 lg:hidden"
          aria-label="Переваги сервісу"
        >
          {trustItems.map(({ icon, label }) => {
            const Icon = resolveIcon(icon);
            return (
              <li key={label} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-[0.8125rem] font-medium leading-snug text-white/80">{label}</span>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}
