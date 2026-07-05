# Changelog

All notable milestone-level progress for Forge is recorded here.

## Unreleased

### Milestone 5 — Reflection & Answer Capture UI
- Implemented the dedicated `/entry/[id]` route from the original blueprint (deferred during Milestones 2-4 for speed): the homepage is now a single-purpose "start a new entry" screen that redirects to `/entry/[id]` on creation, and that route owns extraction, question generation, and answer capture
- `GET`/`PATCH /api/entries/[id]`: fetch a single entry, and validate + persist `answers` (exactly as many non-empty strings as there are questions) and optional `additionalThoughts`
- `lib/entry-stage.ts`: pure `getStage(entry)` helper (`new` / `awaiting_answers` / `ready_for_draft` / `complete`) derived entirely from which fields are populated — no stored status field, per the earlier decision
- `AnswerForm` component: one textarea per question plus an optional "anything else" field, disabled once answers are saved, with a save button gated on all three answers being non-empty
- `EntryPreview` simplified back to source-material display only; question/answer UI now lives in `AnswerForm`
- Verified end-to-end: raw thought and URL paths both flow through capture → extraction/questions → answer entry → save, with answers and additional thoughts persisting across a full page reload; PATCH validation rejects wrong answer counts (400) and a missing entry id returns 404
- Unit tests for `getStage`

### Milestone 4 — Summary + Question Generation (Gemini)
- `lib/ai.ts`: the only file that knows about Gemini/`@ai-sdk/google`. Exposes provider-agnostic `generateText(prompt)` and `generateStructured(prompt, schema)`, lazily connecting (same pattern as `lib/db.ts`) so `next build` never requires `GEMINI_API_KEY`
- `lib/prompts.ts`: small, readable prompt builders (`summaryPrompt`, `questionsPrompt`) sharing a `VOICE_GUIDELINES` constant, plus a `questionsSchema` (zod) so question generation returns exactly three questions in a predictable shape via structured output rather than free-text parsing
- `POST /api/questions`: generates a neutral summary (URL entries only) and exactly three reflection questions, persists both to the entry
- Homepage auto-triggers question generation after a URL's extraction succeeds (or immediately for pasted text / raw thought), with a loading state, numbered question list, and retry-on-error banner
- Switched from `gemini-2.0-flash` to `gemini-2.5-flash-lite` after the former returned `429`/`limit: 0` free-tier errors on this API key — see `docs/decisions.md`
- Verified against the real Gemini API across all three input paths (raw thought, pasted text, URL): questions are specific and grounded in the actual content, not generic; summaries are neutral, factual, and don't hallucinate beyond the source material
- Unit tests for the prompt builders and questions schema (pure logic, no network in tests)

### Milestone 3 — URL Extraction Pipeline
- `lib/jina.ts`: extracts article title + content from a URL via Jina Reader's free `r.jina.ai` endpoint (no API key required)
- `POST /api/extract`: takes an `entryId`, extracts its URL's content, and persists it to `extractedContent`
- Homepage automatically triggers extraction after a URL entry is created, with a loading state, a title + content preview, and a retry-on-error banner
- Verified end-to-end against real URLs (including a real extraction and a genuinely unresolvable domain) — errors surface Jina's actual message
- Unit tests for the Jina response parser and error-message parsing (pure logic, no network in tests)

### Milestone 1 — Database Layer
- Added Drizzle ORM schema for `entries` (`lib/schema.ts`) matching the frozen data model
- `lib/db.ts`: lazily-initialized Drizzle client over `drizzle-orm/postgres-js`, connects only on first query so `next build` never requires a live database
- `lib/entries-store.ts`: in-memory `Map` fully removed; `createEntry`/`getEntry`/`updateEntry`/`listEntries` now query Postgres directly (async)
- `app/api/entries/route.ts`: awaits the now-async `createEntry`, added a 502 path for DB failures
- Vercel project linked locally (`vercel link`), Neon-backed Postgres provisioned on Vercel, schema pushed with `drizzle-kit push`
- Verified against the real database: table structure matches schema, create/read/update/list all work, and an entry created before a full dev-server restart is still present afterward
- `build`, `lint`, and unit tests all pass

### Milestone 2 — Input Capture UI
- Single-textarea input on the homepage with auto-detected input type (`url`, `pasted_text`, `raw_thought`) via `lib/detect-input.ts`
- `POST /api/entries` accepts raw input, detects its type, and persists it via a temporary in-memory store (`lib/entries-store.ts`), to be replaced by Drizzle + Postgres in the database milestone
- Capture-and-display UI: loading state, error banner with retry, inline invalid-URL validation, "start over" reset
- Added Vitest with unit tests for `detect-input.ts`

### Milestone 0 — Repo & Tooling Bootstrap
- Scaffolded Next.js (App Router) + TypeScript + Tailwind CSS v4 + ESLint
- Added `.env.example`, `docs/vision.md`, `docs/decisions.md`, `docs/future.md`
- Established git repo and connected to GitHub remote
