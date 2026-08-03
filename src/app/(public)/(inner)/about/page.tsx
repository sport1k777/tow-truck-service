import Link from 'next/link';
import { PageShell } from '@/components/layout/page-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Про нас',
    description: 'Професійна служба евакуації автомобілів в Україні. Цілодобова підтримка та прозорі тарифи.',
    path: '/about',
  });
}

export default function AboutPage() {
  return (
    <PageShell title="Про нас">
      <div className="space-y-4 text-sm leading-relaxed text-white/60">
        <p>
          Ми надаємо послуги евакуації легкових та вантажних автомобілів по всій Україні.
          Прозорий калькулятор вартості, онлайн-замовлення та швидке підтвердження через WhatsApp.
        </p>
        <p>
          Детальніше про послуги та ціни — на{' '}
          <Link href="/#services" className="text-sky-400/90 hover:text-sky-300">
            головній сторінці
          </Link>
          .
        </p>
      </div>
    </PageShell>
  );
}
