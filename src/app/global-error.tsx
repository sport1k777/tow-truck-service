'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    console.error('[global-error]', error.message, error.digest);
  }, [error]);

  return (
    <html lang="uk">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#030712',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '9999px',
              background: 'rgba(239,68,68,0.1)',
              marginBottom: 24,
            }}
          >
            <AlertCircle aria-hidden="true" />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Критична помилка</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Додаток тимчасово недоступний. Спробуйте оновити сторінку.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 32,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.65rem 1.25rem',
              borderRadius: '9999px',
              border: 'none',
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Оновити
          </button>
        </div>
      </body>
    </html>
  );
}
