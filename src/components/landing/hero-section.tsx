'use client';

import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Shield, Zap } from 'lucide-react';

interface HeroSectionProps {
  companyName: string;
}

export function HeroSection({ companyName }: HeroSectionProps) {
  return (
    <section className="relative bg-[#030712]">
      <div className="grid min-h-[calc(100vh-4rem)] lg:min-h-screen lg:grid-cols-[minmax(0,520px)_1fr] xl:grid-cols-[minmax(0,560px)_1fr]">
        {/* Content panel — separate from image, sits in the dark quiet zone */}
        <div className="relative z-20 flex flex-col justify-center px-6 pb-12 pt-28 sm:px-10 lg:px-14 lg:pb-0 lg:pt-0 xl:px-16">
          <div className="hero-animate hero-animate-1 mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Цілодобово по всій Україні
          </div>

          <h1 className="hero-animate hero-animate-2 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-[3.25rem]">
            Евакуатор за{' '}
            <span className="bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
              30 секунд
            </span>
          </h1>

          <p className="hero-animate hero-animate-3 mt-6 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
            Миттєвий розрахунок вартості, маршрут на карті та онлайн-замовлення. Професійна
            евакуація автомобілів — швидко, надійно, по всій Україні.
          </p>

          <div className="hero-animate hero-animate-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/order"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-[#030712] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Замовити евакуатор
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-7 text-sm font-medium text-white/80 transition-all duration-300 hover:border-white/25 hover:bg-white/5 hover:text-white"
            >
              Зв&apos;язатися з нами
            </Link>
          </div>

          <div className="hero-animate hero-animate-5 mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:max-w-md">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">Миттєво</p>
                <p className="mt-0.5 text-xs text-white/45">Розрахунок за секунди</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">24/7</p>
                <p className="mt-0.5 text-xs text-white/45">Без вихідних</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">По Україні</p>
                <p className="mt-0.5 text-xs text-white/45">Київ та регіони</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">Надійно</p>
                <p className="mt-0.5 text-xs text-white/45">{companyName || 'Професійний сервіс'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image panel — image displayed as-is, no UI on top */}
        <div className="relative hidden min-h-[520px] lg:block lg:min-h-0">
          {/* Edge blend only — smooth transition from page bg to image boundary */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent xl:w-40"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#030712] to-transparent"
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed asset, must not be processed/modified by next/image */}
          <img
            src="/images/hero-background.png"
            alt="Служба евакуації автомобілів в Україні"
            className="absolute inset-0 h-full w-full object-contain object-center"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* Mobile — image below content, full asset visible, no overlays */}
      <div className="relative aspect-[1024/819] w-full lg:hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[#030712] to-transparent"
          aria-hidden="true"
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed asset, must not be processed/modified by next/image */}
        <img
          src="/images/hero-background.png"
          alt="Служба евакуації автомобілів в Україні"
          className="h-full w-full object-contain object-center"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#030712] to-transparent"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
