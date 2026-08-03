# Deployment Guide — Tow Truck Service

Production-ready deployment for **Vercel** (recommended) or **Docker on any VPS**. No external services are connected until Phase 9+.

## Quick start

| Target | Command |
|--------|---------|
| Verify locally | `npm run verify` |
| Vercel | Import repo → set env vars → deploy |
| Docker (VPS) | `cp .env.docker.example .env.docker && npm run docker:up` |

## Prerequisites

- Node.js 20+
- Docker 24+ (VPS only)
- Domain with HTTPS (production)
- Google Maps API key (calculator routes)
- PostgreSQL (Neon for Vercel; included in Docker Compose for VPS)

## Environment variables

Copy the example file for your target:

| File | Use case |
|------|----------|
| `.env.example` | Local development |
| `.env.production.example` | Vercel / manual VPS |
| `.env.docker.example` | Docker Compose on VPS |

### Required (production runtime)

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_APP_URL` | Public HTTPS URL, e.g. `https://example.com` |
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | Same as public URL |
| `CRON_SECRET` | Protects `/api/cron/*` routes |

### Recommended

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps JavaScript + Places + Directions |

### Future integrations (Phase 9+ — not connected)

| Variable | Module |
|----------|--------|
| `WHATSAPP_API_TOKEN` | `src/modules/integrations/whatsapp/` |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business API |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | WhatsApp Business API |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Webhook verification |
| `DATABASE_CONNECTION_LIMIT` | `src/modules/database/` pool hint |

Validate locally:

```bash
npm run env:check
```

Strict env validation runs in production **runtime**, not during `next build`.

## Production build

```bash
npm run build:production   # prisma generate + next build (standalone output)
npm run start:production   # NODE_ENV=production next start
npm run verify             # type-check + build:production
```

The build produces a **standalone** output (`.next/standalone`) used by the Docker image. Vercel uses its own deployment pipeline and ignores the standalone bundle.

## Health check

`GET /api/health` — for Vercel, Docker, and load balancers.

```json
{
  "status": "ok",
  "timestamp": "2026-08-03T12:00:00.000Z",
  "environment": "production",
  "uptimeSeconds": 3600,
  "checks": {
    "database": "ok",
    "whatsapp": "not_configured"
  },
  "responseMs": 12
}
```

| HTTP | Meaning |
|------|---------|
| `200` | App healthy (database ok or skipped) |
| `503` | Database configured but unreachable |

Database check uses `SELECT 1` via Prisma when `DATABASE_URL` is set. WhatsApp status is config-only (no Meta API calls).

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. **Framework Preset:** Next.js (auto-detected).
3. Add environment variables from `.env.production.example` for **Production**.
4. Build/install commands are set in `vercel.json`:
   - Install: `npm ci`
   - Build: `npm run build:production`
   - Region: `fra1` (Frankfurt — close to Ukraine)

### Database migrations (Phase 9+)

When enabling persistent orders, add to Vercel **Build Command**:

```bash
npx prisma migrate deploy && npm run build:production
```

Or run migrations manually after deploy:

```bash
npx prisma migrate deploy
```

### Post-deploy checklist

- [ ] Homepage loads over HTTPS
- [ ] `GET /api/health` returns `200`
- [ ] `/robots.txt` and `/sitemap.xml` use production URL
- [ ] Calculator builds routes (Maps API key + billing enabled)
- [ ] `/order` booking + WhatsApp flow works
- [ ] Admin `/login` protected by middleware

## Docker deployment (VPS)

Single-command deploy with PostgreSQL:

```bash
cp .env.docker.example .env.docker
# Edit .env.docker — set AUTH_SECRET, CRON_SECRET, POSTGRES_PASSWORD, NEXT_PUBLIC_APP_URL

npm run docker:up      # docker compose up -d --build
npm run docker:logs    # follow app logs
npm run docker:down    # stop and remove containers
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| `app` | `${APP_PORT:-3000}` | Next.js standalone server |
| `postgres` | `${POSTGRES_PORT:-5432}` | PostgreSQL 16 (future Phase 9) |

Both services include health checks. The app waits for PostgreSQL to be ready before starting.

### Reverse proxy (Nginx)

Place Nginx in front of the Docker app on port 3000:

```nginx
server {
  listen 443 ssl http2;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /api/health {
    proxy_pass http://127.0.0.1:3000/api/health;
    access_log off;
  }
}
```

### Manual VPS (without Docker)

```bash
npm ci
npm run build:production
NODE_ENV=production npm run start
```

Use PM2 or systemd with env loaded from `/etc/tow-truck-service.env` (mode `600`).

## Production configuration

Runtime config is split by environment:

- `src/config/development.config.ts` — verbose errors, debug logging
- `src/config/production.config.ts` — safe public errors, JSON logs
- `src/lib/env.ts` — Zod validation at startup
- `src/lib/logger.ts` — structured JSON logging (`info`/`warn`/`error` in production)

Future integration modules (not connected):

- `src/modules/database/` — PostgreSQL config + health probe
- `src/modules/integrations/whatsapp/` — WhatsApp Business API config contract

## Security

- Security headers in `next.config.ts`, `vercel.json`, and middleware
- No API secrets in source code — only `NEXT_PUBLIC_*` client keys
- Restrict Google Maps key by HTTP referrer in Google Cloud Console
- Rotate `AUTH_SECRET` and `CRON_SECRET` if compromised

## Monitoring (optional)

Set `SENTRY_DSN` to enable error tracking (Phase 9 integration point).

## Do not deploy yet

This guide prepares the project only. Deploy when database persistence, auth, and external APIs are ready for Phase 9.
