import { generatePageMetadata } from '@/modules/seo/metadata';

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
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 rounded-lg border p-8">
        <h1 className="text-xl font-bold">Вхід в адмін-панель</h1>
        <p className="text-sm text-muted-foreground">Форма авторизації — незабаром.</p>
      </div>
    </div>
  );
}
