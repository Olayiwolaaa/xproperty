# XProperty

Trust-first real estate platform for well-documented estates. A **React SPA** (`client/`) talks to a
**separate Express + Drizzle REST API** (`server/`). Two deployables, one monorepo.

See [`docs/spec.md`](docs/spec.md) for the full spec, [`docs/adr/`](docs/adr) for architecture
decisions, and [`docs/modules/`](docs/modules) for per-module specs.

## Layout

```
client/     React SPA (Vite + React 19 + TS + Tailwind + shadcn/ui). The public site + dashboards.
server/     Express REST API (Drizzle ORM + PostgreSQL). Owns all DB access, auth, notifications.
tests/      Vitest unit + integration tests.
e2e/        Playwright end-to-end + responsive (360→1920) tests.
docs/       Spec, ADRs, module specs.
```

> `client/` is the app formerly at the repo root (promoted in place). Its `package.json` still reads
> `"name": "my-app"` — rename when convenient.

## Prerequisites

- Node.js (active LTS)
- Docker + Docker Compose (runs PostgreSQL 18 locally — see `docker-compose.yml`)
- A Clerk application (publishable + secret keys) — needed at P2 for auth
- A Cloudinary account (media storage, ADR-0004) — needed at P3 for admin image uploads

## Setup

```bash
npm install                 # installs client + server workspaces
docker compose up -d db     # start PostgreSQL 18 (or: npm run db:up)
cp server/.env.example server/.env   # DATABASE_URL matches the compose service; set CLERK_SECRET_KEY
cp client/.env.example client/.env   # fill in VITE_CLERK_PUBLISHABLE_KEY + VITE_API_URL
npm run db:generate         # generate Drizzle migration from schema
npm run migrate             # apply migrations to the database
npm run db:seed             # optional: seed a sample listing + content
```

## Develop

```bash
npm run dev        # client (Vite dev server)
npm run dev:api    # server (Express, watch mode) — run in a second terminal
```

## Build / test

```bash
npm run build      # client (tsc + vite) then server (tsc)
npm test           # vitest unit + integration
npm run e2e        # playwright (incl. responsive breakpoints — NFR-1)
npm run lint       # eslint (client)
```

## Dependencies still to add (Ask-first per spec Boundaries)

The client already ships React 19.2, React Router 7, Tailwind, shadcn/ui, react-hook-form, zod 4,
and Embla. Before P1/P2 implementation, add (client):

- `@clerk/clerk-react` — auth UI + client session/token (identity, P2)
- `@tanstack/react-query` — server-state fetching against the API
- `react-helmet-async` — per-page `<head>` metadata (NFR-3)
- `vite-react-ssg` — build-time prerender/SSG for public routes (ADR-0003, NFR-3)

Server deps are declared in `server/package.json`.

## Notes

- **Version pins:** dependency versions in the manifests are Aug-2026 stable *targets*; the exact
  versions are pinned by the lockfile at `npm install` time (spec dependency policy).
- **RBAC is server-side.** Client route guards are UX only; every protected endpoint re-verifies the
  Clerk token and role. Never call the database from the browser.
- **This monorepo was scaffolded without running package managers** (sandbox constraint). Run
  `npm install` locally to generate `node_modules` + the lockfile before first `dev`/`build`.
