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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Наші послуги</h1>
      <p className="mt-2 text-muted-foreground">Сторінка послуг — Phase 7.</p>
    </div>
  );
}
