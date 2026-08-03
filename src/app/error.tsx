'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        message: 'Application error boundary triggered',
        metadata: { message: error.message, digest: error.digest },
      }),
    );
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#030712] px-6 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/25 bg-red-500/10">
        <AlertCircle className="h-8 w-8 text-red-400" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-semibold text-white">Щось пішло не так</h1>
      <p className="mt-3 max-w-md text-sm text-white/55">
        Сталася непередбачена помилка. Спробуйте оновити сторінку.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="hero-cta-primary inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Спробувати ще раз
        </button>
        <Link
          href="/"
          className="hero-cta-secondary inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-white/90"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}
