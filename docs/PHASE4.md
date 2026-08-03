# Phase 4 — Database Design

**Version:** 1.0  
**Status:** Complete — Pending Approval  
**Date:** 2026-08-03

---

## Summary

Phase 4 delivers the complete production PostgreSQL database design for the Tow Truck Service Platform.

## Deliverables

| Deliverable | Location |
|-------------|----------|
| Complete Prisma schema | `prisma/schema.prisma` |
| Database design document | `docs/DATABASE.md` |
| Seed script | `prisma/seed.ts` |

## Schema at a Glance

- **14 models** across 14 tables
- **10 enums** for type-safe domain values
- **20+ indexes** for query performance
- **12 foreign key relationships** with explicit delete behaviors
- **Ukraine defaults** in seed data (Kyiv, UAH, Ukrainian holidays)

## Entities

| Domain | Models |
|--------|--------|
| Auth | AdminUser, Account, Session, VerificationToken |
| Geography | City, ServiceArea, Holiday |
| Pricing | PricingRule, VehicleTypeSurcharge |
| Orders | Order, OrderStatusHistory |
| Notifications | NotificationLog |
| Configuration | Setting |

## Key Design Highlights

1. **Immutable price snapshots** — `Order.priceBreakdown` JSON preserves pricing at order time
2. **Flexible pricing engine** — all 7 surcharge types supported via schema
3. **Configurable branding** — Settings table, no hardcoded values
4. **OAuth-ready auth** — Auth.js adapter models included
5. **Multi-city ready** — City entity with Kyiv as default
6. **Notification audit trail** — NotificationLog for all channels

## Next Steps After Approval

1. Connect DATABASE_URL (Neon or local PostgreSQL)
2. Run `npx prisma migrate dev --name init`
3. Run `npm run db:seed`
4. Proceed to **Phase 5 — API Specification**

---

*Awaiting approval before proceeding to Phase 5.*
