# Tow Truck Service Platform — Software Architecture Document

**Version:** 1.0  
**Status:** Approved  
**Phase:** 2 — Project Architecture (Approved) | Phase 3 — Scaffolding (Complete)  
**Last Updated:** 2026-08-03

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [Technology Rationale](#3-technology-rationale)
4. [Module Definitions](#4-module-definitions)
5. [Inter-Module Communication](#5-inter-module-communication)
6. [Folder Architecture](#6-folder-architecture)
7. [Coding Standards](#7-coding-standards)
8. [Naming Conventions](#8-naming-conventions)
9. [Reusable Component Strategy](#9-reusable-component-strategy)
10. [State Management Strategy](#10-state-management-strategy)
11. [Security Architecture](#11-security-architecture)
12. [Logging Strategy](#12-logging-strategy)
13. [Error Handling Strategy](#13-error-handling-strategy)
14. [Scalability Strategy](#14-scalability-strategy)
15. [Deployment Strategy](#15-deployment-strategy)
16. [Backup Strategy](#16-backup-strategy)
17. [Rendering & Data-Fetching Strategy](#17-rendering--data-fetching-strategy)
18. [Third-Party Integration Architecture](#18-third-party-integration-architecture)
19. [PostgreSQL Hosting Recommendation](#19-postgresql-hosting-recommendation)
20. [File Storage Recommendation](#20-file-storage-recommendation)
21. [Architecture Decision Summary](#21-architecture-decision-summary)

---

## 1. Executive Summary

The Tow Truck Service Platform is a **commercial, conversion-optimized web application** built as a **Modular Monolith** on Next.js 15 (App Router). A single deployable unit serves the public marketing site, the customer booking flow, and the admin dashboard, while internal domain boundaries allow future extraction into microservices without a rewrite.

The architecture prioritizes:

- **Conversion speed** — sub-30-second order submission
- **SEO performance** — server-rendered public pages with structured data
- **Operational automation** — instant multi-channel notifications on every order
- **Security** — defense in depth, secrets isolation, admin-only protected routes
- **Maintainability** — strict module boundaries, typed contracts, consistent conventions
- **Scalability** — horizontal scaling via Vercel, connection-pooled PostgreSQL, adapter-based integrations

---

## 2. High-Level System Architecture

### 2.1 Architecture Diagram

```
                                    ┌─────────────────────────┐
                                    │       End Users         │
                                    │  (Customers, Admins)    │
                                    └───────────┬─────────────┘
                                                │ HTTPS
                                    ┌───────────▼─────────────┐
                                    │      Cloudflare         │
                                    │  DNS · CDN · WAF · SSL  │
                                    └───────────┬─────────────┘
                                                │
┌───────────────────────────────────────────────▼───────────────────────────────────────────────┐
│                                    VERCEL EDGE NETWORK                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              Next.js 15 Application                                      │  │
│  │                                                                                          │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────────────┐   │  │
│  │  │   FRONTEND      │  │   BACKEND       │  │   MIDDLEWARE LAYER                  │   │  │
│  │  │                 │  │                 │  │                                     │   │  │
│  │  │ Server Components│  │ Server Actions  │  │ Auth guard · Rate limit · Locale  │   │  │
│  │  │ Client Components│  │ Route Handlers  │  │ Request logging · Security headers│   │  │
│  │  │ shadcn/ui       │  │ Domain Services │  │                                     │   │  │
│  │  └────────┬────────┘  └────────┬────────┘  └─────────────────────────────────────┘   │  │
│  │           │                    │                                                       │  │
│  │           └──────────┬─────────┘                                                       │  │
│  │                        │                                                                 │  │
│  │  ┌─────────────────────▼─────────────────────────────────────────────────────────────┐  │  │
│  │  │                         DOMAIN MODULE LAYER                                      │  │  │
│  │  │  Landing · Booking · Pricing · Orders · Maps · Notifications · Auth · SEO     │  │  │
│  │  │  Analytics · Settings · Admin                                                     │  │  │
│  │  └─────────────────────┬─────────────────────────────────────────────────────────────┘  │  │
│  │                        │                                                                 │  │
│  │  ┌─────────────────────▼─────────────────────────────────────────────────────────────┐  │  │
│  │  │                      INFRASTRUCTURE / ADAPTER LAYER                                │  │  │
│  │  │  Prisma · Google Maps Client · WhatsApp Client · Email Client · Logger          │  │  │
│  │  └───────────────────────────────────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                                │
              ┌─────────────────────────────────┼─────────────────────────────────┐
              │                                 │                                 │
    ┌─────────▼─────────┐           ┌───────────▼──────────┐          ┌──────────▼──────────┐
    │   PostgreSQL      │           │   Google Cloud       │          │  Communication APIs │
    │   (Neon)          │           │   Maps Platform      │          │                     │
    │                   │           │                      │          │  · WhatsApp Business│
    │  Orders           │           │  · Places API        │          │  · Telegram Bot     │
    │  Pricing Rules    │           │  · Directions API    │          │  · Resend (Email)   │
    │  Service Areas    │           │  · Distance Matrix   │          │                     │
    │  Settings         │           │  · Static Maps       │          └─────────────────────┘
    │  Admin Users      │           └──────────────────────┘
    │  Audit Logs       │
    └───────────────────┘

              ┌─────────────────────────────────┐
              │   Vercel Blob (Future)        │
              │   Order attachments · Exports │
              └─────────────────────────────────┘
```

### 2.2 Frontend Layer

| Aspect | Decision |
|--------|----------|
| Framework | Next.js 15 App Router with React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + CSS variables for theming |
| UI Library | shadcn/ui (Radix primitives, owned source code) |
| Forms | React Hook Form + Zod validation |
| Maps UI | `@react-google-maps/api` wrapper around Google Maps JS SDK |
| Icons | Lucide React |
| Fonts | `next/font` with subsetting (Inter or similar) |

The frontend is split into **Server Components** (default, for SEO and data fetching) and **Client Components** (only where interactivity is required: maps, forms, admin tables).

### 2.3 Backend Layer

| Aspect | Decision |
|--------|----------|
| Runtime | Node.js on Vercel Serverless Functions |
| API Pattern | Server Actions (primary) + Route Handlers (webhooks, maps proxy, cron) |
| ORM | Prisma 6 |
| Validation | Zod schemas shared between client and server |
| Auth | Auth.js v5 (NextAuth) |
| Background Jobs | Vercel Cron + Route Handlers (future: Inngest or Trigger.dev) |

Business logic lives exclusively in **domain service modules** under `src/modules/`. Server Actions and Route Handlers are thin orchestration layers that validate input, call services, and return typed responses.

### 2.4 Database Layer

| Aspect | Decision |
|--------|----------|
| Engine | PostgreSQL 16 |
| ORM | Prisma with typed client |
| Migrations | Prisma Migrate (version-controlled SQL) |
| Connection | Pooled via Neon serverless driver or Prisma Accelerate |
| Seeding | Prisma seed script for dev/staging defaults |

PostgreSQL is chosen for ACID compliance (financial/order data), JSON support (flexible metadata), PostGIS extension readiness (geospatial service areas), and mature ecosystem.

### 2.5 External Services

| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| Google Maps Platform | Address autocomplete, routing, distance, static map previews | Infrastructure adapter + Route Handler proxy |
| WhatsApp Business Cloud API | Instant order alerts to business phone | Notification adapter |
| Telegram Bot API | Backup/alternative instant notification channel | Notification adapter |
| Resend | Transactional email (order confirmations, admin alerts) | Notification adapter |
| Cloudflare | DNS, CDN, DDoS protection, SSL | Infrastructure (outside app) |
| Vercel | Hosting, CI/CD, preview deploys, analytics | Infrastructure |
| Sentry (recommended) | Error tracking and performance monitoring | Cross-cutting logger adapter |

### 2.6 Deployment Architecture

```
GitHub Repository
       │
       │ push / PR
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Development │────▶│   Preview    │────▶│  Production  │
│  (local)     │     │  (Vercel)    │     │  (Vercel)    │
│              │     │  per-PR URL    │     │  custom dom. │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                     │
       ▼                    ▼                     ▼
  Local PostgreSQL     Neon Branch DB         Neon Production DB
  (Docker)             (ephemeral)            (persistent)
```

Three isolated environments with separate environment variables, database instances, and API keys.

---

## 3. Technology Rationale

### 3.1 Next.js 15 (App Router)

**Why:** Single framework for frontend and backend eliminates context switching, reduces deployment complexity, and provides built-in SSR/SSG/ISR for SEO. Server Actions eliminate boilerplate API layer for form submissions. Vercel-native deployment with zero DevOps overhead at launch.

**Alternatives considered:**
- *Separate React SPA + Express API* — Rejected: doubles deployment surface, worse SEO, more latency.
- *Remix* — Viable but smaller ecosystem for admin dashboards and shadcn/ui integration.

### 3.2 TypeScript (Strict)

**Why:** Catches errors at compile time across the full stack. Prisma generates typed models. Zod provides runtime validation with inferred types. Essential for a codebase that will grow to 50+ modules.

### 3.3 Tailwind CSS + shadcn/ui

**Why:** Utility-first CSS enables rapid, consistent UI development. shadcn/ui provides accessible, customizable components (not a dependency — source code is copied into the project, giving full ownership). Radix primitives ensure WCAG compliance.

### 3.4 PostgreSQL + Prisma

**Why:** PostgreSQL handles relational order data, supports JSON columns for extensible metadata, and offers PostGIS for future geospatial queries. Prisma provides type-safe queries, migration management, and excellent Next.js integration.

**Alternatives considered:**
- *MongoDB* — Rejected: order/pricing relationships are inherently relational.
- *Supabase* — Viable (see Section 19); Neon preferred for pure database focus.

### 3.5 Server Actions over REST API

**Why:** For a monolithic Next.js app where frontend and backend share a deployment, Server Actions provide end-to-end type safety, automatic CSRF protection, progressive enhancement, and eliminate API route boilerplate. Route Handlers are reserved for external-facing endpoints (webhooks, cron, third-party callbacks).

### 3.6 Auth.js v5

**Why:** First-class Next.js App Router support, flexible provider system (credentials for admin, OAuth for future customer accounts), session management, and middleware integration.

### 3.7 Zod

**Why:** Single source of truth for validation schemas used in Server Actions, Route Handlers, and client-side form validation. Type inference eliminates duplicate type definitions.

---

## 4. Module Definitions

Each module is a self-contained domain unit with its own service, types, and (where applicable) components. Modules communicate through **service interfaces only** — never by importing another module's internal files.

### 4.1 Landing Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | High-converting marketing homepage and static content pages |
| **Responsibility** | Hero section, service highlights, trust signals, testimonials, FAQ, CTA to booking |
| **Key Pages** | `/` (homepage), `/about`, `/services`, `/faq`, `/contact` |
| **Dependencies** | SEO module, Settings module (business info) |
| **Rendering** | Server Components (SSG with ISR revalidation) |

### 4.2 Booking Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Multi-step customer order wizard — the primary conversion funnel |
| **Responsibility** | Step navigation, form state, address input, route preview, price display, order submission |
| **Key Pages** | `/order` (wizard), `/order/confirmation/[id]` |
| **Steps** | 1) Pickup location → 2) Destination → 3) Route & price review → 4) Contact details & submit |
| **Dependencies** | Google Maps module, Pricing module, Orders module, Notifications module |
| **Rendering** | Hybrid: Server Component shell + Client Components for interactive steps |

### 4.3 Price Calculator Module (Pricing Engine)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Calculate tow service price based on configurable business rules |
| **Responsibility** | Load pricing rules, apply base fee + distance rate + surcharges, return itemized breakdown |
| **Business Rules** | Base fee, per-km rate, minimum charge, vehicle type surcharge, time-of-day surcharge (night/weekend), service area surcharge |
| **Dependencies** | Settings module (currency, active rules), Google Maps module (distance input) |
| **Caching** | Pricing rules cached in memory with TTL; invalidated on admin update |
| **Rendering** | Server-side only (never expose pricing logic to client) |

### 4.4 Google Maps Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | All geospatial operations: address search, routing, distance calculation, map display |
| **Responsibility** | Places Autocomplete integration, Directions API calls, Distance Matrix fallback, Static Map URL generation, service area validation |
| **Sub-components** | `AddressAutocomplete`, `RouteMap`, `StaticMapPreview`, `ServiceAreaValidator` |
| **Dependencies** | Settings module (default map center, API key config) |
| **Security** | Browser key (referrer-restricted) for client autocomplete; server key (IP-restricted) for Directions/Matrix via Route Handler proxy |
| **Rendering** | Client Components for interactive maps; Server-side for route calculation |

### 4.5 Orders Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Full order lifecycle management |
| **Responsibility** | Create orders, query/filter orders, update status, status history audit trail, export to CSV |
| **Status Flow** | `PENDING` → `CONFIRMED` → `DISPATCHED` → `IN_PROGRESS` → `COMPLETED` / `CANCELLED` |
| **Key Entities** | Order, OrderStatusHistory |
| **Dependencies** | Pricing module, Google Maps module, Notifications module |
| **Rendering** | Server Components for lists; Client Components for status update actions |

### 4.6 Admin Dashboard Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Protected back-office for business operations |
| **Responsibility** | Dashboard overview, order management, pricing management, service area management, settings, data export, statistics |
| **Key Pages** | `/admin/dashboard`, `/admin/orders`, `/admin/orders/[id]`, `/admin/pricing`, `/admin/service-areas`, `/admin/settings`, `/admin/export` |
| **Dependencies** | Orders, Pricing, Settings, Analytics, Auth modules |
| **Access Control** | Admin role required; enforced by middleware + service-level checks |
| **Rendering** | Server Components for data tables; Client Components for interactive admin controls |

### 4.7 Pricing Management Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Admin interface for configuring pricing rules |
| **Responsibility** | CRUD pricing rules, activate/deactivate rules, preview price calculation |
| **Key Entities** | PricingRule (baseFee, perKmRate, minCharge, surcharges, active, validFrom, validTo) |
| **Dependencies** | Pricing Engine module, Auth module |
| **Rendering** | Client Components (forms, tables) backed by Server Actions |

### 4.8 Notifications Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Multi-channel notification dispatch on business events |
| **Responsibility** | Send order alerts to admin via WhatsApp, Telegram, and email; send confirmation to customer via email; log all notification attempts |
| **Pattern** | Adapter pattern — each channel implements a common `NotificationAdapter` interface |
| **Events** | `order.created`, `order.status_changed`, `order.cancelled` |
| **Dependencies** | Settings module (channel credentials, recipient config) |
| **Failure Policy** | Best-effort: notification failure never blocks order creation; failures logged and retried |

### 4.9 Authentication Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Admin authentication and session management |
| **Responsibility** | Login/logout, session validation, password hashing, role-based access |
| **MVP Scope** | Admin-only (credentials provider); customer auth deferred |
| **Future** | Customer accounts (OAuth + phone OTP), operator accounts, role hierarchy |
| **Dependencies** | None (foundational module) |
| **Rendering** | Server Components + Server Actions for login form |

### 4.10 SEO Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Maximize search engine visibility and ranking |
| **Responsibility** | Dynamic metadata generation, JSON-LD structured data, sitemap.xml, robots.txt, Open Graph tags, canonical URLs |
| **Structured Data Types** | `LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList` |
| **Future** | Programmatic city/service landing pages, hreflang for multi-language |
| **Dependencies** | Settings module (business name, address, phone) |
| **Rendering** | Server Components exclusively (`generateMetadata`, `generateStaticParams`) |

### 4.11 Analytics Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Business intelligence for admin dashboard |
| **Responsibility** | Aggregate order statistics (count, revenue, avg price, conversion), time-series data, status distribution |
| **MVP Scope** | Server-side SQL aggregation queries; displayed in admin dashboard |
| **Future** | Google Analytics 4 integration, Google Ads conversion tracking, custom event tracking |
| **Dependencies** | Orders module |
| **Rendering** | Server Components for data fetching; Client Components for charts (recharts) |

### 4.12 Settings Module

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Centralized application and business configuration |
| **Responsibility** | Store/retrieve business settings (company name, phone, WhatsApp number, email, working hours, currency, default map center, notification preferences) |
| **Pattern** | Key-value store in PostgreSQL with typed getter functions and in-memory cache |
| **Key Entities** | Setting (key, value, type, group) |
| **Dependencies** | None (foundational module) |
| **Rendering** | Server-side reads; Client Components for admin settings forms |

---

## 5. Inter-Module Communication

### 5.1 Communication Rules

1. **Modules never import from each other's internal directories.** Only public service interfaces are accessible.
2. **Server Actions and Route Handlers** are the entry points — they call module services, never Prisma directly.
3. **Cross-module calls** go through service interfaces (e.g., Booking module calls `PricingService.calculate()`, not Prisma pricing queries).
4. **Events** (future): Module services emit domain events; Notification module subscribes. At MVP, direct service calls suffice.

### 5.2 Communication Diagram

```
┌─────────────┐     Server Action      ┌──────────────────┐
│   Booking   │ ─────────────────────▶  │  Orders Service  │
│   (UI)      │                          │                  │
└──────┬──────┘                          └────────┬─────────┘
       │                                          │
       │ calls                           creates  │
       ▼                                          ▼
┌──────────────┐                          ┌──────────────────┐
│  Pricing     │                          │  Notification    │
│  Service     │                          │  Service         │
└──────┬───────┘                          └────────┬─────────┘
       │                                           │
       │ reads rules                               │ sends via
       ▼                                           ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Settings    │     │  Google Maps │     │  WhatsApp / TG /  │
│  Service     │     │  Service     │     │  Email Adapters  │
└──────────────┘     └──────────────┘     └──────────────────┘
       ▲
       │ reads config
       │
┌──────────────┐
│  SEO Module  │
└──────────────┘
```

### 5.3 Data Flow: Order Creation

```
Customer submits order form
        │
        ▼
Server Action: validate input (Zod)
        │
        ▼
GoogleMapsService.validateRoute(pickup, destination)
        │
        ▼
PricingService.calculate(distance, vehicleType, timestamp)
        │
        ▼
OrdersService.create(orderData, calculatedPrice)
        │
        ├──▶ Prisma: INSERT order + status history
        │
        └──▶ NotificationService.notify('order.created', order)
                │
                ├──▶ WhatsAppAdapter.send(adminPhone, orderSummary)
                ├──▶ TelegramAdapter.send(chatId, orderSummary)
                └──▶ EmailAdapter.send(adminEmail, orderDetails)
        │
        ▼
Return { orderId, referenceNumber, estimatedPrice } to client
```

### 5.4 Module Dependency Matrix

| Module | Depends On |
|--------|-----------|
| Landing | SEO, Settings |
| Booking | Google Maps, Pricing, Orders, Notifications |
| Pricing Engine | Settings, Google Maps (distance) |
| Google Maps | Settings |
| Orders | Pricing, Google Maps, Notifications |
| Admin Dashboard | Orders, Pricing, Settings, Analytics, Auth |
| Pricing Management | Pricing Engine, Auth |
| Notifications | Settings |
| Auth | — |
| SEO | Settings |
| Analytics | Orders |
| Settings | — |

---

## 6. Folder Architecture

```
tow-truck-service/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, type-check, test on PR
│       └── deploy-preview.yml        # Optional: post-preview URL comment
│
├── docs/
│   ├── ARCHITECTURE.md               # This document
│   ├── ADR/                          # Architecture Decision Records
│   ├── API.md                        # API specification (Phase 5)
│   └── DEPLOYMENT.md                 # Deployment runbook
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Version-controlled migrations
│   └── seed.ts                       # Development seed data
│
├── public/
│   ├── images/                       # Static images (logo, hero, OG)
│   ├── fonts/                        # Self-hosted fonts (if not using next/font)
│   └── favicon.ico
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Public route group
│   │   │   ├── layout.tsx            # Public layout (header, footer)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── order/
│   │   │   │   ├── page.tsx          # Booking wizard
│   │   │   │   └── confirmation/
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx    # Order confirmation
│   │   │   ├── services/
│   │   │   │   └── page.tsx          # Services page
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── faq/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/                  # Admin route group (auth-protected)
│   │   │   ├── layout.tsx            # Admin layout (sidebar, nav)
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       │   └── page.tsx
│   │   │       ├── orders/
│   │   │       │   ├── page.tsx      # Order list
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx  # Order detail
│   │   │       ├── pricing/
│   │   │       │   └── page.tsx
│   │   │       ├── service-areas/
│   │   │       │   └── page.tsx
│   │   │       ├── settings/
│   │   │       │   └── page.tsx
│   │   │       └── export/
│   │   │           └── page.tsx
│   │   │
│   │   ├── api/                      # Route Handlers
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── maps/
│   │   │   │   ├── directions/
│   │   │   │   │   └── route.ts      # Proxy Directions API
│   │   │   │   └── distance/
│   │   │   │       └── route.ts      # Proxy Distance Matrix
│   │   │   ├── webhooks/
│   │   │   │   └── whatsapp/
│   │   │   │       └── route.ts      # WhatsApp webhook
│   │   │   └── cron/
│   │   │       └── cleanup/
│   │   │           └── route.ts      # Scheduled cleanup tasks
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx              # Admin login page
│   │   │
│   │   ├── sitemap.ts                # Dynamic sitemap generation
│   │   ├── robots.ts                 # Robots.txt generation
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx
│   │   └── global-error.tsx
│   │
│   ├── modules/                      # Domain modules
│   │   ├── orders/
│   │   │   ├── orders.service.ts     # Public service interface
│   │   │   ├── orders.repository.ts  # Prisma queries
│   │   │   ├── orders.types.ts       # Module-specific types
│   │   │   ├── orders.schema.ts      # Zod validation schemas
│   │   │   └── orders.constants.ts   # Status enums, etc.
│   │   ├── pricing/
│   │   │   ├── pricing.service.ts
│   │   │   ├── pricing.repository.ts
│   │   │   ├── pricing.types.ts
│   │   │   ├── pricing.schema.ts
│   │   │   └── pricing.engine.ts     # Pure calculation logic
│   │   ├── maps/
│   │   │   ├── maps.service.ts
│   │   │   ├── maps.client.ts        # Google Maps API client
│   │   │   ├── maps.types.ts
│   │   │   └── maps.schema.ts
│   │   ├── notifications/
│   │   │   ├── notifications.service.ts
│   │   │   ├── adapters/
│   │   │   │   ├── whatsapp.adapter.ts
│   │   │   │   ├── telegram.adapter.ts
│   │   │   │   └── email.adapter.ts
│   │   │   ├── notifications.types.ts
│   │   │   └── templates/            # Message templates
│   │   │       ├── order-created.ts
│   │   │       └── status-changed.ts
│   │   ├── settings/
│   │   │   ├── settings.service.ts
│   │   │   ├── settings.repository.ts
│   │   │   ├── settings.types.ts
│   │   │   └── settings.defaults.ts
│   │   ├── analytics/
│   │   │   ├── analytics.service.ts
│   │   │   ├── analytics.repository.ts
│   │   │   └── analytics.types.ts
│   │   └── seo/
│   │       ├── metadata.ts           # generateMetadata helpers
│   │       ├── structured-data.ts    # JSON-LD generators
│   │       └── seo.types.ts
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/                   # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   └── mobile-nav.tsx
│   │   ├── forms/                    # Reusable form components
│   │   │   ├── address-input.tsx
│   │   │   ├── phone-input.tsx
│   │   │   └── form-field.tsx
│   │   ├── maps/                     # Map-related components
│   │   │   ├── route-map.tsx
│   │   │   ├── address-autocomplete.tsx
│   │   │   └── static-map-preview.tsx
│   │   ├── booking/                  # Booking wizard components
│   │   │   ├── booking-wizard.tsx
│   │   │   ├── step-pickup.tsx
│   │   │   ├── step-destination.tsx
│   │   │   ├── step-review.tsx
│   │   │   └── step-contact.tsx
│   │   ├── admin/                    # Admin-specific components
│   │   │   ├── orders-table.tsx
│   │   │   ├── order-status-badge.tsx
│   │   │   ├── pricing-form.tsx
│   │   │   └── stats-cards.tsx
│   │   └── shared/                   # Cross-cutting UI
│   │       ├── loading-spinner.tsx
│   │       ├── error-boundary.tsx
│   │       ├── price-display.tsx
│   │       ├── whatsapp-button.tsx
│   │       └── call-button.tsx
│   │
│   ├── lib/                          # Shared utilities
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── auth.ts                   # Auth.js configuration
│   │   ├── logger.ts                 # Structured logger
│   │   ├── errors.ts                 # Custom error classes
│   │   ├── utils.ts                  # General utilities (cn, formatters)
│   │   ├── constants.ts              # App-wide constants
│   │   └── env.ts                    # Environment variable validation (Zod)
│   │
│   ├── hooks/                        # Shared React hooks
│   │   ├── use-booking-form.ts
│   │   ├── use-debounce.ts
│   │   └── use-media-query.ts
│   │
│   ├── actions/                      # Server Actions (thin orchestration)
│   │   ├── order.actions.ts
│   │   ├── pricing.actions.ts
│   │   ├── settings.actions.ts
│   │   └── admin.actions.ts
│   │
│   ├── types/                        # Global shared types
│   │   ├── global.d.ts
│   │   └── api.types.ts              # Action response types
│   │
│   └── middleware.ts                 # Auth, rate limiting, security headers
│
├── .env.example                      # Documented environment variables
├── .eslintrc.json
├── .prettierrc
├── components.json                   # shadcn/ui config
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 7. Coding Standards

### 7.1 General Principles

- **Strict TypeScript** — `"strict": true` in tsconfig; no `any` types except with explicit `// eslint-disable` justification.
- **Single Responsibility** — Each file does one thing. Services handle business logic; repositories handle data access; actions handle orchestration.
- **No business logic in components** — React components render UI and delegate to hooks/actions.
- **No direct Prisma calls outside repositories** — All database access goes through module repositories.
- **Explicit over implicit** — Prefer named exports over default exports. Prefer explicit return types on public functions.

### 7.2 File Organization Rules

| Rule | Standard |
|------|----------|
| Max file length | 300 lines (split if exceeded) |
| One component per file | Yes, except tightly coupled sub-components |
| Colocation | Module-specific files live inside the module directory |
| Shared components | Only in `src/components/` if used by 2+ modules |
| Test files | Co-located: `orders.service.test.ts` next to `orders.service.ts` |

### 7.3 Import Order

```typescript
// 1. External packages
import { z } from 'zod';

// 2. Internal modules (absolute paths via @/ alias)
import { OrdersService } from '@/modules/orders/orders.service';

// 3. Relative imports
import { OrderStatusBadge } from './order-status-badge';

// 4. Types (type-only imports)
import type { Order } from '@/modules/orders/orders.types';
```

### 7.4 TypeScript Standards

- Use `interface` for object shapes that may be extended; use `type` for unions, intersections, and computed types.
- Use `satisfies` operator for config objects.
- Use `as const` for enum-like objects instead of TypeScript enums.
- All Server Action return types must be explicit and wrapped in a `ActionResult<T>` discriminated union.

### 7.5 Validation Standards

- Every Server Action input validated with Zod before processing.
- Shared schemas defined in module `*.schema.ts` files.
- Client forms use the same Zod schemas via `@hookform/resolvers/zod`.

### 7.6 Comment Standards

- **No comments that restate code.** Comments explain *why*, not *what*.
- JSDoc on all public service methods and exported functions.
- `TODO` comments must include author and date: `// TODO(cto): Add retry logic — 2026-08-03`.

---

## 8. Naming Conventions

### 8.1 Files and Directories

| Item | Convention | Example |
|------|-----------|---------|
| Directories | kebab-case | `service-areas/` |
| React components | kebab-case file, PascalCase export | `order-status-badge.tsx` → `OrderStatusBadge` |
| Services | kebab-case file, PascalCase class/object | `orders.service.ts` → `OrdersService` |
| Repositories | kebab-case file | `orders.repository.ts` |
| Schemas | kebab-case file | `orders.schema.ts` |
| Types | kebab-case file | `orders.types.ts` |
| Hooks | kebab-case with `use-` prefix | `use-booking-form.ts` |
| Server Actions | kebab-case with `.actions` suffix | `order.actions.ts` |
| Constants | kebab-case with `.constants` suffix | `orders.constants.ts` |
| Tests | same name with `.test` suffix | `orders.service.test.ts` |

### 8.2 Code Identifiers

| Item | Convention | Example |
|------|-----------|---------|
| Variables / functions | camelCase | `calculatePrice`, `orderCount` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| Types / Interfaces | PascalCase | `Order`, `PricingRule` |
| Enums (const objects) | PascalCase object, UPPER_SNAKE keys | `OrderStatus.PENDING` |
| Database tables | snake_case (Prisma `@@map`) | `pricing_rules` |
| Database columns | snake_case (Prisma `@map`) | `created_at` |
| CSS classes | Tailwind utilities (no custom classes unless necessary) | `className="flex items-center gap-2"` |
| Environment variables | UPPER_SNAKE_CASE with prefix | `DATABASE_URL`, `GOOGLE_MAPS_SERVER_KEY` |

### 8.3 API and Route Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Public pages | kebab-case paths | `/order`, `/service-areas` |
| Admin pages | `/admin/` prefix | `/admin/orders`, `/admin/pricing` |
| API routes | `/api/` prefix, kebab-case | `/api/maps/directions` |
| Server Actions | verb + noun | `createOrder`, `updateOrderStatus`, `calculatePrice` |

---

## 9. Reusable Component Strategy

### 9.1 Component Hierarchy

```
Level 1: UI Primitives (shadcn/ui)
  └── Button, Input, Dialog, Table, Badge, Card, Select, etc.
      └── Unstyled Radix primitives + Tailwind styling
      └── Never contain business logic

Level 2: Form Components
  └── AddressInput, PhoneInput, FormField, PriceInput
      └── Compose UI primitives with validation logic
      └── Reusable across booking and admin forms

Level 3: Feature Components
  └── BookingWizard, OrdersTable, RouteMap, StatsCards
      └── Compose form/layout components with domain logic
      └── Module-specific but shared across pages within a module

Level 4: Page Components
  └── page.tsx files
      └── Compose feature components into full pages
      └── Handle data fetching (Server Components) or wire up actions
```

### 9.2 Component Design Rules

1. **Props interface always exported** alongside the component.
2. **Composition over configuration** — prefer `children` and slot patterns over prop explosion.
3. **No fetching in shared components** — data passed via props; fetching happens in Server Components or hooks.
4. **Variant-driven styling** — use `class-variance-authority` (cva) for component variants, not conditional class strings.
5. **Accessible by default** — all interactive components must be keyboard navigable and have ARIA labels.
6. **Responsive by default** — mobile-first Tailwind breakpoints on every layout component.

### 9.3 shadcn/ui Integration

- Install components via CLI (`npx shadcn@latest add button`).
- Customize in `src/components/ui/` — these are owned source files, not node_modules.
- Extend shadcn components via composition, not modification (wrap, don't edit internals).
- Theme tokens defined in `globals.css` as CSS variables for consistent theming.

---

## 10. State Management Strategy

### 10.1 Principle: Minimal Client State

This application does not require a global state manager (Redux, Zustand). State is managed at the appropriate layer:

| State Type | Strategy | Tool |
|-----------|----------|------|
| **Server/database state** | Fetched in Server Components, mutated via Server Actions | React Server Components + Server Actions |
| **URL state** | Search params for filters, pagination, wizard step | `useSearchParams`, `nuqs` library |
| **Form state** | Controlled form inputs during wizard | React Hook Form |
| **Wizard flow state** | Multi-step booking progress | React Hook Form + URL step param |
| **UI ephemeral state** | Modals, dropdowns, toasts | React `useState` / shadcn Toast |
| **Cached server state** | Admin dashboard data refresh | Server Actions + `revalidatePath` / `revalidateTag` |

### 10.2 Booking Wizard State Flow

```
Step 1 (Pickup)     → form field: pickupAddress, pickupLat, pickupLng
Step 2 (Destination) → form field: destAddress, destLat, destLng
Step 3 (Review)      → Server Action: calculatePrice → display route + price
Step 4 (Contact)     → form field: name, phone, email, comments
Submit               → Server Action: createOrder → redirect to confirmation
```

All wizard data lives in a single React Hook Form instance persisted across steps. On final submit, the entire payload is sent to the Server Action.

### 10.3 Admin Dashboard State

- **List pages:** Server Component fetches data; Client Component handles sorting/filtering via URL params.
- **Optimistic updates:** Status changes use `useOptimistic` (React 19) for instant UI feedback while Server Action completes.
- **Cache invalidation:** Server Actions call `revalidatePath('/admin/orders')` after mutations.

### 10.4 Future Considerations

When customer accounts and real-time tracking are added:
- **Customer session state:** Auth.js session (server-side).
- **Live tracking state:** Server-Sent Events or WebSocket (Route Handler); client subscribes via EventSource.
- **Global UI state (if needed):** Zustand for complex client-only state (e.g., notification preferences).

---

## 11. Security Architecture

### 11.1 Security Layers

```
Layer 1: Cloudflare
  └── DDoS protection, WAF rules, bot management, SSL/TLS

Layer 2: Next.js Middleware
  └── Auth session validation, rate limiting, security headers

Layer 3: Server Actions / Route Handlers
  └── Input validation (Zod), CSRF protection (built-in), authorization checks

Layer 4: Domain Services
  └── Business rule enforcement, data sanitization

Layer 5: Database
  └── Parameterized queries (Prisma), row-level constraints, encrypted at rest
```

### 11.2 Authentication & Authorization

| Concern | Implementation |
|---------|---------------|
| Admin auth | Auth.js credentials provider with bcrypt password hashing |
| Session storage | JWT strategy (stateless, edge-compatible) |
| Session expiry | 24 hours with sliding window |
| Route protection | Middleware checks session on `/admin/*` routes |
| Service-level auth | Every Server Action verifies admin session before executing |
| Future RBAC | Role field on AdminUser: `SUPER_ADMIN`, `DISPATCHER`, `VIEWER` |

### 11.3 Input Validation & Sanitization

- All user input validated with Zod schemas before processing.
- Phone numbers normalized to E.164 format.
- Text fields trimmed and length-limited.
- No raw HTML accepted from users (plain text only).
- SQL injection prevented by Prisma parameterized queries.

### 11.4 API Key & Secret Management

| Secret | Storage | Access |
|--------|---------|--------|
| `DATABASE_URL` | Vercel env vars | Server only |
| `GOOGLE_MAPS_SERVER_KEY` | Vercel env vars | Route Handlers only |
| `GOOGLE_MAPS_BROWSER_KEY` | `NEXT_PUBLIC_*` env var | Client (referrer-restricted in Google Console) |
| `WHATSAPP_API_TOKEN` | Vercel env vars | Notification adapter only |
| `AUTH_SECRET` | Vercel env vars | Auth.js only |
| `CRON_SECRET` | Vercel env vars | Cron Route Handlers only |

**Rule:** Server-side API keys are never prefixed with `NEXT_PUBLIC_` and never sent to the client.

### 11.5 Rate Limiting

| Endpoint | Limit | Implementation |
|----------|-------|---------------|
| Order submission | 5 requests / minute / IP | Middleware or Upstash Ratelimit |
| Admin login | 10 attempts / 15 min / IP | Auth.js + custom middleware |
| Maps API proxy | 30 requests / minute / IP | Route Handler middleware |
| Public pages | 100 requests / minute / IP | Cloudflare rate limiting |

### 11.6 Security Headers (Middleware)

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' maps.googleapis.com; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### 11.7 Data Privacy

- Customer phone numbers and addresses stored encrypted at rest (PostgreSQL TDE via Neon).
- No customer data exposed in URLs or client-side logs.
- Admin audit trail for all order status changes.
- GDPR-ready: data export and deletion endpoints planned for customer accounts phase.

---

## 12. Logging Strategy

### 12.1 Logger Architecture

Structured JSON logging using a custom logger wrapper (`src/lib/logger.ts`):

| Field | Purpose |
|-------|---------|
| `timestamp` | ISO 8601 |
| `level` | `debug`, `info`, `warn`, `error` |
| `message` | Human-readable description |
| `module` | Source module name |
| `action` | Operation being performed |
| `requestId` | Correlation ID per request |
| `userId` | Admin user ID (if authenticated) |
| `duration` | Operation duration in ms |
| `metadata` | Additional context (order ID, etc.) |

### 12.2 What Gets Logged

| Event | Level | Module |
|-------|-------|--------|
| Order created | `info` | orders |
| Order status changed | `info` | orders |
| Price calculated | `debug` | pricing |
| Notification sent | `info` | notifications |
| Notification failed | `error` | notifications |
| Admin login success | `info` | auth |
| Admin login failure | `warn` | auth |
| Google Maps API call | `debug` | maps |
| Google Maps API error | `error` | maps |
| Unhandled exception | `error` | global |
| Rate limit triggered | `warn` | middleware |

### 12.3 Log Destinations

| Environment | Destination |
|------------|-------------|
| Development | Console (pretty-printed) |
| Preview | Vercel Function Logs |
| Production | Vercel Function Logs + Sentry (errors and warnings) |

### 12.4 What Is NOT Logged

- Customer passwords or auth tokens
- Full API keys or secrets
- Complete request bodies containing PII (log order ID instead)

---

## 13. Error Handling Strategy

### 13.1 Error Classification

| Type | Class | HTTP Status | User Message |
|------|-------|-------------|-------------|
| Validation error | `ValidationError` | 400 | Specific field error from Zod |
| Not found | `NotFoundError` | 404 | "Resource not found" |
| Unauthorized | `UnauthorizedError` | 401 | Redirect to login |
| Forbidden | `ForbiddenError` | 403 | "Access denied" |
| Business rule violation | `BusinessError` | 422 | Specific business message (e.g., "Service not available in this area") |
| External service failure | `ExternalServiceError` | 502 | "Service temporarily unavailable" |
| Rate limited | `RateLimitError` | 429 | "Too many requests, please try again" |
| Unknown | `InternalError` | 500 | "Something went wrong" (never expose internals) |

### 13.2 Error Handling Flow

```
Server Action / Route Handler
        │
        ▼
  try { service.call() }
        │
        ├── ValidationError → return { success: false, error: { code, message, fields } }
        ├── BusinessError   → return { success: false, error: { code, message } }
        ├── NotFoundError   → return { success: false, error: { code, message } }
        └── Unknown Error   → logger.error() → Sentry.captureException()
                              → return { success: false, error: { code: 'INTERNAL', message: generic } }
```

### 13.3 ActionResult Pattern

All Server Actions return a discriminated union:

```
ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; fields?: Record<string, string> } }
```

Client components check `result.success` and handle accordingly — never try/catch Server Action calls.

### 13.4 Client-Side Error Boundaries

- `global-error.tsx` — catches unhandled errors, shows recovery UI.
- `error.tsx` per route segment — catches errors within that segment.
- `not-found.tsx` — custom 404 page.
- Toast notifications for action-level errors (form submission failures).

### 13.5 External Service Error Handling

- Google Maps API: retry once with exponential backoff; fallback to cached distance if available.
- WhatsApp/Telegram: log failure, continue with other channels; never block order creation.
- Email: retry up to 3 times via Resend's built-in retry; log final failure.

---

## 14. Scalability Strategy

### 14.1 Current Architecture Scaling Characteristics

| Component | Scaling Model | Bottleneck Threshold |
|-----------|--------------|---------------------|
| Next.js on Vercel | Auto-scaling serverless functions | ~10,000 concurrent users |
| PostgreSQL (Neon) | Vertical scaling + read replicas | ~1M orders/year |
| Google Maps API | Google-managed | API quota (configurable) |
| Notifications | Async, non-blocking | Channel rate limits |

### 14.2 Horizontal Scaling Path

```
Phase 1 (Launch)          Phase 2 (Growth)           Phase 3 (Scale)
─────────────────         ──────────────────          ──────────────────
Modular Monolith          Monolith + Edge Cache       Selective Extraction
Vercel Serverless         + Read Replicas             + Job Queue
Single Region             + CDN for Static Assets       + Multi-Region
                          + Redis Cache                 + Mobile API
                                                      + WebSocket Service
```

### 14.3 Database Scaling

| Stage | Strategy |
|-------|----------|
| Launch (< 10K orders) | Single Neon instance, connection pooling |
| Growth (10K–100K orders) | Neon read replicas for analytics queries; index optimization |
| Scale (100K+ orders) | Table partitioning by date; archive old orders; consider Neon scale-to-zero |

### 14.4 Caching Strategy

| Data | Cache Location | TTL | Invalidation |
|------|---------------|-----|-------------|
| Pricing rules | In-memory (serverless function) | 5 min | On admin update (`revalidateTag`) |
| Settings | In-memory | 10 min | On admin update |
| Static pages | Vercel CDN (ISR) | 1 hour | On-demand revalidation |
| Google Maps routes | Not cached (real-time) | — | — |
| Analytics aggregates | Server-side query cache | 15 min | Cron refresh |

### 14.5 Future Extraction Points

Modules designed for eventual extraction into independent services:

1. **Notification Service** — already adapter-based; extract when SMS/push channels multiply.
2. **Pricing Engine** — pure function module; extract when multi-operator pricing needed.
3. **Mobile API** — Route Handlers become REST endpoints for mobile app.
4. **Tracking Service** — WebSocket/SSE service for live GPS (Phase 3).

---

## 15. Deployment Strategy

### 15.1 CI/CD Pipeline

```
Developer pushes to branch
        │
        ▼
GitHub Actions CI
  ├── ESLint
  ├── TypeScript type-check
  ├── Unit tests (Vitest)
  └── Prisma schema validation
        │
        ▼ (on PR)
Vercel Preview Deployment
  ├── Build Next.js app
  ├── Run Prisma migrations (preview DB branch)
  └── Deploy to preview URL
        │
        ▼ (on merge to main)
Vercel Production Deployment
  ├── Build Next.js app
  ├── Run Prisma migrations (production DB)
  └── Deploy to production domain
  └── Purge Cloudflare cache
```

### 15.2 Environment Configuration

| Variable Group | Development | Preview | Production |
|---------------|-------------|---------|------------|
| Database | Local Docker PG | Neon branch | Neon production |
| Google Maps keys | Dev keys (restricted) | Dev keys | Production keys |
| WhatsApp | Disabled / mock | Disabled / mock | Live |
| Email | Mailpit (local) | Resend (test) | Resend (live) |
| Auth secret | Local random | Preview secret | Production secret |
| Logging level | `debug` | `info` | `warn` |

### 15.3 Database Migration Strategy

- All schema changes via Prisma Migrate — never manual SQL in production.
- Migrations run automatically during Vercel build (`prisma migrate deploy`).
- Destructive migrations require manual approval and backup confirmation.
- Preview environments use Neon database branching (isolated, ephemeral).

### 15.4 Rollback Strategy

| Scenario | Action |
|----------|--------|
| Bad deployment | Vercel instant rollback to previous deployment (one click) |
| Bad migration | Restore from Neon point-in-time recovery; redeploy previous version |
| External API outage | Graceful degradation (disable maps preview, show manual distance input) |

### 15.5 Domain & SSL

- Production domain configured in Cloudflare DNS pointing to Vercel.
- SSL/TLS: Full (strict) mode in Cloudflare.
- `www` redirect to apex domain.
- HSTS preload enabled.

---

## 16. Backup Strategy

### 16.1 Database Backups

| Method | Frequency | Retention | Provider |
|--------|-----------|-----------|----------|
| Automatic continuous backup | Continuous (WAL archiving) | 7 days (free tier) / 30 days (paid) | Neon |
| Point-in-time recovery | Any moment within retention window | — | Neon |
| Manual snapshot | Before major migrations | 90 days | Neon dashboard |
| Schema export | On every migration | Indefinite (Git) | Prisma migrations in repo |

### 16.2 Application Backups

| Asset | Backup Method |
|-------|--------------|
| Source code | GitHub (primary), local clones |
| Environment variables | Vercel dashboard export (encrypted, manual) |
| Uploaded files (future) | Vercel Blob (provider-managed redundancy) |
| Configuration | `.env.example` in repo (documented, no secrets) |

### 16.3 Disaster Recovery

| Scenario | RTO | RPO | Procedure |
|----------|-----|-----|-----------|
| Database corruption | 15 min | 0 (PITR) | Neon point-in-time restore to new branch, update DATABASE_URL, redeploy |
| Vercel outage | 30 min | 0 | Deploy to alternative (Railway/Fly.io) using same Neon DB |
| Complete data loss | 1 hour | 24 hours | Restore from Neon snapshot + redeploy from Git |
| Domain/DNS failure | 15 min | 0 | Update DNS in Cloudflare (backup registrar access required) |

### 16.4 Order Data Export

- Admin can export orders to CSV at any time (built-in feature).
- Recommended: weekly automated CSV export to secure storage (future cron job).

---

## 17. Rendering & Data-Fetching Strategy

### 17.1 Decision Matrix

| Feature / Page | Rendering | Data Fetching | Rationale |
|---------------|-----------|--------------|-----------|
| Homepage | **Server Component** (SSG + ISR) | Direct Prisma in component | SEO, fast LCP, no client JS |
| Services / About / FAQ | **Server Component** (SSG) | Static content + Settings | SEO pages, cacheable |
| Contact page | **Server Component** shell | Settings for phone/email | SEO; Client Component for click-to-call |
| Booking wizard | **Server Component** shell + **Client Components** for steps | Server Actions for price calc and submit | Interactive multi-step form requires client state |
| Address autocomplete | **Client Component** | Google Places API (browser key) | Requires user interaction and Google JS SDK |
| Route map display | **Client Component** | Route Handler proxy → Directions API | Interactive map requires Google JS SDK |
| Price calculation | **Server Action** | Pricing Engine (server-side) | Business logic must never be exposed to client |
| Order submission | **Server Action** | Orders Service → DB + Notifications | Secure, validated, atomic operation |
| Order confirmation | **Server Component** | Direct Prisma query by order ID | Static after creation, shareable URL |
| Admin login | **Client Component** form | Server Action → Auth.js | Form interaction |
| Admin dashboard | **Server Component** | Direct Prisma aggregation queries | Data-heavy, no client JS needed for initial render |
| Admin orders list | **Server Component** + **Client Component** table | Server Component fetches; Client handles sort/filter via URL params | Hybrid for interactivity without losing SSR |
| Admin order detail | **Server Component** + **Client Component** for status update | Server Action for status change | Immediate data display + interactive status buttons |
| Admin pricing CRUD | **Client Component** forms | Server Actions | Form interaction with validation |
| Admin settings | **Client Component** forms | Server Actions | Form interaction |
| Admin export | **Route Handler** (GET) | Stream CSV from DB | File download requires Route Handler |
| Sitemap / Robots | **Server Component** (dynamic) | Prisma for dynamic URLs | SEO requirement |
| Google Maps Directions proxy | **Route Handler** (POST) | Google Directions API (server key) | Protects API key, enables rate limiting |
| Google Maps Distance proxy | **Route Handler** (POST) | Google Distance Matrix API (server key) | Same as above |
| WhatsApp webhook | **Route Handler** (POST) | WhatsApp Cloud API | External callback, not a Server Action |
| Cron jobs | **Route Handler** (GET) | Internal services | Vercel Cron triggers via HTTP |
| Metadata / JSON-LD | **Server Component** (`generateMetadata`) | Settings module | SEO, rendered in `<head>` |

### 17.2 Rules of Thumb

1. **Default to Server Components.** Only add `"use client"` when the component needs browser APIs, event handlers, or React state/effects.
2. **Server Actions for mutations.** All create/update/delete operations go through Server Actions, not Route Handlers.
3. **Route Handlers for external-facing endpoints.** Webhooks, cron, file downloads, and third-party API proxies.
4. **Never fetch data in Client Components.** Pass data as props from Server Components or use Server Actions.
5. **Colocate data fetching.** Fetch data in the Server Component that renders it, not in a parent and prop-drilled down.

---

## 18. Third-Party Integration Architecture

### 18.1 Google Maps Platform

#### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                                                              │
│  AddressAutocomplete ──▶ Google Places API (browser key)    │
│  RouteMap ────────────▶ Google Maps JS SDK (browser key)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ POST /api/maps/directions
                               │ POST /api/maps/distance
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVER (Route Handlers)                 │
│                                                              │
│  MapsProxyHandler ──▶ Google Directions API (server key)   │
│  MapsProxyHandler ──▶ Google Distance Matrix (server key)  │
│  MapsService ──────▶ Static Maps URL generation (server)   │
└─────────────────────────────────────────────────────────────┘
```

#### Integration Details

| API | Used For | Called From | Key Type |
|-----|----------|-------------|----------|
| Places Autocomplete | Address input fields | Client Component | Browser key (HTTP referrer restricted) |
| Directions API | Route polyline, distance, duration | Route Handler (server proxy) | Server key (IP restricted) |
| Distance Matrix API | Batch distance validation | Route Handler (server proxy) | Server key (IP restricted) |
| Static Maps API | Order confirmation map thumbnail | Server Component (URL generation) | Server key |
| Maps JavaScript API | Interactive route map display | Client Component | Browser key |

#### Security Measures

- Two separate API keys: browser (client) and server (backend).
- Browser key restricted to production domain + localhost in Google Cloud Console.
- Server key restricted to Vercel IP ranges.
- Route Handler proxy validates input, applies rate limiting, and logs all requests.
- API quota alerts configured in Google Cloud Console.

#### Error Handling

- Directions API failure: show "Unable to calculate route" with option to proceed with estimated distance.
- Places Autocomplete failure: fallback to manual address text input.
- All API errors logged with request context for debugging.

### 18.2 WhatsApp Business Cloud API

#### Architecture

```
Order Created Event
        │
        ▼
NotificationService.notify('order.created', order)
        │
        ▼
WhatsAppAdapter.send(recipient, template, params)
        │
        ▼
Meta Graph API (POST /v19.0/{phone_number_id}/messages)
        │
        ├── Success → log info
        └── Failure → log error, continue with other channels
```

#### Integration Details

| Aspect | Detail |
|--------|--------|
| API Version | Meta Graph API v19.0+ |
| Message Type | Template messages (pre-approved by Meta) |
| Templates | `order_new` (admin alert), `order_confirmed` (customer, future) |
| Authentication | Permanent access token stored in env vars |
| Webhook | Route Handler at `/api/webhooks/whatsapp` for delivery status |
| Phone Number | WhatsApp Business phone number ID from Meta Business Suite |

#### Message Flow (MVP)

1. Customer submits order.
2. `WhatsAppAdapter` sends template message to admin's WhatsApp number.
3. Template includes: order reference, pickup address, destination, estimated price, customer phone.
4. Admin can click-to-respond directly in WhatsApp.

#### Fallback Strategy

WhatsApp API approval and template review can take days. At launch:
- Primary: WhatsApp click-to-chat link (no API needed) on confirmation page.
- Secondary: Telegram + Email notifications via API (immediate).
- Upgrade to WhatsApp API when Meta Business verification completes.

### 18.3 Email Service (Resend)

#### Architecture

```
NotificationService.notify('order.created', order)
        │
        ▼
EmailAdapter.send(to, subject, htmlBody)
        │
        ▼
Resend API (POST /emails)
        │
        ├── Success → log info
        └── Failure → retry up to 3 times → log error
```

#### Integration Details

| Aspect | Detail |
|--------|--------|
| Provider | Resend |
| From Address | `orders@{domain}` (verified domain) |
| Templates | React Email components for type-safe HTML emails |
| Email Types | Admin new order alert, customer order confirmation (future) |
| Authentication | API key in env vars |

#### Email Templates

| Template | Recipient | Trigger |
|----------|-----------|---------|
| `AdminNewOrder` | Admin email | Order created |
| `OrderConfirmation` | Customer email | Order created (if email provided) |
| `OrderStatusUpdate` | Customer email | Status changed (future) |

---

## 19. PostgreSQL Hosting Recommendation

### Recommendation: Neon

### Comparison Matrix

| Criteria | Neon | Supabase | Railway | AWS RDS |
|----------|------|----------|---------|---------|
| Serverless scaling | Yes (scale to zero) | Yes | No | No |
| Connection pooling | Built-in | Built-in (PgBouncer) | Manual | Manual (RDS Proxy) |
| Database branching | Yes (unique feature) | No | No | No |
| PostGIS support | Yes | Yes | Yes | Yes |
| Free tier | 0.5 GB, 1 project | 500 MB, 2 projects | $5 credit | 12 months free |
| Vercel integration | Native (marketplace) | Native (marketplace) | Manual | Manual |
| Point-in-time recovery | Yes | Yes (paid) | No | Yes |
| Pricing at scale | Usage-based, predictable | Usage-based | Fixed monthly | Complex |
| Cold start latency | ~500ms (acceptable) | ~500ms | None (always on) | None |
| Vendor lock-in | Low (standard PG) | Medium (auth/storage bundled) | Low | High |

### Why Neon

1. **Database Branching** — Create isolated database copies for every preview deployment. Each PR gets its own database branch that is automatically created and destroyed. This is invaluable for testing migrations safely.

2. **Serverless-Native** — Built for serverless environments like Vercel. Connection pooling via `@neondatabase/serverless` driver eliminates connection exhaustion issues that plague traditional PostgreSQL with serverless functions.

3. **Scale to Zero** — Development and preview databases consume zero resources when idle, reducing costs during low-traffic periods.

4. **Standard PostgreSQL** — No vendor-specific extensions required. Standard Prisma compatibility. Easy migration to any PostgreSQL provider if needed.

5. **Point-in-Time Recovery** — Continuous WAL archiving enables recovery to any second within the retention window. Critical for order data protection.

6. **Vercel Integration** — One-click setup via Vercel Marketplace with automatic `DATABASE_URL` injection.

7. **Cost Predictability** — Usage-based pricing (compute hours + storage) with generous free tier. At MVP scale (< 10K orders), cost is effectively zero.

### Neon Configuration

| Setting | Value |
|---------|-------|
| Region | Closest to Vercel deployment region (e.g., `eu-central-1` for European users) |
| PostgreSQL Version | 16 |
| Compute Size | 0.25 CU (free tier) → scale up as needed |
| Connection Pooling | Enabled (built-in) |
| Branching | `main` (production), `dev` (development), ephemeral (preview) |

### Why Not Supabase

Supabase is an excellent platform but bundles auth, storage, and realtime services that overlap with our chosen stack (Auth.js, Vercel Blob, Server Actions). Using Supabase only for its database means paying for unused features. Neon provides a focused, optimized PostgreSQL experience without bundled services.

---

## 20. File Storage Recommendation

### Recommendation: Vercel Blob

### Comparison Matrix

| Criteria | Vercel Blob | AWS S3 | Cloudflare R2 | Supabase Storage |
|----------|------------|--------|-----------------|-----------------|
| Vercel integration | Native | Manual SDK | Manual SDK | Manual SDK |
| Edge delivery | Yes (CDN) | CloudFront (extra) | Yes (CDN) | Limited |
| Pricing | $0.15/GB stored, $0.15/GB transfer | Complex tiered | $0.015/GB, free egress | 1 GB free |
| Upload from Server Actions | Yes (direct) | Presigned URLs needed | Presigned URLs needed | Yes |
| Access control | Token-based | IAM policies | API tokens | RLS policies |
| Preview env support | Automatic | Manual buckets | Manual buckets | Manual |

### Why Vercel Blob

1. **Native Integration** — Works seamlessly with Server Actions and Route Handlers on Vercel. No additional SDK configuration or credential management.

2. **Edge-Optimized Delivery** — Files served from Vercel's edge network, ensuring fast delivery globally.

3. **Simple API** — Upload from Server Actions with a single `put()` call. No presigned URL complexity for server-side uploads.

4. **Environment Isolation** — Separate blob stores per environment (development, preview, production) automatically.

5. **Future Use Cases Ready** — Order photo attachments (damage photos), exported CSV files, admin document uploads, vehicle photos.

### Planned File Storage Use Cases

| Use Case | Phase | Storage Pattern |
|----------|-------|----------------|
| Order damage photos | Phase 2+ | `{orderId}/photos/{filename}` |
| CSV export files | MVP | `{date}/exports/orders-{timestamp}.csv` |
| Company logo/assets | MVP | `assets/logo.png` (or static in `/public`) |
| Service area GeoJSON | Phase 2+ | `config/service-areas/{cityId}.geojson` |

### Storage Security

- All uploads validated server-side (file type, size limit: 5 MB per file).
- Blob access tokens are server-side only — never exposed to client.
- Public assets (logo) served via CDN; private files (order photos) require authenticated access via Route Handler proxy.

---

## 21. Architecture Decision Summary

### Why This Architecture Is the Best Long-Term Solution

#### 1. Modular Monolith — The Right Starting Point

Microservices add operational complexity (service discovery, inter-service communication, distributed tracing, multiple deployments) that is unjustified at launch. A modular monolith gives us:

- **Single deployment** — one CI/CD pipeline, one monitoring target, one rollback surface.
- **Module boundaries** — each domain module has a clear public interface, making future extraction trivial.
- **Shared types** — TypeScript types, Zod schemas, and Prisma models are shared without API contract overhead.
- **Zero network latency** — module-to-module calls are in-process function calls, not HTTP requests.

When the platform grows to require independent scaling (e.g., notification service handling 10K messages/hour), individual modules can be extracted without rewriting the codebase.

#### 2. Next.js App Router — Full-Stack in One Framework

- **SEO**: Server Components render HTML on the server — search engines receive fully rendered pages.
- **Performance**: Zero client JavaScript for static content; interactive islands only where needed.
- **Developer Experience**: One framework, one language, one deployment for frontend and backend.
- **Ecosystem**: shadcn/ui, Auth.js, Prisma, and Vercel are all designed to work together.

#### 3. Server Actions — Type-Safe, Secure Mutations

- End-to-end type safety from form to database without REST API boilerplate.
- Built-in CSRF protection eliminates an entire class of security vulnerabilities.
- Progressive enhancement — forms work without JavaScript.
- Automatic request deduplication and caching integration.

#### 4. Adapter Pattern for External Services

Google Maps, WhatsApp, Telegram, and Email are all integrated through adapter interfaces. This means:

- Switching email providers (Resend → SendGrid) requires changing one file.
- Adding SMS notifications means adding one adapter, not modifying order logic.
- Testing is simplified — mock adapters replace real services in test environments.

#### 5. PostgreSQL on Neon — Production-Grade from Day One

- ACID compliance protects order and financial data integrity.
- Database branching enables safe migration testing on every PR.
- Serverless connection pooling eliminates the #1 PostgreSQL + serverless failure mode.
- Point-in-time recovery protects against data loss.
- Standard PostgreSQL ensures zero vendor lock-in.

#### 6. Security by Design, Not by Afterthought

- Defense in depth: Cloudflare → Middleware → Server Actions → Services → Database.
- Secrets never reach the client.
- All input validated before processing.
- Rate limiting on every public endpoint.
- Audit trail on all order mutations.

#### 7. Built for the Roadmap

Every future feature has a clear architectural hook:

| Future Feature | Ready Today |
|---------------|-------------|
| Multi-language | URL-based locale routing, `next-intl` integration point |
| Multi-city | `City` entity slot in schema, city-scoped service modules |
| Customer accounts | Auth.js provider extension, `Customer` entity |
| Online payments | Route Handler webhook pattern, `Payment` module slot |
| Live GPS tracking | Route Handler SSE/WebSocket, `TrackingSession` entity |
| Mobile app | Route Handlers become REST API with minimal changes |
| CRM integration | Event-driven notification module extension |
| AI assistant | Server Action or Route Handler endpoint |

#### 8. Cost-Effective at Every Scale

| Scale | Monthly Cost (Estimate) |
|-------|------------------------|
| Launch (0–1K orders) | $0–20 (free tiers) |
| Growth (1K–10K orders) | $20–100 |
| Scale (10K–100K orders) | $100–500 |

No upfront infrastructure investment. Costs scale linearly with usage.

---

## Approval Checklist

Before proceeding to Phase 3 (Folder Structure & Project Scaffolding), please confirm:

- [ ] Modular monolith architecture approved
- [ ] Module definitions and boundaries approved
- [ ] Folder architecture approved
- [ ] Technology choices confirmed (Next.js, Prisma, Neon, Vercel, Resend)
- [ ] Server Actions + Route Handlers strategy approved
- [ ] Google Maps integration approach approved (dual-key, server proxy)
- [ ] Notification strategy approved (WhatsApp click-to-chat at launch + Telegram/Email API)
- [ ] PostgreSQL hosting: Neon approved
- [ ] File storage: Vercel Blob approved
- [ ] MVP scope boundaries confirmed
- [ ] Any modules to add, remove, or modify
- [ ] Initial target market/city for configuration defaults

---

*This document is the authoritative architecture reference for the Tow Truck Service Platform. All implementation decisions in subsequent phases must align with this architecture unless explicitly revised via an Architecture Decision Record (ADR).*
