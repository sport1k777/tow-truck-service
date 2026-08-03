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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Часті запитання</h1>
      <p className="mt-2 text-muted-foreground">FAQ — Phase 7.</p>
    </div>
  );
}
