# Module Spec: `booking` — FR-3

- **Module id:** `booking`
- **Traces to:** FR-3 (FR-3.1–FR-3.3), NFR-1, NFR-4, NFR-6
- **Depends on:** `catalog` (booking targets a property), `leads` (a booking also creates a lead)
- **Consumed by:** `buyer` (dashboard shows booked inspections FR-5.2), `admin` (manage bookings FR-8.3)
- **Phase:** P2.

Inspection/appointment scheduling tied to a property. A visitor can request an inspection **without
an account** (core funnel promise); authenticated buyers see their bookings in-dashboard. Staff
confirm/reschedule/cancel.

---

## Specify

### Responsibilities
- **FR-3.1** Select a property, choose a date/time slot, submit contact details.
- **FR-3.2** Confirm via email and/or WhatsApp; notify staff.
- **FR-3.3** Admin can see, reschedule, confirm, or cancel bookings.

### Acceptance criteria
- From a property (detail page or `/properties`), a user picks an available date/time and submits
  name + contact → an `Inspection` is created with status `requested`.
- Booking works **anonymously** (no auth required for the funnel); if the user is authenticated, the
  inspection links to their `user_id` so it appears in their dashboard (FR-5.2).
- On submit: requester gets an email/WhatsApp confirmation and staff are notified (FR-3.2); a
  source-tagged `Lead` (`source = booking`) is also created (leads FR-7.4).
- Admin can list, filter, and move an inspection through
  `requested → confirmed | cancelled`, and reschedule its `datetime` (FR-3.3).
- Slot selection prevents obviously invalid choices (past times; outside business hours).

### Out of scope
- Payment/deposit to hold a slot (P4); calendar-provider sync (post-MVP).

---

## Plan

### Client
- **Component:** `BookingDialog` (shadcn `dialog` + `calendar` + time-slot `select`), launched from
  `PropertyCard`/detail. react-hook-form + zod (`inspectionSchema`).
- **Anonymous path:** collects name + contact inline. **Authed path:** prefills from `GET /me`, omits
  contact re-entry, attaches token so the inspection links to the user.
- **Data hooks:** `useCreateInspection()` (public), `useMyInspections()` (authed, for buyer
  dashboard), and admin hooks (see `admin`).
- **Confirmation UX:** success state offers an immediate WhatsApp deep link (reuses `leads`
  `buildWhatsAppUrl`) as a fast fallback to human contact.
- **Analytics (NFR-6):** `inspection_requested` event with `{ propertyId, authed }`.

### Server
- **`POST /inspections`** — public, **rate-limited**, zod-validated. Creates `Inspection`
  (`status=requested`), links `user_id` if a valid token is present, creates a `Lead`
  (`source=booking`, links property), sends requester confirmation + staff notify (leads
  `notify.ts`). Validates slot (not in the past, within business hours).
- **`GET /inspections/me`** — `requireAuth()`; current user's inspections (for `buyer`).
- **`GET /inspections`** — `requireRole("admin")`; list/filter all (for `admin`).
- **`PATCH /inspections/:id`** — `requireRole("admin")`; reschedule `datetime` and/or transition
  `status` (state machine below).

### State machine
`requested → confirmed`, `requested → cancelled`, `confirmed → cancelled`,
`confirmed → confirmed` (reschedule). No transition out of `cancelled`. Enforced server-side.

### Data
`Inspection`: `id`, `user_id?` (nullable for anonymous), `property_id`, `datetime`,
`contact_name`, `contact`, `status` (`requested|confirmed|cancelled`), `created_at`.

### Shared schemas (`src/lib/schemas/inspection.ts`)
`inspectionSchema = { propertyId, datetime, name, contact }`;
`inspectionStatusSchema = z.enum(["requested","confirmed","cancelled"])`.

### Key decisions
- Anonymous booking is intentional — it is the primary funnel conversion; auth only *enriches* it.
- Booking always spawns a source-tagged lead so nothing falls out of the funnel (leads FR-7.4).
- Admin owns all state transitions; buyers/visitors can only create.

---

## Tasks

1. Add Drizzle `inspections` table + migration. **Ask-first: schema change.** → data model
2. Implement `POST /inspections` (validate slot, link user if authed, spawn lead, notify,
   rate-limit). → FR-3.1, FR-3.2, NFR-4
3. Implement `GET /inspections/me` (authed). → FR-5.2 support
4. Implement admin `GET /inspections` + `PATCH /inspections/:id` with state machine. → FR-3.3
5. Build `BookingDialog` (calendar + slots) with anon + authed paths. → FR-3.1
6. Build success/confirmation state with WhatsApp fallback link. → FR-3.2
7. Fire `inspection_requested` analytics. → NFR-6
8. Responsive pass for dialog/calendar 360–1920 (mobile date/time UX). → NFR-1
9. Tests per FR (below).

---

## Tests

- **Unit:** slot validation (past/out-of-hours rejected); state-machine transition guard; `inspectionSchema`.
- **Integration:** `POST /inspections` creates inspection + linked lead + notify (mock); links
  `user_id` only with a valid token; `PATCH` enforces allowed transitions (invalid → 409/422);
  admin endpoints require `admin` role (403 otherwise).
- **E2E:** anonymous browse → book inspection → confirmation (no account) — the headline funnel;
  authed booking appears in buyer dashboard; admin reschedules + confirms; **responsive 360–1920 for
  the booking dialog (NFR-1)**.
- **Coverage target:** 90% of state machine + slot validation; ≥1 test per FR-3.x.
