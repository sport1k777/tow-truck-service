'use client';

import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Shield, Zap } from 'lucide-react';
import { HeroArtwork } from './hero-image';

const TRUST_ITEMS = [
  { icon: Zap, label: 'Швидкий виїзд' },
  { icon: MapPin, label: 'Вся Україна' },
  { icon: Shield, label: 'Надійний сервіс' },
  { icon: Clock, label: '24/7' },
] as const;

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#030712]"
      aria-labelledby="hero-heading"
    >
      {/* Page-level ambient glow — aligned with map region, not a boxed overlay */}
      <div className="hero-artwork-ambient pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Artwork layer — bleeds into background with soft masks */}
      <HeroArtwork variant="desktop" />

      <div className="relative z-10 mx-auto grid max-w-7xl lg:min-h-screen lg:grid-cols-[minmax(0,520px)_1fr] lg:items-center xl:grid-cols-[minmax(0,560px)_1fr]">
        {/* LEFT — content */}
        <div className="flex flex-col justify-center px-6 pb-16 pt-28 sm:px-10 lg:px-14 lg:py-28 xl:px-16">
          <div
            className="hero-animate hero-animate-1 mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75 backdrop-blur-md"
            role="status"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
            </span>
            24/7 по всій Україні
          </div>

          <h1
            id="hero-heading"
            className="hero-animate hero-animate-2 max-w-[18ch] text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-5xl xl:text-[3.5rem]"
          >
            Евакуатор{' '}
            <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-blue-500 bg-clip-text text-transparent">
              за 30 секунд
            </span>
          </h1>

          <p className="hero-animate hero-animate-3 mt-6 max-w-md text-base leading-[1.7] text-white/55 sm:text-[1.0625rem]">
            Професійна евакуація автомобілів по всій Україні. Миттєвий розрахунок вартості,
            маршрут на карті та онлайн-замовлення — без зайвих дзвінків і очікування.
          </p>

          <div className="hero-animate hero-animate-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/order"
              className="hero-cta-primary group inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full px-8 text-[0.9375rem] font-semibold text-white transition-all duration-300"
            >
              Замовити евакуатор
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/order"
              className="hero-cta-secondary inline-flex h-[3.25rem] items-center justify-center rounded-full px-8 text-[0.9375rem] font-medium text-white/85"
            >
              Розрахувати вартість
            </Link>
          </div>

          <ul
            className="hero-animate hero-animate-5 mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.08] pt-8 sm:max-w-lg"
            aria-label="Переваги сервісу"
          >
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
                  <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-white/80">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — spatial balance; artwork renders via absolute layer */}
        <div className="hidden lg:block" aria-hidden="true" />
      </div>

      {/* Mobile / tablet */}
      <div className="relative z-10 px-2 pb-20 pt-6 sm:px-4 sm:pt-8 lg:hidden">
        <HeroArtwork variant="mobile" priority={false} />
      </div>
    </section>
  );
}
