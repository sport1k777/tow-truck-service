import { NextResponse } from 'next/server';
import { getAppConfig } from '@/config';
import { checkDatabaseHealth } from '@/modules/database';
import { getWhatsAppIntegrationHealth } from '@/modules/integrations/whatsapp';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Health check for Vercel, Docker, and load balancers.
 * Does not expose secrets or connect to external APIs.
 */
export async function GET() {
  const startedAt = Date.now();

  const [database, whatsapp] = await Promise.all([
    checkDatabaseHealth(),
    Promise.resolve(getWhatsAppIntegrationHealth()),
  ]);

  const isHealthy = database !== 'error';
  const status = isHealthy ? 'ok' : 'degraded';

  const body = {
    status,
    timestamp: new Date().toISOString(),
    environment: getAppConfig().environment,
    uptimeSeconds: Math.floor(process.uptime()),
    checks: {
      database,
      whatsapp: whatsapp.status,
    },
    responseMs: Date.now() - startedAt,
  };

  if (!isHealthy) {
    logger.warn('Health check degraded', {
      module: 'health',
      action: 'GET /api/health',
      duration: body.responseMs,
      metadata: { database, whatsapp: whatsapp.status },
    });
  }

  return NextResponse.json(body, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
