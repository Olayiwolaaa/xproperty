# ADR-0002: Backend framework and ORM — Express + Drizzle

- **Status:** Accepted
- **Date:** 2026-08-30
- **Resolves:** Open Question Q6

## Context

The API service (ADR-0001) needs an HTTP framework and an ORM. The spec offered Express or Fastify,
and Prisma or Drizzle. PostgreSQL is fixed as the datastore.

## Decision

- **HTTP framework: Express** (latest stable). Largest ecosystem, first-class `@clerk/express`
  middleware for token verification, abundant middleware for rate limiting and validation.
- **ORM: Drizzle** (+ `drizzle-kit` for migrations). SQL-first, fully typed, lightweight runtime,
  migrations are plain SQL checked into `server/src/db/`.

## Consequences

**Positive**
- `@clerk/express` `requireAuth()` drops straight into Express routes (matches spec code style).
- Drizzle's typed query builder pairs cleanly with shared zod schemas; no heavy client/engine.
- Migrations are readable SQL, easy to review in PRs.

**Negative / mitigations**
- Express is unopinionated → enforce structure via `server/src/routes/` + a standard middleware
  chain (auth → validate → handler → error).
- Drizzle has a smaller community than Prisma → pin versions, keep a `db/README` with conventions.

## Alternatives considered

- **Fastify** — faster, schema-first, but Express + Clerk integration is the better-trodden path for
  this MVP.
- **Prisma** — richer tooling and migration ergonomics, but heavier runtime/engine and less direct
  control over SQL than Drizzle.

## Conventions

- Schema in `server/src/db/schema.ts`; generate with `npx drizzle-kit generate`, apply with
  `npx drizzle-kit migrate`. Migrations committed to the repo (Boundaries: keep migrations in repo).
- One Drizzle client instance in `server/src/lib/db.ts`.
- Every mutating endpoint: `requireAuth()` (where protected) → zod `.parse(req.body)` → Drizzle call.
