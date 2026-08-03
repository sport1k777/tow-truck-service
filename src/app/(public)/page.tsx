import Link from 'next/link';
import { generatePageMetadata } from '@/modules/seo/metadata';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Евакуатор — Швидкий виклик 24/7',
    description:
      'Професійна служба евакуації автомобілів у Києві та Україні. Миттєвий розрахунок вартості, онлайн-замовлення.',
    path: '/',
  });
}

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Швидкий виклик евакуатора
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Розрахуйте вартість та замовте евакуатор за лічені секунди. Цілодобова служба по всій
        Україні.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/order"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground"
        >
          Замовити евакуатор
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium"
        >
          Зв&apos;язатися з нами
        </Link>
      </div>
    </section>
  );
}
