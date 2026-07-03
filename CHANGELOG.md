# Changelog

All notable milestone-level progress for Forge is recorded here.

## Unreleased

### Milestone 2 — Input Capture UI
- Single-textarea input on the homepage with auto-detected input type (`url`, `pasted_text`, `raw_thought`) via `lib/detect-input.ts`
- `POST /api/entries` accepts raw input, detects its type, and persists it via a temporary in-memory store (`lib/entries-store.ts`), to be replaced by Drizzle + Postgres in the database milestone
- Capture-and-display UI: loading state, error banner with retry, inline invalid-URL validation, "start over" reset
- Added Vitest with unit tests for `detect-input.ts`

### Milestone 0 — Repo & Tooling Bootstrap
- Scaffolded Next.js (App Router) + TypeScript + Tailwind CSS v4 + ESLint
- Added `.env.example`, `docs/vision.md`, `docs/decisions.md`, `docs/future.md`
- Established git repo and connected to GitHub remote
