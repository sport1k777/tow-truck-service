import { PageShell } from '@/components/layout/page-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Політика конфіденційності',
    description: 'Політика конфіденційності та обробки персональних даних.',
    path: '/privacy',
    noIndex: true,
  });
}

export default function PrivacyPage() {
  return (
    <PageShell title="Політика конфіденційності">
      <div className="space-y-4 text-sm leading-relaxed text-white/60">
        <p>
          Ми обробляємо контактні дані (ім&apos;я, телефон, адреси) виключно для організації
          послуг евакуації та зв&apos;язку з клієнтом. Дані не передаються третім особам, за
          винятком випадків, передбачених законодавством України.
        </p>
        <p>
          Надсилаючи заявку через форму на сайті, ви погоджуєтесь на обробку зазначених даних.
        </p>
      </div>
    </PageShell>
  );
}
