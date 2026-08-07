'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminButton, AdminField, AdminInput, AdminAlert, AdminCard } from './admin-ui';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError('Невірний email або пароль');
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="admin-theme flex min-h-screen items-center justify-center bg-[#030712] px-4">
      <AdminCard className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Вхід в адмін-панель</h1>
          <p className="mt-2 text-sm text-white/60">Email і пароль адміністратора</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <AdminAlert type="error">{error}</AdminAlert> : null}
          <AdminField label="Email">
            <AdminInput
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </AdminField>
          <AdminField label="Пароль">
            <AdminInput
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </AdminField>
          <AdminButton type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Вхід…' : 'Увійти'}
          </AdminButton>
        </form>
      </AdminCard>
    </div>
  );
}
