import Link from 'next/link';
import { PageShell } from '@/components/layout/page-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Послуги евакуації',
    description: 'Евакуація легкових та вантажних автомобілів, мотоциклів. Цілодобово по Україні.',
    path: '/services',
  });
}

export default function ServicesPage() {
  return (
    <PageShell title="Наші послуги">
      <div className="space-y-4 text-sm leading-relaxed text-white/60">
        <p>
          Евакуація після поломки, ДТП, транспортування між містами та доставка автомобілів на СТО.
          Повний перелік послуг і калькулятор вартості доступні на головній сторінці.
        </p>
        <Link
          href="/#services"
          className="inline-flex text-sky-400/90 transition-colors hover:text-sky-300"
        >
          Переглянути послуги →
        </Link>
      </div>
    </PageShell>
  );
}
