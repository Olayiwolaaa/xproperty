# ADR-0001: Client-rendered React SPA + separate REST API

- **Status:** Accepted
- **Date:** 2026-08-30
- **Deciders:** Human reviewer + build team
- **Supersedes:** Earlier monolithic Next.js decision (App Router + RSC)

## Context

The original plan was a monolithic Next.js app where server components handled data access, auth
verification, and staff notifications in the same deployable as the UI. The revised architecture
splits this into a **client-rendered React SPA (Vite)** and a **separate Node/Express REST API**.

Drivers:
- Clear separation between presentation (browser) and the authoritative data/auth boundary (server).
- Independent deploy + scale: static SPA on a CDN, API as a Node service.
- Team familiarity with a plain REST API and a Vite SPA over Next.js RSC.

## Decision

Two deployables in one monorepo:

- **`client/`** — Vite + React 19 SPA. Runs only in the browser. Talks to the API through a typed
  fetch client that attaches the Clerk session token. **Never** touches the database.
- **`server/`** — Express REST API. Owns all database access (Drizzle/PostgreSQL), Clerk token
  verification, RBAC, and staff notifications.

## Consequences

**Positive**
- Enforceable trust boundary: RBAC and validation live server-side; client guards are UX only.
- Independent scaling and deploy cadence for UI vs. API.
- Simpler mental model than RSC for this team.

**Negative / mitigations**
- **No server-rendered HTML out of the box** → hurts SEO. Mitigated by ADR-0003 (build-time
  prerender/SSG for public routes).
- Two deploy targets and a CORS boundary to manage → documented in deploy runbook.
- Shared types/schemas must be kept in sync → share zod schemas across `client` and `server`.

## Alternatives considered

- **Keep Next.js (RSC).** Free SSR/SEO, but rejected for team fit and the desire for a clean
  API/UI split.
- **SPA calling serverless functions.** More moving parts than a single Express service at MVP.
