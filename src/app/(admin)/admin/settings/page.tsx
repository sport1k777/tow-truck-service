import { SettingsService } from '@/modules/settings/settings.service';
import { SETTING_KEYS } from '@/modules/settings/settings.defaults';
import {
  AdminPageHeader,
  AdminCard,
  AdminField,
  AdminInput,
  AdminButton,
  AdminGrid,
  AdminSubmitBar,
} from '@/components/admin/admin-ui';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { saveSettingsAction } from '@/actions/admin.actions';

export default async function AdminSettingsPage() {
  const settings = await SettingsService.getBusinessSettings();
  const faviconUrl = (await SettingsService.get(SETTING_KEYS.FAVICON_URL)) ?? '';

  return (
    <>
      <AdminPageHeader
        title="Налаштування"
        description="Логотип, favicon, кольори бренду, соціальні мережі та карта."
      />
      <AdminCard>
        <form action={saveSettingsAction} className="space-y-6">
          <AdminGrid>
            <AdminField label="URL логотипу">
              <AdminInput name="logoUrl" defaultValue={settings.logoUrl ?? ''} placeholder="/uploads/logo.png" />
            </AdminField>
            <ImageUploadField label="Завантажити логотип" />
            <AdminField label="URL favicon">
              <AdminInput name="faviconUrl" defaultValue={faviconUrl} placeholder="/uploads/favicon.ico" />
            </AdminField>
            <ImageUploadField label="Завантажити favicon" />
            <AdminField label="Основний колір">
              <AdminInput name="primaryColor" type="color" defaultValue={settings.primaryColor ?? '#0ea5e9'} />
            </AdminField>
            <AdminField label="Додатковий колір">
              <AdminInput name="secondaryColor" type="color" defaultValue={settings.secondaryColor ?? '#2563eb'} />
            </AdminField>
          </AdminGrid>

          <h3 className="text-sm font-medium text-white/80">Соціальні мережі</h3>
          <AdminGrid>
            <AdminField label="Instagram">
              <AdminInput name="instagram" defaultValue={settings.socialLinks.instagram ?? ''} />
            </AdminField>
            <AdminField label="Telegram">
              <AdminInput name="telegramSocial" defaultValue={settings.socialLinks.telegram ?? ''} />
            </AdminField>
            <AdminField label="Facebook">
              <AdminInput name="facebook" defaultValue={settings.socialLinks.facebook ?? ''} />
            </AdminField>
            <AdminField label="YouTube">
              <AdminInput name="youtube" defaultValue={settings.socialLinks.youtube ?? ''} />
            </AdminField>
          </AdminGrid>

          <h3 className="text-sm font-medium text-white/80">Центр карти за замовчуванням</h3>
          <AdminGrid>
            <AdminField label="Latitude">
              <AdminInput name="mapCenterLat" type="number" step="0.000001" defaultValue={settings.mapCenterLat} />
            </AdminField>
            <AdminField label="Longitude">
              <AdminInput name="mapCenterLng" type="number" step="0.000001" defaultValue={settings.mapCenterLng} />
            </AdminField>
            <AdminField label="Zoom">
              <AdminInput name="mapZoom" type="number" defaultValue={settings.mapZoom} />
            </AdminField>
          </AdminGrid>

          <AdminSubmitBar>
            <AdminButton type="submit">Зберегти налаштування</AdminButton>
          </AdminSubmitBar>
        </form>
      </AdminCard>
    </>
  );
}
