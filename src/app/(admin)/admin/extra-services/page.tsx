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
  AdminTextarea,
} from '@/components/admin/admin-ui';
import { deleteExtraServiceAction, saveExtraServiceAction } from '@/actions/admin.actions';

export default async function AdminExtraServicesPage() {
  const services = await prisma.extraService.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <AdminPageHeader
        title="Додаткові послуги"
        description="Нічні, термінові, святкові та інші доплати."
      />
      <div className="space-y-6">
        {services.map((service) => (
          <AdminCard key={service.id} title={service.label}>
            <form action={saveExtraServiceAction} className="space-y-4">
              <input type="hidden" name="id" value={service.id} />
              <AdminGrid>
                <AdminField label="Slug">
                  <AdminInput name="slug" defaultValue={service.slug} required />
                </AdminField>
                <AdminField label="Назва">
                  <AdminInput name="label" defaultValue={service.label} required />
                </AdminField>
                <AdminField label="Тип">
                  <AdminSelect name="type" defaultValue={service.type}>
                    <option value="FLAT">Фіксована (₴)</option>
                    <option value="PERCENT">Відсоток (%)</option>
                  </AdminSelect>
                </AdminField>
                <AdminField label="Сума / %">
                  <AdminInput name="amount" type="number" step="0.01" defaultValue={Number(service.amount)} />
                </AdminField>
                <AdminField label="Порядок">
                  <AdminInput name="sortOrder" type="number" defaultValue={service.sortOrder} />
                </AdminField>
                <AdminField label="Увімкнено">
                  <input type="checkbox" name="enabled" defaultChecked={service.enabled} className="h-4 w-4" />
                </AdminField>
              </AdminGrid>
              <AdminField label="Config JSON" hint='Напр.: {"startHour":22,"endHour":6}'>
                <AdminTextarea name="config" defaultValue={JSON.stringify(service.config)} />
              </AdminField>
              <AdminSubmitBar>
                <AdminButton type="submit">Зберегти</AdminButton>
                <AdminButton formAction={deleteExtraServiceAction} variant="danger" type="submit">
                  Видалити
                </AdminButton>
              </AdminSubmitBar>
            </form>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
