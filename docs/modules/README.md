# XProperty — Module Specs

Per-module specs recursing **Specify → Plan → Tasks** off the approved capability map in
[`../spec.md`](../spec.md). Every module traces to a stable module id + FR group. Read the master
spec and the [ADRs](../adr/) first.

## Build order

```
identity, marketing  →  catalog, leads  →  booking  →  buyer, consultant  →  admin
```

`marketing` and `identity` have no upstream dependencies (build in parallel). `admin` is last — it
manages every other module's data.

## Specs

| # | Module | FR | Depends on | Phase | Spec |
|---|---|---|---|---|---|
| 01 | `identity` | FR-4 | — | P2* | [01-identity.md](01-identity.md) |
| 02 | `marketing` | FR-1 | — | P1 | [02-marketing.md](02-marketing.md) |
| 03 | `catalog` | FR-2 | identity | P1 | [03-catalog.md](03-catalog.md) |
| 04 | `leads` | FR-7 | catalog | P1 | [04-leads.md](04-leads.md) |
| 05 | `booking` | FR-3 | catalog, leads | P2 | [05-booking.md](05-booking.md) |
| 06 | `buyer` | FR-5 | identity, catalog, booking | P2 | [06-buyer.md](06-buyer.md) |
| 07 | `consultant` | FR-6 | identity | P3 | [07-consultant.md](07-consultant.md) |
| 08 | `admin` | FR-8 | all | P3 | [08-admin.md](08-admin.md) |

\* `identity` is specified first (everything authenticated depends on it) though it ships in P2.

## FR coverage map

Every functional requirement traces to exactly one owning module. No FR is unowned.

| FR | Owner |
|---|---|
| FR-1 Marketing content, carousel, testimonials, footer | `marketing` |
| FR-2 Listings, detail, filter/sort, favorites | `catalog` |
| FR-3 Inspection booking + admin management | `booking` |
| FR-4 Auth, roles, sessions, profile | `identity` |
| FR-5 Buyer onboarding + dashboard | `buyer` |
| FR-6 Consultant application, referral, attribution | `consultant` |
| FR-7 Lead capture, WhatsApp/tel/mailto, source tags | `leads` |
| FR-8 Admin CRUD, content, leads/inspections/approvals, RBAC | `admin` |

## Open questions — all resolved (2026-08-30)

Every gating question is locked; module Plans are unblocked. See the decisions table in
[`../spec.md`](../spec.md).

| Q | Question | Resolution | Affects |
|---|---|---|---|
| Q1 | Commission vs. referral-only | **Commission-based** — track referral + commission % + payout status | `consultant`, `admin` |
| Q2 | Online payments vs. lead-gen | **Lead-gen, offline closing** — online payments = P4 | `buyer`, P4 |
| Q3 | "Documentation status" fields | **Full set**: label + C-of-O, Gov Consent, Survey Plan, Deed of Assignment, Excision, Gazette | `catalog` |
| Q4 | Post-purchase allocation | **Simple tracker**: `reserved → allocated → documented`, admin-driven | `buyer`, `admin` |
| Q5 | SPA SEO | Build-time prerender/SSG — [ADR-0003](../adr/0003-seo-prerender-ssg.md) | all public routes |
| Q6 | Backend framework | Express + Drizzle — [ADR-0002](../adr/0002-backend-express-drizzle.md) | `server/` |

Remaining **P4** scope (not open questions, just deferred): online payments/escrow and a full
commission-payout + allocation ledger.

## Spec conventions

- Each spec has: header (traces/depends/phase), **Specify** (responsibilities, acceptance criteria,
  out of scope), **Plan** (client/server/data/schemas/decisions), **Tasks** (ordered, FR-tagged),
  **Tests** (unit/integration/e2e + coverage target).
- Tasks that touch the DB schema or add dependencies are marked **Ask-first** per the master spec's
  Boundaries.
- Every task references the FR(s) it satisfies; every FR has ≥1 test.
