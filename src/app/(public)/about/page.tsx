import { PageShell } from '@/components/layout/page-shell';
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
    <PageShell
      title="Про нас"
      description="Сторінка про компанію — Phase 7."
    />
  );
}
