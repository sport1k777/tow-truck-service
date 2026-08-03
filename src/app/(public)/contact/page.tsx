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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Контакти</h1>
      <div className="mt-6 space-y-2 text-muted-foreground">
        {settings.phone && <p>Телефон: {settings.phone}</p>}
        {settings.whatsappNumber && <p>WhatsApp: {settings.whatsappNumber}</p>}
        {settings.email && <p>Email: {settings.email}</p>}
        {!settings.phone && !settings.email && (
          <p>Контактна інформація буде налаштована в адмін-панелі.</p>
        )}
      </div>
    </div>
  );
}
