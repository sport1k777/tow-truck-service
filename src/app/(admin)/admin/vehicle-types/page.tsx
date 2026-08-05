import { prisma } from '@/lib/prisma';
import {
  AdminPageHeader,
  AdminCard,
  AdminField,
  AdminInput,
  AdminButton,
  AdminGrid,
  AdminSubmitBar,
} from '@/components/admin/admin-ui';
import { deleteVehicleCategoryAction, saveVehicleCategoryAction } from '@/actions/admin.actions';
import { AdminDeleteButton } from '@/components/admin/admin-delete-button';
import { AdminTextarea } from '@/components/admin/admin-ui';

export default async function AdminVehicleTypesPage() {
  const categories = await prisma.vehicleCategory.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <>
      <AdminPageHeader
        title="Типи транспортних засобів"
        description="Категорії авто для калькулятора з індивідуальною ціною за км."
      />
      <div className="space-y-6">
        {categories.map((category) => (
          <AdminCard key={category.id} title={category.label}>
            <form action={saveVehicleCategoryAction} className="space-y-4">
              <input type="hidden" name="id" value={category.id} />
              <AdminGrid>
                <AdminField label="Slug">
                  <AdminInput name="slug" defaultValue={category.slug} required />
                </AdminField>
                <AdminField label="Назва">
                  <AdminInput name="label" defaultValue={category.label} required />
                </AdminField>
                <AdminField label="₴/км">
                  <AdminInput name="perKmRate" type="number" step="0.01" defaultValue={Number(category.perKmRate)} />
                </AdminField>
                <AdminField label="Фікс. доплата (₴)">
                  <AdminInput name="flatSurcharge" type="number" step="1" defaultValue={Number(category.flatSurcharge)} />
                </AdminField>
                <AdminField label="Іконка (Lucide)" hint="Car, Truck, Zap, Shield">
                  <AdminInput name="icon" defaultValue={category.icon ?? ''} />
                </AdminField>
                <AdminField label="Порядок">
                  <AdminInput name="sortOrder" type="number" defaultValue={category.sortOrder} />
                </AdminField>
                <AdminField label="Активний">
                  <input type="checkbox" name="isActive" defaultChecked={category.isActive} className="h-4 w-4" />
                </AdminField>
              </AdminGrid>
              <AdminField label="Опис">
                <AdminTextarea name="description" defaultValue={category.description ?? ''} className="min-h-[80px]" />
              </AdminField>
              <AdminSubmitBar>
                <AdminButton type="submit">Зберегти</AdminButton>
                <AdminDeleteButton formAction={deleteVehicleCategoryAction} />
              </AdminSubmitBar>
            </form>
          </AdminCard>
        ))}
        <AdminCard title="Додати категорію">
          <form action={saveVehicleCategoryAction} className="space-y-4">
            <AdminGrid>
              <AdminField label="Slug">
                <AdminInput name="slug" placeholder="PASSENGER_CAR" required />
              </AdminField>
              <AdminField label="Назва">
                <AdminInput name="label" placeholder="Легковий автомобіль" required />
              </AdminField>
              <AdminField label="₴/км">
                <AdminInput name="perKmRate" type="number" step="0.01" defaultValue={25} />
              </AdminField>
            <AdminField label="Фікс. доплата (₴)">
              <AdminInput name="flatSurcharge" type="number" step="1" defaultValue={0} />
            </AdminField>
            <AdminField label="Іконка">
              <AdminInput name="icon" placeholder="Car" />
            </AdminField>
            <AdminField label="Порядок">
                <AdminInput name="sortOrder" type="number" defaultValue={categories.length} />
              </AdminField>
            </AdminGrid>
            <AdminSubmitBar>
              <AdminButton type="submit">Додати</AdminButton>
            </AdminSubmitBar>
          </form>
        </AdminCard>
      </div>
    </>
  );
}
