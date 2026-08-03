import { prisma } from '@/lib/prisma';
import { getDatabaseConfig } from './database.config';

export type DatabaseHealthStatus = 'ok' | 'skipped' | 'error';

export async function checkDatabaseHealth(): Promise<DatabaseHealthStatus> {
  const config = getDatabaseConfig();

  if (!config.isConfigured) {
    return 'skipped';
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'ok';
  } catch {
    return 'error';
  }
}
