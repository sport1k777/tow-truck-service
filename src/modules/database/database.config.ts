import { env } from '@/lib/env';

/** PostgreSQL connection configuration — wired in Phase 9+. */
export interface DatabaseConfig {
  url: string | undefined;
  isConfigured: boolean;
  /** Prisma connection pool hint for future serverless tuning */
  connectionLimit: number;
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    url: env.DATABASE_URL,
    isConfigured: Boolean(env.DATABASE_URL?.trim()),
    connectionLimit: Number.parseInt(process.env.DATABASE_CONNECTION_LIMIT ?? '10', 10),
  };
}
