# Module Spec: `buyer` — FR-5

- **Module id:** `buyer`
- **Traces to:** FR-5 (FR-5.1–FR-5.2), NFR-1, NFR-4, NFR-6
- **Depends on:** `identity` (account + role), `catalog` (saved properties), `booking` (inspections)
- **Consumed by:** `admin` (buyer/lead visibility); attribution from `consultant`.
- **Phase:** P2.

Buyer onboarding + dashboard. "Become a Buyer" captures investor intent and creates/links an
account; the dashboard aggregates saved properties, booked inspections, and inquiry/allocation
status — read models owned by `catalog`, `booking`, and `leads`.

---

## Specify

### Responsibilities
- **FR-5.1** "Become a Buyer" captures investor intent and creates/links an account.
- **FR-5.2** Dashboard: saved properties, booked inspections, inquiry/allocation status.

### Acceptance criteria
- `/become-buyer` collects investor intent (budget band, area of interest, timeframe, contact) and
  either creates a new account (→ `identity` register with role `buyer`) or links intent to the
  signed-in user. A source-tagged `Lead` (`source = buyer_form`) is created (leads FR-7.4).
- If arriving via a consultant referral (`?ref=CODE`), the buyer is attributed to that consultant
  (consultant FR-6.3) — code captured at this step.
- `/dashboard/buyer` shows four panels: **Saved properties** (from `catalog` favorites),
  **Inspections** (from `booking` `GET /inspections/me`), **Inquiries** (status from `leads`), and
  **Allocation** (stage from `GET /allocations/me`). Guarded by `<RequireRole "buyer">` (identity FR-4.3).
- Empty states are friendly and link back into the funnel (browse / book / contact).

### `allocation status` — locked (Q4: simple tracker)

The buyer dashboard shows both **inquiry status** (`new|contacted|closed` from `leads`) and an
**allocation tracker** per property the buyer is progressing on. Allocation is **admin-driven**
(closing is offline per Q2), staged:

`reserved → allocated → documented`

- `reserved` — buyer committed / plot held (set by admin after offline agreement).
- `allocated` — a specific plot/unit assigned.
- `documented` — buyer's documentation (survey, deed, C-of-O path) issued/handed over.

Buyers **read** their allocation stage; admin **sets** it (see `admin` FR-8). No payment ledger at
MVP — money movement is offline (Q2); the P4 ledger adds payment stages later.

### Out of scope
- Online payment/allocation ledger (Q2/Q4 → P4); editing property data (admin).

---

## Plan

### Client
- **Route:** `/become-buyer` (`routes/become-buyer.tsx`) — react-hook-form + zod
  (`buyerIntentSchema`); captures `?ref` if present.
- **Dashboard:** `/dashboard/buyer` (`routes/dashboard/buyer/index.tsx`) composed of `SavedPanel`,
  `InspectionsPanel`, `InquiriesPanel`, `AllocationPanel`. Uses shadcn dashboard shell (`dashboard-01`).
- **Data hooks:** `useFavorites()` (catalog), `useMyInspections()` (booking), `useMyInquiries()`
  (leads), `useMyAllocations()` (this module). All authed; `React.lazy` the dashboard subtree (NFR-2).
- **Onboarding flow:** if signed out → Clerk sign-up prefilled with role `buyer`, then persist intent;
  if signed in → persist intent directly.
- **Analytics (NFR-6):** `buyer_onboarding_submitted` with `{ hasReferral }`.

### Server
- **`POST /buyer/intent`** — creates/links buyer intent, creates a `Lead` (`source=buyer_form`),
  records referral attribution if `ref` present (delegates to `consultant` attribution). Authed if a
  token is present; otherwise pairs with the subsequent registration.
- **`GET /allocations/me`** — `requireAuth()`; the buyer's allocations + current stage (admin writes
  the stage; see `admin`).
- **`GET /me/dashboard`** *(optional aggregator)* — convenience endpoint returning
  `{ favorites, inspections, inquiries, allocations }` for the buyer, or the client composes from the
  existing endpoints. Prefer composing client-side to keep modules decoupled.

### Data
`Allocation` (owned here as the read model; **written by `admin`**): `id`, `buyer_user_id`,
`property_id`, `stage` (`reserved|allocated|documented`), `notes?`, `updated_at`.
Other reads: `Favorite` (catalog), `Inspection` (booking), `Lead` (leads). Buyer intent is stored as
a `Lead` (+ optional structured fields) at MVP.

### Shared schemas (`src/lib/schemas/buyer.ts`)
`buyerIntentSchema = { name, contact, budgetBand, areaOfInterest, timeframe, ref?: string }`.

### Key decisions
- The dashboard is a **composition of other modules' read endpoints** — `buyer` owns layout + intent,
  not new source-of-truth data (keeps dependency arrows one-way).
- Referral capture happens at onboarding, the earliest reliable attribution point.

---

## Tasks

1. Build `/become-buyer` form + `buyerIntentSchema`; capture `?ref`. → FR-5.1
2. Implement `POST /buyer/intent` (lead + referral attribution hook). → FR-5.1, FR-6.3
3. Wire sign-up-with-role-buyer flow for signed-out submitters. → FR-5.1, FR-4.2
4. Build `/dashboard/buyer` shell with `<RequireRole "buyer">`. → FR-5.2, FR-4.3
5. Build `SavedPanel` (favorites), `InspectionsPanel`, `InquiriesPanel` with empty states. → FR-5.2
6. Add Drizzle `allocations` table + migration; implement `GET /allocations/me`; build
   `AllocationPanel` (`reserved → allocated → documented` stage). **Ask-first: schema change.** → FR-5.2
7. Fire onboarding analytics. → NFR-6
8. Responsive pass for onboarding + dashboard 360–1920. → NFR-1
9. Tests per FR (below).

---

## Tests

- **Unit:** `buyerIntentSchema`; referral-code capture from query; dashboard panel empty-state logic.
- **Integration:** `POST /buyer/intent` creates a `buyer_form` lead and records referral when `ref`
  present; dashboard read endpoints (incl. `GET /allocations/me`) require auth (401 otherwise) and
  return only the caller's data.
- **E2E:** become-buyer (signed out) → account created as `buyer` → lands on dashboard; saved
  property + booked inspection appear in the right panels; an admin-set allocation stage shows in the
  allocation panel; referral link attributes the buyer; **responsive 360–1920 for onboarding +
  dashboard (NFR-1)**.
- **Coverage target:** 85%; auth-scoping of dashboard reads 100%.
