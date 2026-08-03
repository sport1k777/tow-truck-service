# Folder Structure Reference

This document mirrors the folder architecture defined in [ARCHITECTURE.md](./ARCHITECTURE.md) Section 6.

## Root

```
tow-truck-service/
├── .github/workflows/ci.yml
├── docs/
├── prisma/
├── public/
├── src/
├── .env.example
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## Source (`src/`)

```
src/
├── app/
│   ├── (public)/                 # Public marketing + booking
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Homepage
│   │   ├── order/page.tsx
│   │   ├── services/page.tsx
│   │   ├── about/page.tsx
│   │   ├── faq/page.tsx
│   │   └── contact/page.tsx
│   ├── (admin)/                  # Protected admin area
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── dashboard/page.tsx
│   │       ├── orders/page.tsx
│   │       ├── orders/[id]/page.tsx
│   │       ├── pricing/page.tsx
│   │       ├── service-areas/page.tsx
│   │       ├── settings/page.tsx
│   │       └── export/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── maps/directions/route.ts
│   │   ├── maps/distance/route.ts
│   │   ├── webhooks/whatsapp/route.ts
│   │   └── cron/cleanup/route.ts
│   ├── login/page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── modules/
│   ├── orders/
│   ├── pricing/
│   ├── maps/
│   ├── notifications/
│   │   └── adapters/
│   ├── settings/
│   └── seo/
├── components/                   # Created in Phase 7
├── actions/
│   ├── order.actions.ts
│   └── pricing.actions.ts
├── hooks/                        # Created in Phase 7
├── lib/
│   ├── auth.ts
│   ├── constants.ts
│   ├── env.ts
│   ├── errors.ts
│   ├── locale.defaults.ts
│   ├── logger.ts
│   ├── prisma.ts
│   └── utils.ts
├── types/
│   ├── api.types.ts
│   └── next-auth.d.ts
└── middleware.ts
```

## Module Internal Structure

Each domain module follows this pattern:

```
modules/{name}/
├── {name}.service.ts       # Public service interface
├── {name}.repository.ts    # Prisma queries (Phase 4+)
├── {name}.types.ts         # Module-specific types
├── {name}.schema.ts        # Zod validation (Phase 5+)
└── {name}.constants.ts     # Module constants (if needed)
```

## Import Rules

- Modules import from `@/lib/` and their own directory only
- Cross-module communication via service interfaces (e.g., `@/modules/orders/orders.service`)
- Never import another module's repository or internal files
- Server Actions in `src/actions/` orchestrate module services
- Components never import Prisma directly
