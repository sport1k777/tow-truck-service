import { SettingsService } from '@/modules/settings/settings.service';
import {
  AdminPageHeader,
  AdminCard,
  AdminField,
  AdminInput,
  AdminButton,
  AdminGrid,
  AdminSubmitBar,
  AdminTextarea,
} from '@/components/admin/admin-ui';
import { saveSeoAction } from '@/actions/admin.actions';

export default async function AdminSeoPage() {
  const seo = await SettingsService.getSeoSettings();

  return (
    <>
      <AdminPageHeader title="SEO" description="Title, description, keywords, OG image та canonical URL." />
      <AdminCard>
        <form action={saveSeoAction} className="space-y-6">
          <AdminField label="Title"><AdminInput name="title" defaultValue={seo.title} /></AdminField>
          <AdminField label="Description"><AdminTextarea name="description" defaultValue={seo.description} /></AdminField>
          <AdminField label="Keywords"><AdminInput name="keywords" defaultValue={seo.keywords} /></AdminField>
          <AdminGrid>
            <AdminField label="OG image URL"><AdminInput name="ogImage" defaultValue={seo.ogImage} /></AdminField>
            <AdminField label="Canonical URL"><AdminInput name="canonicalUrl" defaultValue={seo.canonicalUrl} /></AdminField>
          </AdminGrid>
          <AdminSubmitBar><AdminButton type="submit">Зберегти SEO</AdminButton></AdminSubmitBar>
        </form>
      </AdminCard>
    </>
  );
}
