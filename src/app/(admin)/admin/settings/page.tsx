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
  AdminSavedNotice,
  parseSavedParam,
} from '@/components/admin/admin-ui';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { AdminHeroImagesSection } from '@/components/admin/admin-hero-images';
import { saveSettingsAction } from '@/actions/admin.actions';

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const settings = await SettingsService.getBusinessSettings();
  const faviconUrl = (await SettingsService.get(SETTING_KEYS.FAVICON_URL)) ?? '';

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Logo, favicon, hero images, brand colors, social links, and map defaults."
      />
      <AdminSavedNotice saved={parseSavedParam(params)} />
      <AdminCard>
        <form action={saveSettingsAction} className="space-y-6">
          <AdminGrid>
            <AdminField label="Logo URL">
              <AdminInput name="logoUrl" defaultValue={settings.logoUrl ?? ''} placeholder="/uploads/logo.png" />
            </AdminField>
            <ImageUploadField label="Upload logo" />
            <AdminField label="Favicon URL">
              <AdminInput name="faviconUrl" defaultValue={faviconUrl} placeholder="/uploads/favicon.ico" />
            </AdminField>
            <ImageUploadField label="Upload favicon" />
            <AdminField label="Primary color">
              <AdminInput name="primaryColor" type="color" defaultValue={settings.primaryColor ?? '#0ea5e9'} />
            </AdminField>
            <AdminField label="Secondary color">
              <AdminInput name="secondaryColor" type="color" defaultValue={settings.secondaryColor ?? '#2563eb'} />
            </AdminField>
          </AdminGrid>

          <h3 className="text-sm font-medium text-white/80">Social links</h3>
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

          <h3 className="text-sm font-medium text-white/80">Default map center</h3>
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
            <AdminButton type="submit">Save settings</AdminButton>
          </AdminSubmitBar>
        </form>
      </AdminCard>

      <div className="mt-8">
        <AdminHeroImagesSection />
      </div>
    </>
  );
}
