import { PageShell } from '@/components/layout/page-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Часті запитання',
    description: 'Відповіді на найпоширеніші запитання про послуги евакуації.',
    path: '/faq',
  });
}

export default function FaqPage() {
  return (
    <PageShell
      title="Часті запитання"
      description="FAQ — Phase 7."
    />
  );
}
