import { generatePageMetadata } from '@/modules/seo/metadata';
import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/login-form';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Вхід в адмін-панель',
    description: 'Авторизація для адміністраторів служби евакуації.',
    path: '/login',
    noIndex: true,
  });
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="admin-theme min-h-screen bg-[#030712]" />}>
      <LoginForm />
    </Suspense>
  );
}
