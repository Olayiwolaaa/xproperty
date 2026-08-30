# ADR-0003: SPA SEO via build-time prerender/SSG

- **Status:** Accepted
- **Date:** 2026-08-30
- **Resolves:** Open Question Q5; satisfies NFR-3

## Context

A client-rendered SPA (ADR-0001) ships an empty HTML shell and hydrates in the browser. Crawlers and
link unfurlers that don't execute JS see no content, and there are no per-page `<title>`/meta tags in
the initial HTML. NFR-3 requires per-page metadata, semantic markup, and a sitemap for listing
discoverability. Client rendering alone does not satisfy it.

Options weighed:
1. **Build-time prerender/SSG** — render public routes to static HTML during `vite build`.
2. **Runtime prerender service** — a proxy that renders JS for bot user-agents on request.
3. **Accept weaker SEO for MVP** — ship client-only, revisit later.

## Decision

**Build-time prerender/SSG for public routes**, using `vite-react-ssg` (Vite-native SSG that reuses
the React Router route table) together with `react-helmet-async` for per-page `<head>` tags and a
build step that emits `sitemap.xml` + `robots.txt`.

Prerendered (public) routes: `/`, `/about`, `/properties`, each property detail
(`/properties/:slug`), `/become-buyer`, `/become-consultant`, `/for-agents`, `/contact`, `/privacy`,
`/terms`. Authenticated `/dashboard/*` routes stay client-only (no SEO value, auth-gated).

The property detail list for prerendering is produced at build time by fetching published properties
from the API (or a build-time data export), so each listing gets its own crawlable URL + metadata.

## Consequences

**Positive**
- Public pages ship real HTML + correct meta tags in the initial response → satisfies NFR-3.
- No runtime prerender infrastructure or per-request bot detection to operate.
- Static output deploys to any CDN/static host (matches ADR-0001 deploy target).

**Negative / mitigations**
- Property content is only as fresh as the last build → trigger a rebuild on publish/CRUD via an
  admin webhook (deferred to `admin`/deploy phase; interim: scheduled daily rebuild).
- Build reads from the API → build pipeline needs read access + a stable prerender data endpoint.
- SSG adds build complexity → keep dynamic/auth pages client-only to limit prerender surface.

## Alternatives considered

- **Runtime prerender service** — always-fresh content, but adds infra + bot-detection fragility.
- **Accept weaker SEO** — rejected; NFR-3 is a stated success criterion.

## Implementation notes

- `react-helmet-async` `<HelmetProvider>` at the app root; each public route sets `<title>` +
  `<meta>` (description, canonical, OpenGraph) with real listing data.
- Sitemap generated in a `postbuild` step from the same route/property list used for prerender.
- Verify in CI that built HTML for `/` and a sample `/properties/:slug` contains the expected
  `<title>` and meta description (guards against regressions).
