import { PageShell } from '@/components/layout/page-shell';
import { generatePageMetadata } from '@/modules/seo/metadata';
import { SettingsService } from '@/modules/settings/settings.service';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Контакти',
    description: 'Зв\'яжіться з нашою службою евакуації. Телефон, WhatsApp, email.',
    path: '/contact',
  });
}

export default async function ContactPage() {
  const settings = await SettingsService.getBusinessSettings();

  return (
    <PageShell title="Контакти">
      <div className="space-y-3 text-white/55">
        {settings.phone && <p>Телефон: {settings.phone}</p>}
        {settings.whatsappNumber && <p>WhatsApp: {settings.whatsappNumber}</p>}
        {settings.email && <p>Email: {settings.email}</p>}
        {!settings.phone && !settings.email && (
          <p>Контактна інформація буде налаштована в адмін-панелі.</p>
        )}
      </div>
    </PageShell>
  );
}
