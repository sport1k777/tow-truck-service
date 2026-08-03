import { PageShell } from '@/components/layout/page-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Умови користування',
    description: 'Умови надання послуг евакуації.',
    path: '/terms',
    noIndex: true,
  });
}

export default function TermsPage() {
  return (
    <PageShell title="Умови користування">
      <div className="space-y-4 text-sm leading-relaxed text-white/60">
        <p>
          Орієнтовна вартість, розрахована калькулятором на сайті, може відрізнятися від фінальної
          ціни залежно від фактичних умов (відстань, тип авто, складність навантаження). Фінальну
          вартість підтверджує диспетчер перед виїздом.
        </p>
        <p>
          Послуги надаються цілодобово по території України в межах доступності евакуаторів у вашому
          регіоні.
        </p>
      </div>
    </PageShell>
  );
}
