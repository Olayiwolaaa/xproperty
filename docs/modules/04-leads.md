# Module Spec: `leads` — FR-7

- **Module id:** `leads`
- **Traces to:** FR-7 (FR-7.1–FR-7.4), NFR-4, NFR-6, NFR-7
- **Depends on:** `catalog` (optional — an inquiry may link a property)
- **Consumed by:** `booking` (a booking creates a lead), `consultant` (referral-sourced leads),
  `admin` (lead console FR-8.3), `buyer` (inquiry status FR-5.2).
- **Phase:** P1.

Capture qualified contact fast and route people to a human. Two halves: **persisted inquiry forms**
(server-side, notify staff) and **direct-contact deep links** (WhatsApp/tel/mailto). Every captured
lead is source-tagged for attribution (NFR-6).

---

## Specify

### Responsibilities
- **FR-7.1** Contact/inquiry forms persist submissions and notify staff.
- **FR-7.2** WhatsApp deep links ("Speak with our team" + a floating widget with multiple numbers)
  via `wa.me`.
- **FR-7.3** Click-to-call (`tel:`) and email (`mailto:`) links.
- **FR-7.4** Tag each lead with its source (buyer form, consultant, WhatsApp, contact page, property
  inquiry, booking).

### Acceptance criteria
- `/contact` form (name, contact, message) persists a `Lead` and triggers a staff notification.
- A property detail "Inquire" form persists a `Lead` linked to that `property_id`.
- Floating WhatsApp widget shows one or more numbers, opens `https://wa.me/<intl-number>?text=...`
  with a prefilled message; visible on public pages, mobile-first placement (NFR-1).
- `tel:` and `mailto:` links present in footer/contact and are click-to-act.
- Every persisted lead records a `source` value from a fixed enum (FR-7.4); analytics event fires
  with the same source (NFR-6).
- Public form endpoints are zod-validated and **rate-limited** (NFR-4).

### `source` enum
`buyer_form | consultant | whatsapp | contact_page | property_inquiry | booking`.
(WhatsApp/tel/mailto clicks are attribution **events**; persisted leads come from forms + booking.)

### Out of scope
- Lead management UI (that's `admin` FR-8.3); booking scheduling (that's `booking` FR-3, which
  *creates* a lead here).

---

## Plan

### Client
- **Routes/components:** `/contact` (`routes/contact.tsx` + `ContactForm`), `InquiryForm` (embedded
  on property detail), `WhatsAppWidget` (floating, all pages), `ContactLinks` (tel/mailto in footer).
- **Forms:** react-hook-form + zod (`leadSchema`); on submit → `POST /leads` with `source`.
- **WhatsApp:** `buildWhatsAppUrl(number, message)` in `src/lib/whatsapp.ts` → `wa.me` intl format,
  URL-encoded prefilled text (may include property title when launched from a listing).
- **Analytics (NFR-6):** every WhatsApp/tel/mailto click and every form submit fires a
  `lead_contact` event carrying `{ source, propertyId? }`.

### Server
- **`POST /leads`** — public, **rate-limited**, zod-validated; persists `Lead` with `source` (+
  optional `property_id`), then fires a staff notification (email/WhatsApp adapter in
  `server/src/lib/notify.ts`). Returns `201`.
- Notification adapter is pluggable (email at MVP; WhatsApp Business optional later).

### Data
`Lead`/`Inquiry`: `id`, `name`, `contact`, `message`, `source`, `property_id?`, `status`
(`new|contacted|closed`), `created_at`.

### Shared schemas (`src/lib/schemas/lead.ts`)
`leadSchema = { name, contact, message, source: sourceEnum, propertyId?: string }`.

### Key decisions
- WhatsApp/tel/mailto are **client-only deep links** (no server round-trip) — fastest path to a
  human, works offline-ish on mobile. Only forms + bookings persist a row.
- Source is required on every persisted lead — powers FR-7.4 + NFR-6 attribution.

---

## Tasks

1. Add Drizzle `leads` table + migration. **Ask-first: schema change.** → data model
2. Implement `POST /leads` (zod + rate-limit + notify). → FR-7.1, NFR-4
3. Build notification adapter (`notify.ts`, email at MVP). → FR-7.1
4. Build `ContactForm` + `/contact` page. → FR-7.1
5. Build `InquiryForm` for property detail (links `property_id`). → FR-7.1/7.4
6. Build `buildWhatsAppUrl` + `WhatsAppWidget` (floating, multi-number). → FR-7.2
7. Add `tel:`/`mailto:` `ContactLinks` to footer/contact. → FR-7.3
8. Wire `source` tagging on every entry point + `lead_contact` analytics. → FR-7.4, NFR-6
9. Responsive/mobile placement pass for widget + forms 360–1920. → NFR-1
10. Tests per FR (below).

---

## Tests

- **Unit:** `buildWhatsAppUrl` formats intl number + encodes message; `leadSchema` accept/reject;
  source enum enforced.
- **Integration:** `POST /leads` validates, persists with correct `source`/`property_id`, triggers
  notify (mocked), and is rate-limited (429 past threshold); rejects malformed body (400).
- **E2E:** submit contact form → success + staff notify (mock); property inquiry links the property;
  WhatsApp widget opens correct `wa.me` URL with prefilled text; tel/mailto present; **responsive
  360–1920, widget reachable on mobile (NFR-1)**.
- **Coverage target:** 85%; validation + rate-limit paths 100%.
