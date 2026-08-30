# Module Spec: `identity` — FR-4

- **Module id:** `identity`
- **Traces to:** FR-4 (FR-4.1–FR-4.4), NFR-4, NFR-5
- **Depends on:** — (none; built first, in parallel with `marketing`)
- **Consumed by:** `catalog` (favorites), `buyer`, `consultant`, `admin`, `booking`
- **Phase:** P2 (auth), but specified first because every authenticated module depends on it.

Authentication, roles, sessions, and profile. Clerk owns credentials and sessions; this module owns
role assignment, the client/server auth boundary, route guards, and role-based post-login routing.

---

## Specify

### Responsibilities
- Register, login, logout, password reset, email verification — all Clerk-managed (**FR-4.1**).
- Assign a role at registration: `buyer` or `consultant`. `admin` is assigned internally only,
  never self-selected (**FR-4.2**).
- Post-login, route the user to their role-appropriate dashboard; enforce authorization on protected
  routes via **client route guards (UX)** + **API token verification (authoritative)** (**FR-4.3**).
- Editable profile: contact details + password (password via Clerk) (**FR-4.4**).

### Role model (source of truth)
Role lives in the **Clerk user's `publicMetadata.role`** and is mirrored to the `User` row on first
API call. The API reads role from the verified Clerk token/claims, never from the request body.
Roles: `buyer | consultant | admin`. Changing the role model is an **Ask-first** boundary.

### Acceptance criteria
- A visitor can register, verify email, log in, reset password, and log out (Clerk flows).
- On registration the user picks buyer or consultant; the choice is persisted to `publicMetadata.role`.
- After login, `buyer` → `/dashboard/buyer`, `consultant` → `/dashboard/consultant`,
  `admin` → `/dashboard/admin`.
- Hitting a protected route while signed out redirects to `/users?mode=login` (client guard).
- A protected API endpoint rejects a missing/invalid token with `401`, and a valid token with the
  wrong role with `403` — regardless of client state (**NFR-4**).
- Profile edits to name/phone persist; password change routed through Clerk.

### Out of scope
- Self-service admin elevation, org/team accounts, SSO/social beyond Clerk defaults (revisit later).

---

## Plan

### Client
- **Providers** (`src/main.tsx`): `<ClerkProvider>` wraps the app; publishable key from env.
- **Auth pages** (`/users?mode=register|login`): Clerk `<SignUp>` / `<SignIn>` components. Register
  screen adds a role selector (buyer/consultant) written to `unsafeMetadata.role` at sign-up, promoted
  to `publicMetadata.role` by a server webhook/first-call sync.
- **Route guards** (`src/hooks/use-require-role.ts` + `<RequireAuth>` / `<RequireRole>` wrappers):
  read `useAuth()`/`useUser()`; redirect unauthenticated users to login, wrong-role users to their
  own dashboard. Guards are **UX only** — the API re-checks.
- **Post-login routing** (`src/routes/dashboard/index.tsx`): read role, `<Navigate>` to the correct
  subtree.
- **API client** (`src/api/client.ts`): every request calls `getToken()` and sends
  `Authorization: Bearer <token>`.
- **Profile** (`/dashboard/*/profile`): react-hook-form + zod for name/phone → `PATCH /me`; password
  via Clerk `<UserProfile>`.

### Server
- **Middleware:** `clerkMiddleware()` app-wide; `requireAuth()` on protected routers.
  `requireRole(role)` middleware reads `req.auth.sessionClaims.publicMetadata.role`.
- **`GET /me`** — returns the mirrored `User` row (creates it on first call from token claims).
- **`PATCH /me`** — zod-validated name/phone update (email/role immutable here).
- **Clerk webhook** `POST /webhooks/clerk` — on `user.created`/`user.updated`, upsert the `User` row
  and promote `unsafeMetadata.role` → `publicMetadata.role` (buyer/consultant only; ignore/deny admin).

### Data (owned here)
`User`: `id` (Clerk user id), `name`, `email`, `phone`, `role`, `verified`, `created_at`.
(No local `password_hash` — Clerk owns credentials; column kept nullable/omitted per ADR note.)

### Shared schemas (`src/lib/schemas/user.ts`)
`roleSchema = z.enum(["buyer","consultant","admin"])`; `profileUpdateSchema = { name, phone }`.

### Key decisions
- Role is authoritative in Clerk claims, mirrored to DB for joins/reporting.
- `admin` is never assignable from the client; only set via Clerk dashboard or an admin-only endpoint.

---

## Tasks

1. Add `@clerk/clerk-react` (client) + `@clerk/express` (server); wire `ClerkProvider` and
   `clerkMiddleware` — **Ask-first: adding dependencies.** → FR-4.1
2. Build `/users` route with mode-switch (register/login) using Clerk components. → FR-4.1
3. Add role selector on register; write `unsafeMetadata.role`. → FR-4.2
4. Implement Clerk webhook to upsert `User` + promote role to `publicMetadata`. → FR-4.2
5. Implement `requireAuth()` + `requireRole()` server middleware. → FR-4.3, NFR-4
6. Implement `GET /me` (create-on-first-call) and `PATCH /me`. → FR-4.4
7. Build client `<RequireAuth>`/`<RequireRole>` guards + role-based post-login redirect. → FR-4.3
8. Build profile edit form (name/phone) + Clerk password/`UserProfile`. → FR-4.4
9. Add Drizzle `users` table + migration. **Ask-first: schema change.** → data model
10. Tests per FR (below).

---

## Tests

- **Unit:** `roleSchema`/`profileUpdateSchema` accept/reject cases; role-redirect helper maps role →
  dashboard path.
- **Integration:** `GET /me` creates a row on first authenticated call; `PATCH /me` validates + persists;
  protected endpoint returns `401` (no token), `403` (wrong role), `200` (correct role); webhook upserts
  user and never sets `admin` from client metadata.
- **E2E:** register (buyer) → verify → login → lands on `/dashboard/buyer`; signed-out visit to
  `/dashboard/*` redirects to login; responsive check of auth pages at 360/768/1024/1440/1920 (NFR-1).
- **Coverage target:** 90% of guard + middleware logic (auth boundary is security-critical).
