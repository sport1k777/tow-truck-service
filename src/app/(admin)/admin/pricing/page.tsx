import { prisma } from '@/lib/prisma';
import { AdminPageHeader, AdminCard, AdminField, AdminInput, AdminButton, AdminGrid, AdminSubmitBar, AdminSavedNotice, parseSavedParam } from '@/components/admin/admin-ui';
import { savePricingAction } from '@/actions/admin.actions';

export default async function AdminPricingPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const rule = await prisma.pricingRule.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <>
      <AdminPageHeader
        title="Pricing"
        description="Base fees, per-km rates, free kilometers, and all surcharges."
      />
      <AdminSavedNotice saved={parseSavedParam(params)} />
      <AdminCard>
        <form action={savePricingAction} className="space-y-6">
          {rule ? <input type="hidden" name="ruleId" value={rule.id} /> : null}
          <AdminGrid>
            <AdminField label="Назва тарифу">
              <AdminInput name="name" defaultValue={rule?.name ?? 'Стандартний тариф'} required />
            </AdminField>
            <AdminField label="Базовий виїзд у місті (₴)">
              <AdminInput name="baseFee" type="number" step="1" defaultValue={Number(rule?.baseFee ?? 900)} required />
            </AdminField>
            <AdminField label="Базовий виїзд за містом (₴)">
              <AdminInput name="outsideCityBaseFee" type="number" step="1" defaultValue={Number(rule?.outsideCityBaseFee ?? rule?.baseFee ?? 900)} required />
            </AdminField>
            <AdminField label="Мінімальне замовлення (₴)">
              <AdminInput name="minCharge" type="number" step="1" defaultValue={Number(rule?.minCharge ?? 900)} required />
            </AdminField>
            <AdminField label="Безкоштовні км">
              <AdminInput name="freeKm" type="number" step="0.1" defaultValue={Number(rule?.freeKm ?? 0)} />
            </AdminField>
            <AdminField label="Базова ціна за км (₴)">
              <AdminInput name="perKmRate" type="number" step="0.01" defaultValue={Number(rule?.perKmRate ?? 25)} required />
            </AdminField>
            <AdminField label="Ціна за км у місті (₴)">
              <AdminInput name="cityPerKmRate" type="number" step="0.01" defaultValue={Number(rule?.cityPerKmRate ?? 25)} required />
            </AdminField>
            <AdminField label="Ціна за км за містом (₴)">
              <AdminInput name="outsideCityPerKmRate" type="number" step="0.01" defaultValue={Number(rule?.outsideCityPerKmRate ?? 30)} required />
            </AdminField>
            <AdminField label="Термінова подача (₴)">
              <AdminInput name="emergencySurchargeFlat" type="number" step="1" defaultValue={Number(rule?.emergencySurchargeFlat ?? 300)} />
            </AdminField>
            <AdminField label="Складне навантаження (₴)">
              <AdminInput name="difficultLoadingSurcharge" type="number" step="1" defaultValue={Number(rule?.difficultLoadingSurcharge ?? 500)} />
            </AdminField>
            <AdminField label="Нічна доплата (%)">
              <AdminInput name="nightSurchargePercent" type="number" step="0.01" defaultValue={Number(rule?.nightSurchargePercent ?? 20)} />
            </AdminField>
            <AdminField label="Ніч з (год)">
              <AdminInput name="nightStartHour" type="number" min="0" max="23" defaultValue={rule?.nightStartHour ?? 22} />
            </AdminField>
            <AdminField label="Ніч до (год)">
              <AdminInput name="nightEndHour" type="number" min="0" max="23" defaultValue={rule?.nightEndHour ?? 6} />
            </AdminField>
            <AdminField label="Вихідні (%)">
              <AdminInput name="weekendSurchargePercent" type="number" step="0.01" defaultValue={Number(rule?.weekendSurchargePercent ?? 15)} />
            </AdminField>
            <AdminField label="Святкова доплата (%)">
              <AdminInput name="holidaySurchargePercent" type="number" step="0.01" defaultValue={Number(rule?.holidaySurchargePercent ?? 30)} />
            </AdminField>
          </AdminGrid>
          <AdminSubmitBar>
            <AdminButton type="submit">Save pricing</AdminButton>
          </AdminSubmitBar>
        </form>
      </AdminCard>
    </>
  );
}
