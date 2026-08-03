import Link from 'next/link';
import { PageShell } from '@/components/layout/page-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Часті запитання',
    description: 'Відповіді на найпоширеніші запитання про послуги евакуації.',
    path: '/faq',
  });
}

export default function FaqPage() {
  return (
    <PageShell title="Часті запитання">
      <div className="space-y-4 text-sm leading-relaxed text-white/60">
        <p>
          Найпоширеніші запитання та відповіді зібрані в розділі FAQ на головній сторінці.
        </p>
        <Link href="/#faq" className="inline-flex text-sky-400/90 transition-colors hover:text-sky-300">
          Перейти до FAQ →
        </Link>
      </div>
    </PageShell>
  );
}
