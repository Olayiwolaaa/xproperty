# Module Spec: `catalog` — FR-2

- **Module id:** `catalog`
- **Traces to:** FR-2 (FR-2.1–FR-2.4), NFR-1, NFR-2, NFR-3, NFR-5
- **Depends on:** `identity` (favorites are a protected action, FR-4.3)
- **Consumed by:** `booking` (inspection targets a property), `buyer` (saved properties), `leads`
  (inquiries can link a property), `admin` (property CRUD).
- **Phase:** P1 (browse/detail/filter public); favorites land with P2 once `identity` ships.

Property listings, detail pages, filter/sort, and favorites. The trust promise lives here: every
listing surfaces **documentation status**, and no listing ships without one (Boundaries: Never).

---

## Specify

### Responsibilities
- **FR-2.1** List properties with title, location, price/band, and documentation status.
- **FR-2.2** Detail page: media gallery, description, land-title/documentation flags, location.
- **FR-2.3** Filter/sort by location, price, and availability/status.
- **FR-2.4** Authenticated buyers can save/favorite a property.

### Domain note (divergence from reference project)
The reference `xproperty` app models US homes (`beds`/`baths`/`sqft`, `city`/`state`,
`PropertyType` = House/Condo/...). This platform targets **Nigerian estates/land plots**, so the
model centers on **location + documentation status + price band**, not bed/bath counts. Do not carry
over the US `Property` shape; use the model below.

### `documentation_status` (Q3 — locked)

Documentation is an **overall label** plus a set of named boolean **flags** (full Nigerian set):
- Overall label: `verified | in-progress | unverified`.
- Flags (boolean each): `survey` (Survey Plan), `deed` (Deed of Assignment),
  `c_of_o` (Certificate of Occupancy), `governors_consent` (Governor's Consent),
  `excision`, `gazette`.

The overall label is what buyers scan first; the flags give the itemized breakdown on the detail
page. A listing must always carry a non-null overall label (Boundaries: Never ship without doc
status). `verified` should reflect the underlying flags but is set explicitly by admin (manual
verification at MVP — no registry integration).

### Acceptance criteria
- `/properties` lists published properties with title, location, price/band, and doc-status badge.
- Filters: location (text/select), price (min/max band), availability/status; sort by price and
  recency; filter state is URL-encoded (shareable, prerender-friendly).
- Detail page `/properties/:slug`: gallery (lazy-loaded, NFR-2), description, per-flag documentation
  panel, location; per-page metadata + prerendered (NFR-3).
- Favorite toggle: visible to all, but the action requires auth — anonymous click routes to login;
  authenticated toggle persists and re-checks server-side (FR-2.4 / FR-4.3).
- No listing renders without an overall documentation label.

### Out of scope
- Creating/editing properties (that's `admin` FR-8.1); booking flow (that's `booking` FR-3).

---

## Plan

### Client
- **Routes:** `/properties` (`routes/properties.tsx`, list + filter bar) and `/properties/:slug`
  (`routes/property-detail.tsx`). Both prerendered (ADR-0003); detail pages enumerated at build time
  from published properties.
- **Components:** `PropertyCard` (doc-status `Badge`), `FilterBar` (location/price/status/sort,
  URL-synced via search params), `PropertyGallery` (lazy `loading="lazy"` + `AspectRatio`),
  `DocumentationPanel` (flag checklist + overall label), `FavoriteButton`.
- **Data hooks:** `useProperties(filters)` → `GET /properties?...`; `useProperty(slug)` →
  `GET /properties/:slug`; `useFavorites()` / `useSaveFavorite()` / `useRemoveFavorite()` (protected).
- **Favorites hook** follows the spec's canonical example: `getToken()` → `api.post("/favorites",…)`
  → invalidate `["favorites"]`; anonymous click redirects to `/users?mode=login`.
- **Perf (NFR-2):** route-level `React.lazy` for detail route; gallery images lazy + sized.

### Server
- **`GET /properties`** — public; filters (`location`, `minPrice`, `maxPrice`, `status`), sort
  (`price-asc|price-desc|newest`), pagination; returns published only.
- **`GET /properties/:slug`** — public; single published property + media.
- **`GET /prerender/properties`** — build-time list of published slugs + metadata (ADR-0003).
- **`POST /favorites`** — `requireAuth()`, zod `{ propertyId }`, upsert `(userId, propertyId)`.
- **`DELETE /favorites/:propertyId`** — `requireAuth()`, delete.
- **`GET /favorites`** — `requireAuth()`, list current user's favorites.

### Data
`Property`: `id`, `slug`, `title`, `location`, `price` / `price_band`, `documentation_status`
(label + flags JSON), `description`, `availability`, `media[]`, `published`, `created_at`.
`Favorite`: `(user_id, property_id)` composite unique + `created_at`.

### Shared schemas (`src/lib/schemas/property.ts`)
`propertyFiltersSchema`, `favoriteSchema = z.object({ propertyId: z.string() })`,
`documentationStatusSchema` (label enum + flags object).

### Key decisions
- Filter state in the URL (shareable + SSG-friendly).
- Favorites are the only protected action here; everything else is public/prerenderable.
- Slugs are stable per property (used as prerender + canonical URL).

---

## Tasks

1. Add Drizzle `properties` + `favorites` tables + migration; seed sample estates with doc status.
   **Ask-first: schema change.** → data model, Boundaries
2. Implement `GET /properties` (filter/sort/paginate, published-only). → FR-2.1, FR-2.3
3. Implement `GET /properties/:slug` + `GET /prerender/properties`. → FR-2.2, NFR-3
4. Implement `POST/DELETE/GET /favorites` with `requireAuth()`. → FR-2.4, FR-4.3
5. Build `PropertyCard` + doc-status `Badge`. → FR-2.1
6. Build `FilterBar` with URL-synced location/price/status/sort. → FR-2.3
7. Build `/properties` list wired to `useProperties`. → FR-2.1/2.3
8. Build `/properties/:slug`: `PropertyGallery` (lazy), `DocumentationPanel`, location, description.
   → FR-2.2, NFR-2
9. Build `FavoriteButton` + hooks; anonymous → login redirect. → FR-2.4
10. `<Helmet>` metadata + prerender registration for list + each detail. → NFR-3
11. Responsive pass 360–1920 (cards, filter bar, gallery). → NFR-1
12. Tests per FR (below).

---

## Tests

- **Unit:** filter/sort URL (de)serialization; doc-status label/flag rendering; `documentationStatusSchema`;
  favorites hook redirects when unauthenticated.
- **Integration:** `GET /properties` honors each filter + sort + published-only; `:slug` returns 404
  for unpublished; `POST /favorites` returns `401` unauthenticated and upserts (idempotent) when
  authed; `DELETE` removes.
- **E2E:** browse list → open detail → see documentation status; filter narrows results and URL
  updates; anonymous favorite → login; authed favorite persists across reload; **responsive
  360/768/1024/1440/1920 (NFR-1)**; a listing without doc status never renders (guard test).
- **Coverage target:** 85%; every FR-2.x has ≥1 test; favorites auth path 100%.
