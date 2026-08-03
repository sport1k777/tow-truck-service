import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Сторінку не знайдено</p>
      <Link href="/" className="text-sm underline">
        На головну
      </Link>
    </div>
  );
}
