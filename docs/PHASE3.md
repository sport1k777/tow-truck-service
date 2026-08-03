# Phase 3 — Folder Structure & Project Scaffolding

**Version:** 1.0  
**Status:** Complete — Pending Review  
**Date:** 2026-08-03

---

## Summary

Phase 3 scaffolds the complete Next.js project structure defined in the approved architecture document. No business logic is implemented — all module services contain interface stubs marked for future phases.

## What Was Created

### Project Configuration

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | Strict TypeScript configuration |
| `next.config.ts` | Next.js configuration |
| `eslint.config.mjs` | ESLint with Next.js + Prettier |
| `.prettierrc` | Code formatting rules |
| `components.json` | shadcn/ui configuration |
| `postcss.config.mjs` | Tailwind CSS v4 PostCSS |
| `.env.example` | Documented environment variables |
| `.github/workflows/ci.yml` | CI pipeline (lint, type-check, build) |

### Application Structure

| Directory | Contents |
|-----------|----------|
| `src/app/(public)/` | Public pages: home, order, services, contact, about, faq |
| `src/app/(admin)/admin/` | Admin pages: dashboard, orders, pricing, settings, export |
| `src/app/api/` | Route Handlers: auth, maps proxy, webhooks, cron |
| `src/app/login/` | Admin login page (placeholder) |
| `src/modules/` | 6 domain modules with service interfaces |
| `src/actions/` | Server Action stubs (order, pricing) |
| `src/lib/` | Core utilities: prisma, auth, logger, errors, env, locale defaults |
| `src/types/` | Global types: ActionResult, NextAuth extensions |
| `prisma/` | Schema placeholder (Phase 4) + seed stub |

### Domain Modules Scaffolded

| Module | Files | Phase |
|--------|-------|-------|
| **Settings** | types, defaults, service | Phase 8 |
| **Pricing** | types, engine, service | Phase 8 |
| **Orders** | types, service | Phase 8 |
| **Maps** | types, service | Phase 9 |
| **Notifications** | types, service, 3 adapters | Phase 9 |
| **SEO** | metadata helper | Phase 7 |

### Approved Decisions Implemented

#### 1. Ukraine Market Defaults (`src/lib/locale.defaults.ts`)

- Country: UA
- Locale: uk
- Currency: UAH (₴)
- Phone: +380
- Map center: Kyiv (50.4501, 30.5234)
- Google Maps: region UA, language uk

Architecture remains country-independent via `SUPPORTED_LOCALES` and `SettingsService`.

#### 2. Flexible Pricing Engine (`src/modules/pricing/`)

- Pure function engine separated from data access
- Supports all approved surcharge types in types/constants
- Rules loaded from configuration (database in Phase 4/8)
- Admin-configurable without code changes

#### 3. Provider-Based Notifications (`src/modules/notifications/`)

- `NotificationAdapter` interface
- WhatsApp, Email, Telegram adapters scaffolded
- `NotificationService` orchestrator with parallel dispatch
- New channels added by implementing the adapter interface

#### 4. Auth Architecture (`src/lib/auth.ts`)

- Auth.js v5 with Credentials provider (placeholder)
- JWT session strategy
- Google OAuth extension point documented in code
- Middleware protects `/admin/*` routes

#### 5. Configurable Branding (`src/modules/settings/`)

- No hardcoded company name, logo, colors, or contacts in components
- `SettingsService.getBusinessSettings()` used by all pages
- `SETTING_KEYS` constant for database key mapping
- Admin-configurable via settings module (Phase 7/8)

## Component Directories (Ready for Phase 7)

```
src/components/
├── ui/          # shadcn/ui primitives (install via CLI in Phase 7)
├── layout/      # Header, footer, admin sidebar
├── forms/       # Address input, phone input
├── maps/        # Route map, autocomplete
├── booking/     # Booking wizard steps
├── admin/       # Admin tables, forms, badges
└── shared/      # Loading, error boundary, price display
```

## Verification

After `npm install`:

```bash
npm run type-check   # TypeScript validation
npm run lint         # ESLint
npm run build        # Production build
npm run dev          # Development server at localhost:3000
```

## Next Phase

**Phase 4 — Database Design**

- Complete Prisma schema (Order, PricingRule, ServiceArea, Setting, AdminUser, etc.)
- Entity-Relationship Diagram
- Migration strategy
- Seed data for Ukrainian defaults

---

*Awaiting approval before proceeding to Phase 4.*
