import { SettingsService } from '@/modules/settings/settings.service';
import {
  AdminPageHeader,
  AdminCard,
  AdminField,
  AdminInput,
  AdminButton,
  AdminGrid,
  AdminSubmitBar,
  AdminSavedNotice,
  parseSavedParam,
} from '@/components/admin/admin-ui';
import { saveContactsAction } from '@/actions/admin.actions';

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const settings = await SettingsService.getBusinessSettings();

  return (
    <>
      <AdminPageHeader title="Contacts" description="Phone, messengers, email, and address shown on the public site." />
      <AdminSavedNotice saved={parseSavedParam(params)} />
      <AdminCard>
        <form action={saveContactsAction} className="space-y-6">
          <AdminGrid>
            <AdminField label="Назва компанії">
              <AdminInput name="companyName" defaultValue={settings.companyName} />
            </AdminField>
            <AdminField label="Телефон">
              <AdminInput name="phone" defaultValue={settings.phone} />
            </AdminField>
            <AdminField label="WhatsApp">
              <AdminInput name="whatsapp" defaultValue={settings.whatsappNumber ?? ''} />
            </AdminField>
            <AdminField label="Telegram">
              <AdminInput name="telegram" defaultValue={settings.telegram ?? ''} />
            </AdminField>
            <AdminField label="Viber">
              <AdminInput name="viber" defaultValue={settings.viber ?? ''} />
            </AdminField>
            <AdminField label="Email">
              <AdminInput name="email" type="email" defaultValue={settings.email ?? ''} />
            </AdminField>
            <AdminField label="Адреса">
              <AdminInput name="address" defaultValue={settings.address ?? ''} />
            </AdminField>
            <AdminField label="Google Maps посилання">
              <AdminInput name="mapsLink" defaultValue={settings.mapsLink ?? ''} />
            </AdminField>
            <AdminField label="Веб-сайт">
              <AdminInput name="websiteUrl" defaultValue={settings.websiteUrl ?? ''} />
            </AdminField>
            <AdminField label="Години роботи">
              <AdminInput name="workingHours" defaultValue={settings.workingHours ?? 'Цілодобово'} />
            </AdminField>
          </AdminGrid>
          <AdminSubmitBar>
            <AdminButton type="submit">Save contacts</AdminButton>
          </AdminSubmitBar>
        </form>
      </AdminCard>
    </>
  );
}
