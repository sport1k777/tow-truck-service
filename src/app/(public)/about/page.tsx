import { generatePageMetadata } from '@/modules/seo/metadata';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Про нас',
    description: 'Професійна служба евакуації автомобілів в Україні.',
    path: '/about',
  });
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Про нас</h1>
      <p className="mt-2 text-muted-foreground">Сторінка про компанію — Phase 7.</p>
    </div>
  );
}
