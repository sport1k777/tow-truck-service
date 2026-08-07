import { PageShell } from '@/components/layout/page-shell';
import { FaqSection } from '@/components/landing/faq-section';
import { ContentService } from '@/modules/content/content.service';
import { generatePageMetadata } from '@/modules/seo/metadata';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Часті запитання',
    description: 'Відповіді на найпоширеніші запитання про послуги евакуації.',
    path: '/faq',
  });
}

export default async function FaqPage() {
  const faqItems = await ContentService.getFaqItems();

  return (
    <PageShell title="Часті запитання">
      <FaqSection items={faqItems.length ? faqItems : undefined} />
    </PageShell>
  );
}
