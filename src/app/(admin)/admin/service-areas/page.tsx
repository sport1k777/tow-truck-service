import { prisma } from '@/lib/prisma';
import { SettingsService } from '@/modules/settings/settings.service';
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
import { saveServiceAreaAction } from '@/actions/admin.actions';

export default async function AdminServiceAreasPage() {
  const [settings, area] = await Promise.all([
    SettingsService.getServiceAreaSettings(),
    prisma.serviceArea.findFirst({ where: { isActive: true }, orderBy: { priority: 'asc' } }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Зона обслуговування"
        description="Оберіть дозволені регіони або радіус обслуговування."
      />
      <AdminCard>
        <form action={saveServiceAreaAction} className="space-y-6">
          {area ? <input type="hidden" name="areaId" value={area.id} /> : null}
          <AdminGrid>
            <AdminField label="Режим">
              <AdminSelect name="mode" defaultValue={settings.mode}>
                <option value="regions">Дозволені регіони</option>
                <option value="radius">Радіус від центру</option>
              </AdminSelect>
            </AdminField>
            <AdminField label="Назва зони">
              <AdminInput name="areaName" defaultValue={settings.areaName} />
            </AdminField>
            <AdminField label="Перевірка зони">
              <input type="checkbox" name="validationEnabled" defaultChecked={settings.validationEnabled} className="h-4 w-4" />
              <span className="ml-2 text-xs text-white/50">Увімкнути валідацію зони в калькуляторі</span>
            </AdminField>
          </AdminGrid>
          <AdminField label="Дозволені регіони" hint="Один регіон на рядок (укр/англ)">
            <AdminTextarea
              name="allowedRegions"
              defaultValue={settings.allowedRegions.join('\n')}
            />
          </AdminField>
          <AdminField label="Повідомлення про недоступність">
            <AdminTextarea name="outOfCoverageMessage" defaultValue={settings.outOfCoverageMessage} />
          </AdminField>
          <AdminField label="Повідомлення про доступність">
            <AdminInput name="availableMessage" defaultValue={settings.availableMessage} />
          </AdminField>
          <AdminGrid>
            <AdminField label="Назва радіуса">
              <AdminInput name="radiusName" defaultValue={area?.name ?? 'Зона обслуговування'} />
            </AdminField>
            <AdminField label="Центр lat">
              <AdminInput name="centerLat" type="number" step="0.000001" defaultValue={Number(area?.centerLat ?? 50.6199)} />
            </AdminField>
            <AdminField label="Центр lng">
              <AdminInput name="centerLng" type="number" step="0.000001" defaultValue={Number(area?.centerLng ?? 26.2516)} />
            </AdminField>
            <AdminField label="Радіус (км)">
              <AdminInput name="radiusKm" type="number" step="0.1" defaultValue={Number(area?.radiusKm ?? 50)} />
            </AdminField>
            <AdminField label="Доплата за зону (₴)">
              <AdminInput name="radiusSurcharge" type="number" step="1" defaultValue={Number(area?.surchargeAmount ?? 0)} />
            </AdminField>
          </AdminGrid>
          <AdminSubmitBar>
            <AdminButton type="submit">Зберегти зону</AdminButton>
          </AdminSubmitBar>
        </form>
      </AdminCard>
    </>
  );
}
