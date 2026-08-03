import { PageShell } from '@/components/layout/page-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Послуги евакуації',
    description: 'Евакуація легкових та вантажних автомобілів, мотоциклів. Цілодобово по Україні.',
    path: '/services',
  });
}

export default function ServicesPage() {
  return (
    <PageShell
      title="Наші послуги"
      description="Сторінка послуг — Phase 7."
    />
  );
}
