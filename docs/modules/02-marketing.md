# Module Spec: `marketing` — FR-1

- **Module id:** `marketing`
- **Traces to:** FR-1 (FR-1.1–FR-1.5), NFR-1, NFR-2, NFR-3, NFR-5, NFR-6
- **Depends on:** — (none; built first, in parallel with `identity`)
- **Consumed by:** `admin` (manages content blocks); links out to `catalog`, `leads`.
- **Phase:** P1.

Public content pages and the global chrome: home (hero, trust, vision/mission, values, testimonials,
carousel), about, privacy, terms, and the site-wide footer. Content is managed (from `ContentBlock`),
not hardcoded.

---

## Specify

### Responsibilities
- **FR-1.1** Home: hero with primary CTAs ("Learn More", "Get Started"), trust section, vision/mission,
  core-values grid.
- **FR-1.2** "Why choose us" carousel: auto-advances every 8s, drag-to-slide + arrow nav, pagination
  indicator (e.g. `1/6`). Keyboard-navigable and pausable (**NFR-5**).
- **FR-1.3** Testimonials (quote, name, role) sourced from a managed collection (`ContentBlock` type
  `testimonial`), not hardcoded.
- **FR-1.4** About, Privacy, Terms render static managed content (`ContentBlock` type `page`).
- **FR-1.5** Global footer: quick links, office address, phone, email, social links.

### Acceptance criteria
- Home renders all FR-1.1 sections from managed content; empty/missing content degrades gracefully.
- Carousel auto-advances every 8s, pauses on hover/focus, supports arrows + drag, shows `n/total`,
  and is fully operable by keyboard (**NFR-5**).
- Testimonials + carousel slides + page content come from the API, editable later by `admin`.
- Footer appears on every route with correct contact + social links; tel/mailto handled by `leads`.
- All marketing pages carry per-page metadata and are prerendered (**NFR-3**), responsive 360–1920 (**NFR-1**).

### Out of scope
- Editing content (that's `admin` FR-8.2); lead form submission logic (that's `leads` FR-7).

---

## Plan

### Client
- **Routes:** `/` (`routes/home.tsx`), `/about`, `/privacy`, `/terms`. All prerendered via
  `vite-react-ssg` (ADR-0003); each sets `<Helmet>` title/description/canonical/OG.
- **Layout:** `components/Layout.tsx` wraps every route with `<Navbar>` + `<Footer>` (FR-1.5).
- **Home sections:** `Hero`, `TrustSection`, `VisionMission`, `CoreValuesGrid`, `WhyChooseCarousel`,
  `Testimonials` — each a component in `components/marketing/`, fed by TanStack Query hooks.
- **Carousel:** reuse the shadcn `carousel` primitive (Embla). Config: `autoplay 8s`, `dragFree`,
  arrow buttons, `selectedIndex/total` badge, `stopOnInteraction` + pause on hover/focus (NFR-5).
- **Data hooks:** `useContentBlocks(type)` → `GET /content?type=...&published=true`.
- **Analytics (NFR-6):** hero CTAs fire `cta_click` events with a `cta` label for attribution.

### Server
- **`GET /content`** — public, returns published `ContentBlock`s filtered by `type`, ordered by
  `order`. Read-only here; writes are `admin`.
- Types served: `testimonial`, `value`, `carousel`, `page` (about/privacy/terms payloads).

### Data (read-only here; owned by `admin`)
`ContentBlock`: `id`, `type` (`testimonial|value|carousel|page`), `payload` (JSON), `order`,
`published`.

### SEO (NFR-3)
Marketing routes are the primary prerender target. Each supplies static-safe metadata; content is
fetched at build time for prerender and at runtime for freshness.

### Key decisions
- Content is data-driven from day one (even before `admin` UI exists) so nothing is hardcoded —
  seed `ContentBlock`s via a migration/seed script.

---

## Tasks

1. Build `Layout` with `Navbar` + `Footer` (FR-1.5); wire into the route table. → FR-1.5
2. Implement `GET /content` (published, by type, ordered) + Drizzle `content_blocks` table + seed.
   **Ask-first: schema change.** → FR-1.3/1.4, data model
3. Build `useContentBlocks` query hook + typed API wrapper. → FR-1.3/1.4
4. Build home sections: Hero+CTAs, Trust, Vision/Mission, Core-Values grid. → FR-1.1
5. Build `WhyChooseCarousel` on shadcn carousel: 8s autoplay, drag, arrows, `n/total`, keyboard +
   pause. → FR-1.2, NFR-5
6. Build Testimonials from managed collection. → FR-1.3
7. Build `/about`, `/privacy`, `/terms` from `page` content blocks. → FR-1.4
8. Add `<Helmet>` metadata to each route; register routes for prerender + sitemap. → NFR-3
9. Fire `cta_click` analytics on hero CTAs. → NFR-6
10. Responsive pass 360–1920 on every page + carousel. → NFR-1
11. Tests per FR (below).

---

## Tests

- **Unit:** carousel index/pagination + autoplay-interval logic; `useContentBlocks` mapping;
  graceful-empty rendering when a content type returns `[]`.
- **Integration:** `GET /content` returns only `published`, correct `type`, correct `order`.
- **E2E:** home renders all FR-1.1 sections; carousel auto-advances, pauses on hover, arrows +
  keyboard work, shows `n/total`; footer present on every route; **responsive at
  360/768/1024/1440/1920 with no horizontal scroll (NFR-1)**; built HTML for `/` contains expected
  title + meta description (NFR-3 guard).
- **Coverage target:** 80% of marketing components; 100% of carousel interaction logic.
