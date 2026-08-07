import { SettingsService } from '@/modules/settings/settings.service';
import {
  AdminCard,
  AdminField,
  AdminButton,
  AdminSubmitBar,
} from '@/components/admin/admin-ui';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import { saveGalleryAction } from '@/actions/admin.actions';

export async function AdminGallerySection() {
  const images = await SettingsService.getGalleryImages();

  return (
    <AdminCard title="Gallery images">
      <form action={saveGalleryAction} className="space-y-4">
        <AdminField label="Gallery JSON" hint="Array of { url, alt, sortOrder } — use upload fields below and paste URLs">
          <textarea
            name="galleryImages"
            defaultValue={JSON.stringify(images, null, 2)}
            className="min-h-[160px] w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-sm text-white"
          />
        </AdminField>
        <ImageUploadField label="Upload gallery image" />
        <AdminSubmitBar>
          <AdminButton type="submit">Save gallery</AdminButton>
        </AdminSubmitBar>
      </form>
    </AdminCard>
  );
}
