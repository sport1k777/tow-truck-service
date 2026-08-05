import { prisma } from '@/lib/prisma';
import { SettingsService } from '@/modules/settings/settings.service';
import { UKRAINE_OBLASTS } from '@/lib/ukraine-oblasts';
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
  AdminSavedNotice,
  parseSavedParam,
} from '@/components/admin/admin-ui';
import { saveCitiesAction, saveServiceAreaAction } from '@/actions/admin.actions';

export default async function AdminServiceAreasPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const [settings, area, cities] = await Promise.all([
    SettingsService.getServiceAreaSettings(),
    prisma.serviceArea.findFirst({ where: { isActive: true }, orderBy: { priority: 'asc' } }),
    prisma.city.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const selectedOblasts = new Set(settings.allowedOblastIds);
  const homeCityId = settings.homeCityId ?? cities.find((c) => c.isDefault)?.id ?? '';

  return (
    <>
      <AdminPageHeader
        title="Service Area"
        description="Allowed oblasts, cities, home city, free city radius, and calculator validation."
      />
      <AdminSavedNotice saved={parseSavedParam(params)} />

      <AdminCard title="Coverage policy">
        <form action={saveServiceAreaAction} className="space-y-6">
          {area ? <input type="hidden" name="areaId" value={area.id} /> : null}
          <AdminGrid>
            <AdminField label="Mode">
              <AdminSelect name="mode" defaultValue={settings.mode}>
                <option value="regions">Allowed oblasts</option>
                <option value="radius">Radius from home city</option>
              </AdminSelect>
            </AdminField>
            <AdminField label="Area name">
              <AdminInput name="areaName" defaultValue={settings.areaName} />
            </AdminField>
            <AdminField label="Home city">
              <AdminSelect name="homeCityId" defaultValue={homeCityId}>
                <option value="">Select home city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Free city radius (km)" hint="Both endpoints inside this radius waive per-km charges">
              <AdminInput name="freeCityRadiusKm" type="number" step="0.1" defaultValue={settings.freeCityRadiusKm} />
            </AdminField>
            <AdminField label="Calculator validation">
              <input type="checkbox" name="validationEnabled" defaultChecked={settings.validationEnabled} className="h-4 w-4" />
              <span className="ml-2 text-xs text-white/50">Reject routes outside the service area</span>
            </AdminField>
          </AdminGrid>

          <AdminField label="Allowed oblasts">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {UKRAINE_OBLASTS.map((oblast) => (
                <label key={oblast.id} className="flex items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    name="oblastIds"
                    value={oblast.id}
                    defaultChecked={selectedOblasts.has(oblast.id)}
                    className="h-4 w-4"
                  />
                  {oblast.label}
                </label>
              ))}
            </div>
          </AdminField>

          <AdminField label="Custom regions (optional)" hint="One region per line — used if no oblasts selected">
            <AdminTextarea name="allowedRegions" defaultValue={settings.allowedRegions.join('\n')} />
          </AdminField>

          <AdminField label="Out of coverage message">
            <AdminTextarea name="outOfCoverageMessage" defaultValue={settings.outOfCoverageMessage} />
          </AdminField>
          <AdminField label="Available message">
            <AdminInput name="availableMessage" defaultValue={settings.availableMessage} />
          </AdminField>

          <AdminGrid>
            <AdminField label="Radius name">
              <AdminInput name="radiusName" defaultValue={area?.name ?? 'Service area'} />
            </AdminField>
            <AdminField label="Center latitude">
              <AdminInput name="centerLat" type="number" step="0.000001" defaultValue={Number(area?.centerLat ?? 50.6199)} />
            </AdminField>
            <AdminField label="Center longitude">
              <AdminInput name="centerLng" type="number" step="0.000001" defaultValue={Number(area?.centerLng ?? 26.2516)} />
            </AdminField>
            <AdminField label="Service radius (km)">
              <AdminInput name="radiusKm" type="number" step="0.1" defaultValue={Number(area?.radiusKm ?? settings.cityServiceRadiusKm)} />
            </AdminField>
            <AdminField label="Zone surcharge (₴)">
              <AdminInput name="radiusSurcharge" type="number" step="1" defaultValue={Number(area?.surchargeAmount ?? 0)} />
            </AdminField>
          </AdminGrid>

          <AdminSubmitBar>
            <AdminButton type="submit">Save service area</AdminButton>
          </AdminSubmitBar>
        </form>
      </AdminCard>

      <AdminCard title="Cities">
        <form action={saveCitiesAction} className="space-y-4">
          <div className="space-y-3">
            {cities.map((city) => (
              <label key={city.id} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                <span className="text-sm text-white">
                  {city.name}
                  {city.isDefault ? <span className="ml-2 text-xs text-sky-300">Home city</span> : null}
                </span>
                <span className="flex items-center gap-2 text-sm text-white/70">
                  Active
                  <input
                    type="checkbox"
                    name={`city_active_${city.id}`}
                    defaultChecked={city.isActive}
                    className="h-4 w-4"
                  />
                </span>
              </label>
            ))}
          </div>
          <AdminSubmitBar>
            <AdminButton type="submit">Save cities</AdminButton>
          </AdminSubmitBar>
        </form>
      </AdminCard>
    </>
  );
}
