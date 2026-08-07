import { prisma } from '@/lib/prisma';
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminButton,
  AdminGrid,
  AdminSubmitBar,
  AdminSelect,
} from '@/components/admin/admin-ui';
import { deleteHeroImageAction, saveHeroImageAction } from '@/actions/admin.actions';
import { HeroImageUploadField } from '@/components/admin/hero-image-upload-field';
import { AdminDeleteButton } from '@/components/admin/admin-delete-button';

export async function AdminHeroImagesSection() {
  const images = await prisma.heroImage.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-white/80">Hero images</h3>
      {images.map((image) => (
        <AdminCard key={image.id} title={image.alt || image.url}>
          <form action={saveHeroImageAction} className="space-y-4">
            <input type="hidden" name="id" value={image.id} />
            <AdminGrid>
              <AdminField label="URL">
                <AdminInput name="url" defaultValue={image.url} required />
              </AdminField>
              <AdminField label="Alt">
                <AdminInput name="alt" defaultValue={image.alt} />
              </AdminField>
              <AdminField label="Variant">
                <AdminSelect name="variant" defaultValue={image.variant}>
                  <option value="BOTH">Desktop + Mobile</option>
                  <option value="DESKTOP">Desktop</option>
                  <option value="MOBILE">Mobile</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Sort order">
                <AdminInput name="sortOrder" type="number" defaultValue={image.sortOrder} />
              </AdminField>
              <AdminField label="Active">
                <input type="checkbox" name="isActive" defaultChecked={image.isActive} className="h-4 w-4" />
              </AdminField>
            </AdminGrid>
            <HeroImageUploadField />
            <AdminSubmitBar>
              <AdminButton type="submit">Save</AdminButton>
              <AdminDeleteButton formAction={deleteHeroImageAction} />
            </AdminSubmitBar>
          </form>
        </AdminCard>
      ))}
      <AdminCard title="Add hero image">
        <form action={saveHeroImageAction} className="space-y-4">
          <AdminGrid>
            <AdminField label="URL">
              <AdminInput name="url" placeholder="/tow-truck.png" required />
            </AdminField>
            <AdminField label="Alt">
              <AdminInput name="alt" />
            </AdminField>
          </AdminGrid>
          <HeroImageUploadField />
          <AdminSubmitBar>
            <AdminButton type="submit">Add</AdminButton>
          </AdminSubmitBar>
        </form>
      </AdminCard>
    </div>
  );
}
