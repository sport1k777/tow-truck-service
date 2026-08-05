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
  AdminSavedNotice,
  parseSavedParam,
} from '@/components/admin/admin-ui';
import { saveSeoAction } from '@/actions/admin.actions';

export default async function AdminSeoPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const seo = await SettingsService.getSeoSettings();

  return (
    <>
      <AdminPageHeader title="SEO" description="Title, description, keywords, OG image та canonical URL." />
      <AdminSavedNotice saved={parseSavedParam(params)} />
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
