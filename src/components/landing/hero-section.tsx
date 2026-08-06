'use client';

import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Shield, Zap, type LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { HeroArtwork } from './hero-image';
import { MobileHeroCanvas } from './mobile-hero-canvas';
import type { WebsiteContentSettings } from '@/modules/settings/settings.types';

const FALLBACK_ICONS: Record<string, LucideIcon> = {
  Zap,
  MapPin,
  Shield,
  Clock,
};

const MOBILE_HERO_LEAD =
  'Базування у Рівному. Професійна евакуація автомобілів по всій Україні.';

function MobileHeroTitle({ title, titleHighlight }: { title: string; titleHighlight: string }) {
  const accent = titleHighlight.replace(/^за\s*/iu, '').trim() || '30 секунд';

  return (
    <h1 id="hero-heading" className="hero-mobile-v2__title hero-animate hero-animate-2">
      <span className="block text-white">{title}</span>
      <span className="block text-white">
        за <span className="hero-mobile-v2__title-accent">{accent}</span>
      </span>
    </h1>
  );
}
const MOBILE_HERO_FEATURES = [
  { emoji: '⚡', label: 'Швидкий виїзд' },
  { emoji: '📍', label: 'Базування: Рівне' },
  { emoji: '🚚', label: 'По всій Україні' },
  { emoji: '⭐', label: '24/7' },
] as const;

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
      className="relative max-w-[100vw] overflow-x-hidden bg-[#030712] lg:overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="hero-artwork-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <HeroArtwork variant="desktop" imageUrl={desktopImageUrl} />

      <div className="relative z-10 mx-auto max-w-7xl lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,520px)_1fr] lg:items-center xl:grid-cols-[minmax(0,560px)_1fr]">
        {/* Mobile — premium hero v2 */}
        <div className="hero-mobile-v2 relative max-w-[100vw] overflow-x-hidden lg:hidden">
          <MobileHeroCanvas imageUrl={mobileImageUrl} />

          <div className="hero-mobile-v2__inner relative w-full max-w-full px-4 pb-6 pt-14">
            <p
              className="hero-mobile-v2__badge hero-animate hero-animate-1"
              role="status"
            >
              📍 Рівне • Виїзд по всій Україні 24/7
            </p>

            <MobileHeroTitle title={title} titleHighlight={titleHighlight} />

            <p className="hero-mobile-v2__lead hero-animate hero-animate-3">{MOBILE_HERO_LEAD}</p>

            <div
              className="hero-mobile-v2__artwork-spacer hero-animate hero-animate-4"
              aria-hidden="true"
            />

            <div className="hero-mobile-v2__actions hero-animate hero-animate-5">
              <Link href="/order" className="hero-mobile-v2__btn-primary hero-mobile-btn">
                {ctaPrimary}
                <ArrowRight className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
              </Link>
              <Link href="/order" className="hero-mobile-v2__btn-secondary hero-mobile-btn">
                {ctaSecondary}
              </Link>
            </div>

            <p className="hero-mobile-v2__subtitle hero-animate hero-animate-6">
              {MOBILE_HERO_LEAD}
            </p>

            <div
              className="hero-mobile-v2__features hero-animate hero-animate-7"
              aria-label="Переваги сервісу"
            >
              {MOBILE_HERO_FEATURES.map(({ emoji, label }) => (
                <div key={label} className="hero-mobile-v2__feature-card">
                  <span className="hero-mobile-v2__feature-emoji" aria-hidden="true">
                    {emoji}
                  </span>
                  <span className="hero-mobile-v2__feature-label">{label}</span>
                </div>
              ))}
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

        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}
