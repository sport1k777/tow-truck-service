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
import { saveContentAction } from '@/actions/admin.actions';

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const content = await SettingsService.getContentSettings();

  return (
    <>
      <AdminPageHeader
        title="Website Content"
        description="Hero section, CTA buttons, about page, and footer tagline."
      />
      <AdminSavedNotice saved={parseSavedParam(params)} />
      <AdminCard>
        <form action={saveContentAction} className="space-y-6">
          <h3 className="text-sm font-medium text-white/80">Hero-секція</h3>
          <AdminGrid>
            <AdminField label="Бейдж">
              <AdminInput name="heroBadge" defaultValue={content.heroBadge} />
            </AdminField>
            <AdminField label="Заголовок">
              <AdminInput name="heroTitle" defaultValue={content.heroTitle} />
            </AdminField>
            <AdminField label="Акцент у заголовку">
              <AdminInput name="heroTitleHighlight" defaultValue={content.heroTitleHighlight} />
            </AdminField>
            <AdminField label="CTA — основна кнопка">
              <AdminInput name="heroCtaPrimary" defaultValue={content.heroCtaPrimary} />
            </AdminField>
            <AdminField label="CTA — вторинна кнопка">
              <AdminInput name="heroCtaSecondary" defaultValue={content.heroCtaSecondary} />
            </AdminField>
          </AdminGrid>
          <AdminField label="Підзаголовок">
            <AdminTextarea name="heroSubtitle" defaultValue={content.heroSubtitle} />
          </AdminField>
          <AdminField
            label="Переваги (JSON)"
            hint='[{"label":"Швидкий виїзд","icon":"Zap"},{"label":"24/7","icon":"Clock"}]'
          >
            <AdminTextarea name="trustItems" defaultValue={JSON.stringify(content.heroTrustItems, null, 2)} />
          </AdminField>

          <h3 className="text-sm font-medium text-white/80">Сторінка «Про нас»</h3>
          <AdminField label="Заголовок">
            <AdminInput name="aboutTitle" defaultValue={content.aboutTitle} />
          </AdminField>
          <AdminField label="Текст">
            <AdminTextarea name="aboutBody" defaultValue={content.aboutBody} className="min-h-[160px]" />
          </AdminField>

          <AdminField label="Текст у футері">
            <AdminTextarea name="footerTagline" defaultValue={content.footerTagline} />
          </AdminField>

          <AdminSubmitBar>
            <AdminButton type="submit">Save content</AdminButton>
          </AdminSubmitBar>
        </form>
      </AdminCard>
    </>
  );
}
