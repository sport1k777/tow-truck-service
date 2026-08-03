import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#030712] px-6 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
        <SearchX className="h-8 w-8 text-sky-400/80" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium uppercase tracking-widest text-white/35">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-white">Сторінку не знайдено</h1>
      <p className="mt-3 max-w-sm text-sm text-white/55">
        Можливо, посилання застаріло або сторінку було переміщено.
      </p>
      <Link
        href="/"
        className="hero-cta-primary mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        На головну
      </Link>
    </div>
  );
}
