# Tow Truck Service Platform

Professional commercial Tow Truck Service Platform for the Ukrainian market.

Built with Next.js 15, TypeScript, Tailwind CSS, PostgreSQL (Neon), Prisma, Google Maps, and multi-channel notifications.

## Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project Architecture | ✅ Approved |
| 2 | Software Architecture | ✅ Approved |
| 3 | Folder Structure & Scaffolding | ✅ Complete |
| 4 | Database Design | ✅ Complete — Pending Approval |
| 5 | API Specification | Pending |
| 6 | UI/UX Design | Pending |
| 7+ | Development & Deployment | Pending |

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** Server Actions, Route Handlers
- **Database:** PostgreSQL (Neon) + Prisma ORM
- **Auth:** Auth.js v5 (email/password, OAuth-ready)
- **Maps:** Google Maps Platform
- **Notifications:** WhatsApp Business, Email (Resend), Telegram
- **Hosting:** Vercel + Cloudflare

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL (local Docker or Neon account)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See [`.env.example`](.env.example) for all required variables.

Minimum for local development:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=your-secret-minimum-32-characters-long
DATABASE_URL=postgresql://user:password@localhost:5432/tow_truck_service
```

## Project Structure

```
src/
├── app/              # Next.js App Router (public, admin, api routes)
├── modules/          # Domain modules (orders, pricing, maps, notifications, etc.)
├── components/       # Shared UI components
├── actions/          # Server Actions (thin orchestration layer)
├── lib/              # Utilities (prisma, auth, logger, errors, env)
├── hooks/            # Shared React hooks
└── types/            # Global TypeScript types
```

Full structure documented in [`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md).

## Documentation

- [Architecture Document](docs/ARCHITECTURE.md) — complete software architecture
- [Database Design](docs/DATABASE.md) — schema, ERD, indexes, seed data
- [Phase 3 Summary](docs/PHASE3.md) — scaffolding decisions
- [Phase 4 Summary](docs/PHASE4.md) — database design summary
- [Folder Structure](docs/FOLDER_STRUCTURE.md) — directory reference

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run type-check` | TypeScript check |
| `npm run format` | Prettier format |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio |

## Market Configuration

Initial release targets **Ukraine**:

- Locale: Ukrainian (`uk`)
- Currency: UAH (₴)
- Phone format: +380
- Default map center: Kyiv
- Google Maps region: UA

All values are configurable via Admin Settings — not hardcoded in components.

## License

Proprietary — All rights reserved.
