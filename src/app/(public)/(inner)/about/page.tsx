import Link from 'next/link';
import { PageShell } from '@/components/layout/page-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';
import { SettingsService } from '@/modules/settings/settings.service';

export async function generateMetadata() {
  const content = await SettingsService.getContentSettings();

  return generatePageMetadata({
    title: content.aboutTitle,
    description: content.aboutBody.slice(0, 160),
    path: '/about',
  });
}

export default async function AboutPage() {
  const content = await SettingsService.getContentSettings();

  return (
    <PageShell title={content.aboutTitle}>
      <div className="space-y-4 text-sm leading-relaxed text-white/60">
        {content.aboutBody.split('\n\n').map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
        <p>
          Детальніше про послуги та ціни — на{' '}
          <Link href="/#services" className="text-sky-400/90 hover:text-sky-300">
            головній сторінці
          </Link>
          .
        </p>
      </div>
    </PageShell>
  );
}
