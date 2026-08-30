# ADR-0004: Property media storage — Cloudinary

- **Status:** Accepted
- **Date:** 2026-08-30
- **Supersedes:** the initial "S3-compatible object storage" note in the spec's Tech Stack

## Context

Property listings carry images (admin uploads, FR-8.1); `Property.media[]` stores their URLs. The
original spec named generic S3-compatible object storage. We're switching to **Cloudinary** as the
media store + delivery layer.

## Decision

Use **Cloudinary** for property image upload, storage, and delivery. The database stores only the
returned `secure_url`s in `Property.media[]`; the browser loads images straight from Cloudinary's
CDN. Local dev Postgres runs via Docker Compose (`postgres:18`); Cloudinary is a hosted service (no
local container).

- Server config + adapter: `server/src/lib/media.ts` (configure via `CLOUDINARY_URL` or the three
  explicit `CLOUDINARY_*` vars).
- Dependency: `cloudinary` (Node SDK) in `server`.

## Consequences

**Positive**
- Built-in CDN delivery + on-the-fly transforms (resize/format/quality) support NFR-2 (optimized,
  lazy-loaded imagery) without a separate image pipeline.
- Simpler than provisioning + securing an S3 bucket + CloudFront for the MVP.
- Signed uploads keep the API secret server-side (NFR-4).

**Negative / mitigations**
- Vendor lock-in vs. generic S3 → media access is isolated behind `lib/media.ts`, so swapping later
  touches one adapter.
- Free-tier limits → monitor usage; revisit if volume grows.

## Notes

- Uploads flow through the admin media route (P3); the SPA never holds Cloudinary secrets.
- Transform params (e.g. `f_auto,q_auto,w_*`) are applied at the delivery URL for responsive images.
