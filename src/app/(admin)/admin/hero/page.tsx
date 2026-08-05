import { prisma } from '@/lib/prisma';
import {
  AdminPageHeader,
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

export default async function AdminHeroPage() {
  const images = await prisma.heroImage.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <AdminPageHeader title="Hero зображення" description="Завантаження та керування зображеннями hero-секції." />
      <div className="space-y-6">
        {images.map((image) => (
          <AdminCard key={image.id} title={image.alt || image.url}>
            <form action={saveHeroImageAction} className="space-y-4">
              <input type="hidden" name="id" value={image.id} />
              <AdminGrid>
                <AdminField label="URL"><AdminInput name="url" defaultValue={image.url} required /></AdminField>
                <AdminField label="Alt"><AdminInput name="alt" defaultValue={image.alt} /></AdminField>
                <AdminField label="Варіант">
                  <AdminSelect name="variant" defaultValue={image.variant}>
                    <option value="BOTH">Desktop + Mobile</option>
                    <option value="DESKTOP">Desktop</option>
                    <option value="MOBILE">Mobile</option>
                  </AdminSelect>
                </AdminField>
                <AdminField label="Порядок"><AdminInput name="sortOrder" type="number" defaultValue={image.sortOrder} /></AdminField>
                <AdminField label="Активний"><input type="checkbox" name="isActive" defaultChecked={image.isActive} className="h-4 w-4" /></AdminField>
              </AdminGrid>
              <HeroImageUploadField />
              <AdminSubmitBar>
                <AdminButton type="submit">Зберегти</AdminButton>
                <AdminButton formAction={deleteHeroImageAction} variant="danger" type="submit">Видалити</AdminButton>
              </AdminSubmitBar>
            </form>
          </AdminCard>
        ))}
        <AdminCard title="Додати hero зображення">
          <form action={saveHeroImageAction} className="space-y-4">
            <AdminGrid>
              <AdminField label="URL"><AdminInput name="url" placeholder="/images/hero-background.webp" required /></AdminField>
              <AdminField label="Alt"><AdminInput name="alt" /></AdminField>
            </AdminGrid>
            <HeroImageUploadField />
            <AdminSubmitBar><AdminButton type="submit">Додати</AdminButton></AdminSubmitBar>
          </form>
        </AdminCard>
      </div>
    </>
  );
}
