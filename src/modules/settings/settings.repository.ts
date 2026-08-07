import { prisma } from '@/lib/prisma';
import type { Setting } from '@prisma/client';

export async function fetchAllSettings(): Promise<Setting[]> {
  return prisma.setting.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] });
}

export async function fetchSettingsMap(): Promise<Map<string, string>> {
  const rows = await fetchAllSettings();
  return new Map(rows.map((row) => [row.key, row.value]));
}

export async function upsertSetting(
  key: string,
  value: string,
  options: { group: string; type: Setting['type']; description?: string; updatedById?: string },
): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    create: {
      key,
      value,
      group: options.group,
      type: options.type,
      description: options.description,
      updatedById: options.updatedById,
    },
    update: {
      value,
      updatedById: options.updatedById,
    },
  });
}

export async function upsertSettingsBatch(
  entries: Array<{ key: string; value: string; group: string; type: Setting['type'] }>,
  updatedById?: string,
): Promise<void> {
  await prisma.$transaction(
    entries.map((entry) =>
      prisma.setting.upsert({
        where: { key: entry.key },
        create: { ...entry, updatedById },
        update: { value: entry.value, updatedById },
      }),
    ),
  );
}
