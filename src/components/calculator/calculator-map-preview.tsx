'use client';

import { MapPin, Navigation } from 'lucide-react';

interface CalculatorMapPreviewProps {
  pickupAddress: string;
  destinationAddress: string;
  distanceKm?: number;
  durationMinutes?: number;
  isActive: boolean;
}

/**
 * Route map placeholder — swap inner content for Google Maps RouteMap in Phase 7.
 */
export function CalculatorMapPreview({
  pickupAddress,
  destinationAddress,
  distanceKm,
  durationMinutes,
  isActive,
}: CalculatorMapPreviewProps) {
  return (
    <div className="calculator-map relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a1628] sm:min-h-[360px] lg:min-h-0 lg:rounded-none lg:rounded-r-2xl lg:border-0 lg:border-l lg:border-white/[0.06]">
      {/* Grid texture — map canvas placeholder */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(56,189,248,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(59,130,246,0.12),transparent)]"
        aria-hidden="true"
      />

      {/* Route line placeholder */}
      <svg
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-30'}`}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <path
          d="M 80 220 C 120 180, 160 120, 200 100 S 280 80, 320 70"
          fill="none"
          stroke="url(#route-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={isActive ? '0' : '8 6'}
          className={isActive ? 'calculator-route-line' : ''}
        />
        <circle cx="80" cy="220" r="8" fill="#38bdf8" opacity={isActive ? 1 : 0.5} />
        <circle cx="320" cy="70" r="8" fill="#2563eb" opacity={isActive ? 1 : 0.5} />
      </svg>

      {/* Map UI chrome — Google Maps style controls placeholder */}
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#030712]/80 text-white/60 backdrop-blur-md">
          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      </div>

      {/* Address pills */}
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-[#030712]/85 px-3 py-2 backdrop-blur-md">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-[10px] font-bold text-sky-400">
            A
          </span>
          <p className="line-clamp-1 text-xs text-white/70">
            {pickupAddress || 'Адреса забору'}
          </p>
        </div>
        <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-[#030712]/85 px-3 py-2 backdrop-blur-md">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-400">
            B
          </span>
          <p className="line-clamp-1 text-xs text-white/70">
            {destinationAddress || 'Адреса призначення'}
          </p>
        </div>
      </div>

      {/* Route stats overlay when calculated */}
      {isActive && distanceKm !== undefined && durationMinutes !== undefined && (
        <div className="absolute right-3 top-3 flex gap-2">
          <div className="rounded-lg border border-white/10 bg-[#030712]/85 px-3 py-1.5 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Відстань</p>
            <p className="text-sm font-semibold text-white">{distanceKm} км</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#030712]/85 px-3 py-1.5 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Час</p>
            <p className="text-sm font-semibold text-white">{durationMinutes} хв</p>
          </div>
        </div>
      )}

      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <MapPin className="h-8 w-8 text-white/20" aria-hidden="true" />
            <p className="max-w-[200px] text-sm text-white/35">
              Маршрут з&apos;явиться після розрахунку
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
