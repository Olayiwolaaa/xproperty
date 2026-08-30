# Module Spec: `consultant` — FR-6

- **Module id:** `consultant`
- **Traces to:** FR-6 (FR-6.1–FR-6.3), NFR-4, NFR-6
- **Depends on:** `identity` (account + role `consultant`)
- **Consumed by:** `buyer` (referral attribution at onboarding), `admin` (approve/reject FR-8.3),
  `leads` (`source = consultant`)
- **Phase:** P3.

Consultant application → admin approval → unique referral code → attribution of referred
buyers/sales, with referral + commission status tracking.

---

## Specify

### Responsibilities
- **FR-6.1** "Become a Consultant" application; admin approves or rejects.
- **FR-6.2** Approved consultants get a unique referral link/code.
- **FR-6.3** Attribute referred buyers/sales to a consultant; track referral + commission status.

### Acceptance criteria
- `/become-consultant` submits an application (contact + relevant details) → `Consultant` row with
  `approval_status = pending`; a `Lead` (`source = consultant`) is created (leads FR-7.4).
- `/for-agents` explains the program and links to apply / portal entry.
- On admin approval, the consultant is assigned role `consultant` and issued a **unique
  `referral_code`** + shareable link (`/become-buyer?ref=CODE` / `/properties?ref=CODE`).
- A buyer registering via `?ref=CODE` creates a `Referral` attributing them to that consultant
  (buyer FR-5.1 hook), with a trackable `status`.
- `/dashboard/consultant` shows the referral link, referred users, and referral/commission status.
- Rejected applications are recorded with reason; applicant notified.

### `commission` — locked (Q1: commission-based)

The consultant model **pays commission**. Each `Referral` carries a `commission_rate` (%), a
computed `commission_amount`, and a `commission_status` (`pending → earned → paid`). At MVP the
platform **tracks** commission — rate + amount + status are visible to the consultant and managed by
admin — while **payout processing / finance integration stays P4** (offline settlement for now,
consistent with Q2's offline-closing model).

- `commission_rate` defaults from `Consultant.commission_terms`, overridable per referral by admin.
- `commission_amount` is derived when a referral converts (sale value × rate); recorded, not paid.
- `commission_status` transitions are admin-driven: `pending` (attributed) → `earned` (sale closed)
  → `paid` (settled offline, marked by admin).

> No payment rail at MVP — commission is recorded + tracked; actual disbursement is manual/offline
> until the P4 payout ledger.

### Out of scope
- Payout processing/finance integration (P4); multi-tier referral chains (post-MVP).

---

## Plan

### Client
- **Routes:** `/become-consultant` (`ConsultantApplicationForm`, react-hook-form + zod),
  `/for-agents` (program info + CTA), `/dashboard/consultant` (`<RequireRole "consultant">`).
- **Dashboard:** `ReferralLinkCard` (copy link + code), `ReferralsTable` (referred users + status),
  `CommissionPanel` (per-referral rate, amount, and `pending/earned/paid` status; read-only for the
  consultant, admin-managed).
- **Data hooks:** `useApplyConsultant()`, `useMyReferrals()`, `useMyReferralCode()`.
- **Analytics (NFR-6):** `consultant_application_submitted`, `referral_link_copied`.

### Server
- **`POST /consultants/apply`** — public/authed; creates `Consultant` (`pending`) + `consultant`
  lead; rate-limited, zod-validated.
- **`GET /consultants/me`** — `requireRole("consultant")`; own profile, code, referrals.
- **`GET /referrals/me`** — `requireRole("consultant")`; own referrals + status.
- **`POST /referrals`** — internal, called by `buyer` onboarding when `ref` present: resolves code →
  consultant, creates `Referral` (idempotent per referred user).
- Approval endpoints live in `admin` (`PATCH /consultants/:id` → sets status + role + issues code).

### Data
`Consultant`: `id (→User)`, `referral_code` (unique, issued on approval), `approval_status`
(`pending|approved|rejected`), `commission_terms`, `rejection_reason?`.
`Referral`: `id`, `consultant_id`, `referred_user_id`, `property_id?`, `status`
(`pending|converted|closed`), `commission_rate`, `commission_amount?`, `commission_status`
(`pending|earned|paid`).

### Shared schemas (`src/lib/schemas/consultant.ts`)
`consultantApplicationSchema`, `referralCodeSchema`, `referralStatusSchema`.

### Key decisions
- `referral_code` is issued **only on approval** (no code for pending/rejected).
- Referral creation is idempotent per referred user — a buyer is attributed to at most one consultant
  (first valid `ref` wins), avoiding double-attribution disputes.
- Commission is recorded + tracked at MVP (rate/amount/status per referral); payout disbursement is
  offline/manual until the P4 ledger.

---

## Tasks

1. Add Drizzle `consultants` + `referrals` tables + migration. **Ask-first: schema change.** → data model
2. Implement `POST /consultants/apply` (+ consultant lead, rate-limit). → FR-6.1
3. Build `/become-consultant` + `/for-agents`. → FR-6.1
4. Implement referral code issuance on approval (admin hook) — unique code generator. → FR-6.2
5. Implement `POST /referrals` (code → consultant, idempotent) + call from buyer onboarding. → FR-6.3
6. Implement `GET /consultants/me` + `GET /referrals/me`. → FR-6.3
7. Build `/dashboard/consultant` (link card, referrals table, commission panel with rate/amount/status).
   → FR-6.2/6.3
8. Fire analytics events. → NFR-6
9. Responsive pass 360–1920. → NFR-1
10. Tests per FR (below).

---

## Tests

- **Unit:** referral-code uniqueness/generation; `?ref` resolution; commission amount derivation
  (sale × rate) + status transition guard (`pending→earned→paid`); application schema.
- **Integration:** apply creates `pending` consultant + lead; approval issues a unique code + sets
  role; `POST /referrals` attributes once (idempotent), rejects unknown/expired codes; consultant
  endpoints require `consultant` role (403 otherwise).
- **E2E:** apply → (admin) approve → get referral link → buyer registers via link → appears in
  consultant's referrals with status; **responsive 360–1920 (NFR-1)**.
- **Coverage target:** 85%; attribution + code issuance 100%.
