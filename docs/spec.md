# Spec: XProperty — Real Estate Development Platform

> Spec-driven development document. Derived from the SRS & Build Plan for a trust-first
> real estate platform modeled on Luxury Redwood Properties. Requirement IDs (FR-x, NFR-x)
> are stable handles — reference them directly in tickets, tests, and prompts.
>
> **Architecture note:** this revision targets a **React SPA (Vite + React)** frontend with a
> **separate Node/Express API**, replacing the earlier monolithic Next.js decision. See Tech Stack.

---

## Locked decisions (2026-08-30)

Recorded after human review of the capability map. These resolve the gating Open Questions needed
to start per-module specs. Full rationale lives in `docs/adr/`.

| # | Decision | Status | ADR |
|---|---|---|---|
| Architecture | Client-rendered React SPA + separate REST API (two deployables) | Locked | ADR-0001 |
| Q6 — Backend | **Express + Drizzle ORM** on Node LTS; PostgreSQL | Locked | ADR-0002 |
| Q5 — SEO (NFR-3) | **Build-time prerender/SSG** for public routes + `react-helmet-async` + generated sitemap | Locked | ADR-0003 |
| Q1 — Consultant | **Commission-based**: track referral + commission % + payout status per sale | Locked | — |
| Q2 — Transactions | **Lead-gen with offline closing**; no online payments in MVP (payments = P4) | Locked | — |
| Q3 — Doc status | **Full Nigerian set**: overall label + C-of-O, Governor's Consent, Survey Plan, Deed of Assignment, Excision, Gazette flags | Locked | — |
| Q4 — Allocation | **Simple allocation tracker** in buyer dashboard: `reserved → allocated → documented` (admin-driven) | Locked | — |
| Start | Recurse **Specify → Plan → Tasks** per module in build order | In progress | — |

All gating open questions are now resolved; module Plans are unblocked. Online payments and a full
allocation/commission-payout ledger remain **P4** scope.

---

## Phase 0: Capability Map

This initiative bundles several independently testable capabilities. Each module below can ship
and be verified separately, so we specify a capability map before writing per-module specs.

| Module id | Responsibility | Depends on |
|---|---|---|
| `marketing` | Public content pages, hero, carousel, testimonials, footer (FR-1) | — |
| `catalog` | Property listings, detail pages, filter/sort, favorites (FR-2) | `identity` (for favorites) |
| `identity` | Auth, roles, sessions, profile (FR-4) via Clerk | — |
| `leads` | Contact/inquiry capture, WhatsApp/tel/mailto links, source tagging (FR-7) | `catalog` (optional link) |
| `booking` | Inspection/appointment scheduling tied to a property (FR-3) | `catalog`, `leads` |
| `buyer` | Buyer onboarding + dashboard: saved properties, inspections, status (FR-5) | `identity`, `catalog`, `booking` |
| `consultant` | Consultant application, referral codes, attribution, commission (FR-6) | `identity` |
| `admin` | CRUD for properties/content, leads, inspections, approvals, RBAC (FR-8) | all above |

**Build order:** `identity`, `marketing` → `catalog`, `leads` → `booking` → `buyer`, `consultant` → `admin`

**Dependency notes:** Arrows point one way, no cycles. `marketing` and `identity` have no upstream
dependencies and can be built first in parallel. `admin` is last because it manages every other
module's data. Interfaces between modules (e.g. `buyer` reading `booking` state) live in the
provider module's spec.

> The map is gated: review module boundaries, dependency direction, and build order before any
> module spec is written. Then recurse Specify → Plan → Tasks → Implement per module in build order.

---

## Objective

Build a trust-first platform that markets well-documented estates, captures qualified leads, and
manages buyer and consultant relationships end to end. The central promise is **verified
documentation and transparent process** — listings must surface title/documentation status, and the
sales funnel must route leads to human contact (including WhatsApp) fast.

**Users:** three authenticated roles plus anonymous visitors.
- **Visitor** — browses, inquires, initiates WhatsApp, registers. No dashboard.
- **Buyer / Investor** — saves properties, books inspections, tracks inquiries/allocation.
- **Consultant / Agent** — gets a referral link/code, registers referred buyers, tracks commission.
- **Admin / Staff** — manages listings, docs, content, schedule, leads, consultant approvals.

**Success looks like:** a mobile-first funnel where a visitor can find a documented property,
verify its title status, book an inspection or reach the team on WhatsApp in seconds, and — if they
register — track everything from a role-appropriate dashboard.

**In scope (MVP):** marketing pages, property catalog with documentation status + inspection
booking, dual onboarding (buyer/consultant), role-based auth, lead capture + WhatsApp deep links,
admin content/lead console.

**Out of scope (initial):** online payments/escrow/installment ledgers (Phase 3+), native mobile
apps (web-responsive first), automated title verification against government registries (manual
admin flag at MVP).

---

## Tech Stack

Architecture is a **client-rendered React SPA plus a separate REST API**. React runs only in the
browser, so — unlike the earlier Next.js plan — database access, auth verification, and staff
notifications live in a standalone backend service. Frontend and backend can share one monorepo but
are two deployables.

**Frontend — React SPA**

| Dependency | Target (Aug 2026 stable) | Notes |
|---|---|---|
| React / React DOM | 19.2.x | Latest 19.2 patch |
| Vite | Latest stable | Build tool + dev server (replaces `create-next-app`) |
| TypeScript | Latest stable | Strict mode on |
| React Router | Latest stable (v7 data router) | Client-side routing (replaces file-based App Router) |
| @clerk/clerk-react | Latest stable | Auth UI, session/token on the client (replaces `@clerk/nextjs`) |
| TanStack Query | v5 | Server-state fetching/caching against the API |
| react-hook-form + zod | Latest stable | Form state + shared validation schemas |
| react-helmet-async | Latest stable | Per-page `<head>` metadata for SEO (see NFR-3 tradeoff) |
| Tailwind CSS | Latest stable | Responsive-first UI (NFR-1); required by shadcn/ui |
| shadcn/ui | CLI `@latest` | Vite install: `npx shadcn@latest init` then `add dashboard-01`; components copied into repo |

**Backend — REST API**

| Dependency | Target (Aug 2026 stable) | Notes |
|---|---|---|
| Node.js | Active LTS | Runtime |
| Express | Latest stable | REST API service; owns all DB + notification logic |
| @clerk/express | Latest stable | Verifies Clerk session tokens, exposes `auth` on requests |
| Drizzle ORM + drizzle-kit | Latest stable | **Locked (Q6).** SQL-first typed ORM; migrations checked into repo |
| PostgreSQL | 18 (stable) | Primary datastore; Docker Compose (`postgres:18`) in dev. Property media in **Cloudinary** (ADR-0004) |
| zod | Latest stable | Validate request bodies at the API boundary (shared schemas with frontend) |

**Deploy:** SPA as static assets on a CDN/static host (e.g. Netlify/Vercel static/S3+CloudFront);
API as a Node service. Two targets instead of one.
**Dependency policy:** use latest *stable* (not canary/beta) at init, pin exact versions in the
lockfile, apply security patches throughout the lifecycle.

> **SEO tradeoff (NFR-3):** a client-rendered SPA does not ship server-rendered HTML. **Locked
> decision (ADR-0003):** public marketing and catalog pages are **prerendered/statically generated
> at build time** (`vite-react-ssg`) with `react-helmet-async` driving per-page tags, plus a
> generated sitemap. Required mitigation, not optional.

---

## Commands

```
Init (frontend):  npm create vite@latest -- --template react-ts   # re-check newest stable at create time
shadcn init:      npx shadcn@latest init
Dashboard shell:  npx shadcn@latest add dashboard-01
Install:          npm install
Dev (frontend):   npm run dev            # vite dev server
Dev (backend):    npm run dev:api        # express with watch
Build:            npm run build          # tsc + vite build (frontend); tsc (backend)
Preview:          npm run preview        # serve built SPA locally
Test:             npm test               # vitest
Lint:             npm run lint -- --fix
Migrate:          npx drizzle-kit generate && npx drizzle-kit migrate
```

---

## Project Structure

Monorepo with a client SPA and an API service.

```
client/                 → React SPA (Vite)
  src/main.tsx          → App entry, providers (Clerk, Query, Router)
  src/App.tsx           → Route table (React Router)
  src/routes/           → Route components: home, about, properties, become-buyer, dashboard/*
  src/components/       → Composed components (owned, editable)
  src/components/ui/     → shadcn primitives (copied in via CLI)
  src/api/              → Typed API client wrappers (fetch + Clerk token)
  src/hooks/            → Data hooks (TanStack Query), auth guards
  src/lib/              → Shared utilities, zod schemas
server/                 → Express API service
  src/index.ts          → App bootstrap, Clerk middleware
  src/routes/           → REST endpoints (properties, leads, inspections, referrals, content)
  src/lib/              → db client, notification adapters
  src/db/               → Drizzle schema + migrations
tests/                  → Unit + integration tests
e2e/                    → End-to-end tests (responsive + funnel flows)
docs/                   → Spec, ADRs, module specs
```

---

## Site Map & Routes

Routes are client-side (React Router). Public routes are prerendered for SEO (NFR-3).

| Route | Purpose | Access |
|---|---|---|
| `/` | Home: hero, trust, vision/mission, values, testimonials, carousel | Public |
| `/about` | Company story, values | Public |
| `/properties` | Catalog + inspection/appointment booking | Public |
| `/become-buyer` | Buyer application / onboarding | Public |
| `/become-consultant` | Consultant application | Public |
| `/for-agents` | Consultant program info + portal entry | Public |
| `/contact` | Office address, phone, email, inquiry form | Public |
| `/users?mode=register` | Account creation | Public |
| `/users?mode=login` | Sign in | Public |
| `/privacy` | Privacy policy | Public |
| `/terms` | Terms of use | Public |
| `/dashboard/*` | Role-based portals | Authenticated |

---

## Functional Requirements (by module)

### `marketing` — FR-1
- **FR-1.1** Home shows hero with primary CTAs ("Learn More", "Get Started"), trust section, vision/mission, core-values grid.
- **FR-1.2** "Why choose us" carousel auto-advances every 8s, supports drag-to-slide + arrow nav, paginates (e.g. 1/6).
- **FR-1.3** Testimonials (quote, name, role) sourced from a managed collection, not hardcoded.
- **FR-1.4** About, Privacy, Terms render static managed content.
- **FR-1.5** Global footer: quick links, office address, phone, email, social links.

### `catalog` — FR-2
- **FR-2.1** List properties with title, location, price/band, documentation status.
- **FR-2.2** Detail page: media gallery, description, land title/documentation flags, location.
- **FR-2.3** Filter/sort by location, price, availability/status.
- **FR-2.4** Authenticated buyers can save/favorite a property.

### `booking` — FR-3
- **FR-3.1** Select a property, choose date/time slot, submit contact details.
- **FR-3.2** Confirm via email and/or WhatsApp; notify staff.
- **FR-3.3** Admin can see, reschedule, confirm, or cancel bookings.

### `identity` — FR-4
- **FR-4.1** Register, login, logout, password reset, email verification (Clerk-managed).
- **FR-4.2** Assign role at registration (buyer or consultant); admin assigned internally.
- **FR-4.3** Route to role-appropriate dashboard post-login; enforce authorization on protected routes (client route guards + API token verification).
- **FR-4.4** Editable profile (contact details, password).

### `buyer` — FR-5
- **FR-5.1** "Become a Buyer" captures investor intent and creates/links an account.
- **FR-5.2** Dashboard: saved properties, booked inspections, inquiry/allocation status.

### `consultant` — FR-6
- **FR-6.1** "Become a Consultant" application; admin approves or rejects.
- **FR-6.2** Approved consultants get a unique referral link/code.
- **FR-6.3** Attribute referred buyers/sales to a consultant; track referral + commission status.

### `leads` — FR-7
- **FR-7.1** Contact/inquiry forms persist submissions and notify staff.
- **FR-7.2** WhatsApp deep links ("Speak with our team", floating widget with multiple numbers) via `wa.me`.
- **FR-7.3** Click-to-call (`tel:`) and email (`mailto:`) links.
- **FR-7.4** Tag each lead with its source (buyer form, consultant, WhatsApp, contact page).

### `admin` — FR-8
- **FR-8.1** CRUD for properties and documentation status.
- **FR-8.2** Manage testimonials, carousel slides, content blocks (values, vision, mission).
- **FR-8.3** View/manage leads, inspections, consultant applications.
- **FR-8.4** Role and access management.

---

## Non-Functional Requirements

- **NFR-1 Responsiveness (top priority).** Mobile-first, fully responsive from ≥360px through ≥1920px — no horizontal scroll or broken layout on any page, form, dashboard, or the carousel. The Lagos audience is predominantly mobile; WhatsApp/call links matter most there.
- **NFR-2 Performance.** Optimized, lazy-loaded property imagery; route-level code splitting (React.lazy) to keep the SPA bundle small; core pages interactive under 3s on 3G/4G.
- **NFR-3 SEO.** Per-page metadata via `react-helmet-async`, semantic markup, sitemap for listing discoverability. **Public pages must be prerendered/SSG at build time** to overcome the SPA's client-only rendering.
- **NFR-4 Security.** Clerk-managed hashed passwords + secure sessions; API verifies Clerk tokens on every protected request; RBAC enforced server-side (client guards are UX only); input validation; rate-limited form endpoints.
- **NFR-5 Accessibility.** WCAG 2.1 AA: keyboard-navigable carousel, alt text, sufficient contrast.
- **NFR-6 Analytics.** Track CTA clicks and lead source for buyer/consultant/WhatsApp attribution.
- **NFR-7 Reliability & privacy.** Backups; personal-data handling consistent with the published privacy policy.

---

## Data Model

Owned by the API/database. The SPA never touches the database directly.

| Entity | Key fields |
|---|---|
| `User` | id, name, email, phone, password_hash, role (buyer/consultant/admin), verified, created_at |
| `Property` | id, title, location, price/band, documentation_status, description, availability, media[] |
| `Inspection` | id, user_id, property_id, datetime, status (requested/confirmed/cancelled) |
| `Lead` / `Inquiry` | id, name, contact, message, source, property_id?, status, created_at |
| `Consultant` | id (→User), referral_code, approval_status, commission_terms |
| `Referral` | id, consultant_id, referred_user_id, property_id?, status, commission_rate, commission_amount, commission_status |
| `Allocation` | id, buyer_user_id, property_id, stage (reserved/allocated/documented), notes?, updated_at |
| `ContentBlock` | id, type (testimonial/value/carousel/page), payload, order, published |

---

## Code Style

TypeScript strict mode throughout. On the client: function components, hooks, and TanStack Query for
server state; **no direct DB access from the browser** — all data goes through the typed API client.
RBAC is enforced on the server; client guards are UX only.

- **Naming:** kebab-case files/routes, PascalCase components, camelCase functions/vars, stable kebab-case module ids.
- **Validation:** share zod schemas between client (react-hook-form) and server (request parsing); the server is the source of truth.
- **UI:** compose from shadcn primitives added via CLI; do not pull a second component library.

---

## Testing Strategy

- **Framework:** Vitest for unit + integration; React Testing Library for components; Playwright for e2e.
- **Locations:** `tests/` for unit + integration, `e2e/` for end-to-end.
- **Levels:**
  - Unit — utilities, zod schemas, data hooks, data-model helpers.
  - Integration — API endpoints against a test database; React Query hooks against a mocked API.
  - E2E — funnel flows (browse → inspection booking → confirmation) and **responsive verification at 360px, 768px, 1024px, 1440px, 1920px** to enforce NFR-1.
- **Coverage:** set an explicit target per module at Plan phase; every FR maps to at least one test.

---

## Boundaries

- **Always:** run tests before commits; enforce RBAC **server-side** on every protected endpoint (client guards are UX only); validate + rate-limit public form endpoints; verify responsiveness at all breakpoints; keep migrations in the repo.
- **Ask first:** database schema changes, adding dependencies, changing CI config, changing the Clerk role model, altering module boundaries or build order, changing the client/API split.
- **Never:** commit secrets or Clerk keys; call the database directly from the browser; edit `components/ui` vendored primitives without recording the change; remove failing tests without approval; ship a property listing without a documentation-status value.

---

## Success Criteria

- All 8 modules pass their FR-mapped tests; no FR is untested.
- Every page/form/dashboard/carousel verified with no horizontal scroll or broken layout from 360px–1920px (NFR-1).
- Public pages are prerendered with correct per-page metadata and a generated sitemap (NFR-3).
- Core public pages interactive under 3s on 3G/4G (NFR-2).
- A visitor can browse → view documentation status → book an inspection **or** reach the team on WhatsApp without an account.
- A registered buyer sees saved properties, booked inspections, and status in-dashboard.
- An approved consultant has a working referral link, and a buyer registering via it is attributed to that consultant with a trackable status.
- Admin can CRUD properties/content, manage leads/inspections, and approve/reject consultants.
- Protected API endpoints reject unauthenticated/unauthorized requests, regardless of client state.

---

## Phased Roadmap

| Phase | Scope | Modules |
|---|---|---|
| **P1 — MVP** | Marketing pages, catalog + detail, contact/lead forms, WhatsApp links | `marketing`, `catalog`, `leads` |
| **P2 — Accounts** | Clerk auth, buyer onboarding + dashboard, inspection booking | `identity`, `buyer`, `booking` |
| **P3 — Consultants** | Consultant application, referral codes, attribution, admin console | `consultant`, `admin` |
| **P4 — Scale** | Payments/allocation ledger, richer analytics, title-verification integrations | (post-MVP) |

---

## Open Questions

Derived from the reference site's home page only; `/properties`, `/become-buyer`,
`/become-consultant`, and `/for-agents` were inferred from navigation and CTA targets.

1. Does the consultant model pay commission, or is it referral-only? — **resolved:** commission-based; track referral + commission % + payout status (`consultant`).
2. Do buyers transact/pay online, or is the site lead-gen with offline closing? — **resolved:** lead-gen, offline closing; online payments are P4.
3. What exact fields make up "documentation status" (survey, deed, C-of-O, gazette)? — **resolved:** overall label + C-of-O, Governor's Consent, Survey Plan, Deed of Assignment, Excision, Gazette flags (`catalog`).
4. Is there an allocation workflow after purchase that buyers track in-dashboard? — **resolved:** simple tracker `reserved → allocated → documented`, admin-driven (`buyer`).
5. SEO strategy for the SPA — **resolved:** build-time prerender/SSG (ADR-0003).
6. Backend framework — **resolved:** Express + Drizzle (ADR-0002).

## Verification (before implementation)

- [x] Spec covers all six core areas (Objective, Tech Stack/Commands, Structure, Code Style, Testing, Boundaries).
- [x] Human has reviewed and approved the capability map.
- [x] Success criteria are specific and testable.
- [x] Boundaries (Always / Ask first / Never) are defined.
- [x] Spec saved to the repository.
- [x] Capability map (module ids, dependency direction, build order) approved before any module spec is written.
- [ ] Every module spec traces to a module id in the approved map. — in progress (`docs/modules/`).
- [x] SPA SEO mitigation (prerender/SSG) confirmed (ADR-0003).
