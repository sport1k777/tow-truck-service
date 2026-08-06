import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  onNavigate?: () => void;
}

export function BrandLogo({ className = '', onNavigate }: BrandLogoProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={`relative z-10 inline-flex min-h-11 items-center gap-2.5 rounded-lg px-1 transition-opacity hover:opacity-90 ${className}`}
      aria-label="Evakuator24 — головна"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-400/25 bg-sky-500/10 text-lg shadow-[0_0_24px_rgba(56,189,248,0.12)]" aria-hidden="true">
        🚛
      </span>
      <span className="text-base font-semibold tracking-tight text-white sm:text-[1.0625rem]">
        Евакуатор<span className="text-sky-300">24</span>
      </span>
    </Link>
  );
}
