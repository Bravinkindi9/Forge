# Changelog

All notable milestone-level progress for Forge is recorded here.

## Unreleased

### Milestone 1 — Database Layer (in progress)
- Added Drizzle ORM schema for `entries` (`lib/schema.ts`) matching the frozen data model
- `lib/db.ts`: lazily-initialized Drizzle client over `drizzle-orm/postgres-js`, connects only on first query so `next build` never requires a live database
- `lib/entries-store.ts`: in-memory `Map` fully removed; `createEntry`/`getEntry`/`updateEntry`/`listEntries` now query Postgres directly (async)
- `app/api/entries/route.ts`: awaits the now-async `createEntry`, added a 502 path for DB failures
- Vercel project linked locally (`vercel link`) and Neon-backed Postgres provisioned on Vercel
- **Blocked:** Neon's connection-string env vars are marked "sensitive" on Vercel, so `vercel env pull` returns them empty — waiting on the real `POSTGRES_URL` to run `db:push` and verify persistence against the live database. `build`, `lint`, and unit tests all pass without it.

### Milestone 2 — Input Capture UI
- Single-textarea input on the homepage with auto-detected input type (`url`, `pasted_text`, `raw_thought`) via `lib/detect-input.ts`
- `POST /api/entries` accepts raw input, detects its type, and persists it via a temporary in-memory store (`lib/entries-store.ts`), to be replaced by Drizzle + Postgres in the database milestone
- Capture-and-display UI: loading state, error banner with retry, inline invalid-URL validation, "start over" reset
- Added Vitest with unit tests for `detect-input.ts`

### Milestone 0 — Repo & Tooling Bootstrap
- Scaffolded Next.js (App Router) + TypeScript + Tailwind CSS v4 + ESLint
- Added `.env.example`, `docs/vision.md`, `docs/decisions.md`, `docs/future.md`
- Established git repo and connected to GitHub remote
