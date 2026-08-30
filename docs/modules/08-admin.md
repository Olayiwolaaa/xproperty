# Module Spec: `admin` — FR-8

- **Module id:** `admin`
- **Traces to:** FR-8 (FR-8.1–FR-8.4), NFR-4, NFR-1, NFR-7
- **Depends on:** all modules (it manages every other module's data)
- **Consumed by:** — (top of the stack)
- **Phase:** P3. Built last: every entity it CRUDs must exist first.

Staff console: CRUD for properties + documentation status, managed content, and visibility/management
of leads, inspections, and consultant applications, plus role/access management. All admin endpoints
are `requireRole("admin")` — the strictest server-side RBAC surface (NFR-4).

---

## Specify

### Responsibilities
- **FR-8.1** CRUD for properties and documentation status.
- **FR-8.2** Manage testimonials, carousel slides, content blocks (values, vision, mission).
- **FR-8.3** View/manage leads, inspections, and consultant applications.
- **FR-8.4** Role and access management.

### Acceptance criteria
- Admins create/edit/publish/unpublish/delete properties, including media and **documentation
  status** — a property cannot be published without a documentation-status label (Boundaries: Never).
- Admins CRUD `ContentBlock`s (testimonial/value/carousel/page) that drive `marketing`; changes flow
  to public pages (and trigger a prerender rebuild per ADR-0003).
- Admins list/filter leads (by source/status), inspections (by status), and consultant applications;
  update lead status, transition inspections (booking FR-3.3), approve/reject consultants (consultant
  FR-6.1/6.2 → issues referral code on approval).
- Admins assign/revoke roles (FR-8.4), including granting `admin` (the only place `admin` is set).
- Every admin endpoint rejects non-admins with `403` regardless of client state (NFR-4).

### Out of scope
- Finance/commission payout (P4); automated title verification (manual flag at MVP).

---

## Plan

### Client
- **Routes:** `/dashboard/admin/*` (`<RequireRole "admin">`) on the shadcn dashboard shell:
  `properties`, `content`, `leads`, `inspections`, `consultants`, `allocations`, `users`.
- **Components:** `PropertyEditor` (form + media + `DocumentationEditor`), `ContentBlockEditor`
  (per-type payload forms + ordering + publish toggle), data `table`s (shadcn) with filters for
  leads/inspections/consultants, `RoleManager`.
- **Data hooks:** admin-scoped queries/mutations per entity; optimistic updates + query invalidation.

### Server (all `requireRole("admin")`)
- **Properties:** `POST /admin/properties`, `PATCH /admin/properties/:id`,
  `DELETE /admin/properties/:id`, publish/unpublish. Reject publish without doc-status label.
- **Content:** `POST/PATCH/DELETE /admin/content` (+ reorder, publish). Triggers prerender rebuild
  webhook (ADR-0003).
- **Leads:** `GET /admin/leads` (filter), `PATCH /admin/leads/:id` (status).
- **Inspections:** `GET /admin/inspections`, `PATCH /admin/inspections/:id` (booking state machine).
- **Consultants:** `GET /admin/consultants`, `PATCH /admin/consultants/:id`
  (approve → set role + issue referral code / reject → reason).
- **Commission:** `PATCH /admin/referrals/:id` — set `commission_rate`, record `commission_amount`,
  advance `commission_status` (`pending → earned → paid`). Q1: commission-based; payout is offline.
- **Allocations:** `GET /admin/allocations`, `POST /admin/allocations`,
  `PATCH /admin/allocations/:id` — assign/advance a buyer's stage per property
  (`reserved → allocated → documented`). Q4 tracker; buyers read via `GET /allocations/me`.
- **Users/roles:** `GET /admin/users`, `PATCH /admin/users/:id/role` (writes Clerk
  `publicMetadata.role` + mirrors `User` row; only place `admin` can be granted).

### Data
No new primary entity — admin writes across `Property`, `ContentBlock`, `Lead`, `Inspection`,
`Consultant`, `Referral`, `Allocation`, `User`. Media uploads go to Cloudinary (ADR-0004); DB stores
the returned secure URLs.

### Key decisions
- Admin is the single **write authority** for properties/content; public + other modules read.
- Role grants (incl. `admin`) happen only here, server-side, then mirrored — matches identity's
  "admin never assignable from client" rule (FR-4.2).
- Publishing a property or content triggers a rebuild so prerendered pages stay correct (ADR-0003).

---

## Tasks

1. Confirm all upstream tables exist (properties/content/leads/inspections/consultants/users). → gate
2. Implement admin property CRUD + publish guard (no publish without doc status). → FR-8.1
3. Implement content CRUD + reorder + publish + rebuild webhook. → FR-8.2, NFR-3
4. Implement lead list/filter + status update. → FR-8.3
5. Implement inspection list + state transitions (reuse booking machine). → FR-8.3, FR-3.3
6. Implement consultant list + approve/reject (+ referral code issuance). → FR-8.3, FR-6.1/6.2
7. Implement commission management: `PATCH /admin/referrals/:id` (rate/amount, status
   `pending → earned → paid`). → FR-8.3, FR-6.3
8. Implement allocation management: allocations list/create + stage advance
   (`reserved → allocated → documented`). → FR-8.3, FR-5.2
9. Implement user/role management (only place `admin` is granted). → FR-8.4, FR-4.2
10. Build admin dashboard routes + editors + tables on shadcn shell. → FR-8.1–8.4
11. Responsive pass 360–1920 for editors + tables (dense UI on mobile). → NFR-1
12. Tests per FR (below).

---

## Tests

- **Unit:** publish-guard (blocks missing doc status); role-grant validation; content payload schemas.
- **Integration:** every `/admin/*` endpoint returns `403` for non-admin, `401` unauthenticated;
  property publish rejected without doc-status label; content change triggers rebuild webhook (mock);
  consultant approval issues a unique code + sets role; role grant writes Clerk metadata + mirror.
- **E2E:** admin creates + publishes a documented property → visible in `/properties`; edits a
  testimonial → appears on home; approves a consultant → referral code works; moves an inspection to
  confirmed; advances a buyer's allocation stage → buyer sees it in their dashboard; sets a referral's
  commission status → consultant sees it; **responsive 360–1920 for admin tables/editors (NFR-1)**.
- **Coverage target:** 90% of RBAC guards + publish/role invariants (highest-privilege surface).
