import { SettingsService } from '@/modules/settings/settings.service';
import { prisma } from '@/lib/prisma';
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
import { savePricingAction } from '@/actions/admin.actions';

export default async function AdminPricingPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const [rule, serviceAreaSettings] = await Promise.all([
    prisma.pricingRule.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    }),
    SettingsService.getServiceAreaSettings(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Pricing"
        description="Base fees, city radius, per-km rates, minimum order, and surcharges."
      />
      <AdminSavedNotice saved={parseSavedParam(params)} />
      <AdminCard>
        <form action={savePricingAction} className="space-y-6">
          {rule ? <input type="hidden" name="ruleId" value={rule.id} /> : null}
          <input type="hidden" name="name" value={rule?.name ?? 'Стандартний тариф'} />
          <input type="hidden" name="perKmRate" value={Number(rule?.perKmRate ?? 25)} />
          <AdminGrid>
            <AdminField label="Base call-out fee (₴)">
              <AdminInput name="baseFee" type="number" step="1" defaultValue={Number(rule?.baseFee ?? 900)} required />
            </AdminField>
            <AdminField label="City service radius (km)">
              <AdminInput
                name="cityServiceRadiusKm"
                type="number"
                step="0.1"
                defaultValue={serviceAreaSettings.cityServiceRadiusKm}
              />
            </AdminField>
            <AdminField label="In-city price per km (₴)">
              <AdminInput
                name="cityPerKmRate"
                type="number"
                step="0.01"
                defaultValue={Number(rule?.cityPerKmRate ?? rule?.perKmRate ?? 25)}
                required
              />
            </AdminField>
            <AdminField label="Outside city price per km (₴)">
              <AdminInput
                name="outsideCityPerKmRate"
                type="number"
                step="0.01"
                defaultValue={Number(rule?.outsideCityPerKmRate ?? 30)}
                required
              />
            </AdminField>
            <AdminField label="Minimum order price (₴)">
              <AdminInput name="minCharge" type="number" step="1" defaultValue={Number(rule?.minCharge ?? 900)} required />
            </AdminField>
            <AdminField label="Free km (pricing waiver)">
              <AdminInput name="freeKm" type="number" step="0.1" defaultValue={Number(rule?.freeKm ?? 0)} />
            </AdminField>
            <AdminField label="Outside city base fee (₴)">
              <AdminInput
                name="outsideCityBaseFee"
                type="number"
                step="1"
                defaultValue={Number(rule?.outsideCityBaseFee ?? rule?.baseFee ?? 900)}
                required
              />
            </AdminField>
            <AdminField label="Night surcharge (%)">
              <AdminInput name="nightSurchargePercent" type="number" step="0.01" defaultValue={Number(rule?.nightSurchargePercent ?? 20)} />
            </AdminField>
            <AdminField label="Night from (hour)">
              <AdminInput name="nightStartHour" type="number" min="0" max="23" defaultValue={rule?.nightStartHour ?? 22} />
            </AdminField>
            <AdminField label="Night until (hour)">
              <AdminInput name="nightEndHour" type="number" min="0" max="23" defaultValue={rule?.nightEndHour ?? 6} />
            </AdminField>
            <AdminField label="Weekend surcharge (%)">
              <AdminInput name="weekendSurchargePercent" type="number" step="0.01" defaultValue={Number(rule?.weekendSurchargePercent ?? 15)} />
            </AdminField>
            <AdminField label="Holiday surcharge (%)">
              <AdminInput name="holidaySurchargePercent" type="number" step="0.01" defaultValue={Number(rule?.holidaySurchargePercent ?? 30)} />
            </AdminField>
            <AdminField label="Difficult loading surcharge (₴)">
              <AdminInput name="difficultLoadingSurcharge" type="number" step="1" defaultValue={Number(rule?.difficultLoadingSurcharge ?? 500)} />
            </AdminField>
            <AdminField label="Emergency surcharge (₴)">
              <AdminInput name="emergencySurchargeFlat" type="number" step="1" defaultValue={Number(rule?.emergencySurchargeFlat ?? 300)} />
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
