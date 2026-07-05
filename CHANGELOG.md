# Changelog

All notable milestone-level progress for Forge is recorded here.

## Unreleased

### Milestone 9 — Repository Audit, Polish & Deploy
- Full repository audit before release: reviewed every file for duplication, dead code, unused dependencies, naming, accessibility, error handling, and security. Findings and disposition below; nothing needed inventing — the codebase was already close to standard.
- Extracted shared request-parsing helpers (`lib/api.ts`: `parseJsonBody`, `getStringField`) into all four POST routes, removing near-identical body-parsing boilerplate
- Extracted a shared `ErrorBanner` component, replacing five copies of the same retry-banner markup across `page.tsx`, `EntryPreview`, `AnswerForm`, `DraftView`, `EntryFlow`
- Added server-side URL re-validation to `POST /api/entries` (previously only the client button-disable checked `isValidUrl`; a malformed URL could reach the API directly)
- Accessibility: associated every `<label>` with its `<textarea>` via `htmlFor`/`id`; added `aria-live`/`role="alert"` to loading and error/status messages so screen readers announce async updates
- Removed unused `create-next-app` boilerplate assets (`public/{file,globe,next,vercel,window}.svg`) — nothing referenced them
- Fixed a stale doc reference (`docs/decisions.md` said `lib/gemini.ts`; the real file is `lib/ai.ts`), deduplicated `.gitignore`, expanded the README's scripts table and added a routes overview
- Verified the full app end-to-end: every route, every API endpoint (happy path and validation errors), database persistence across a server restart, and Jina extraction against a real URL. Gemini's daily free-tier quota was still exhausted from Milestone 7's testing at the start of this milestone, so question/draft *generation* itself was verified via already-saved data rather than fresh model calls — quality was already confirmed against the real API in Milestones 4 and 6
- Responsive and dark/light-mode pass across mobile/tablet/desktop widths — layout was already sound; no responsive bugs found
- `build`, `lint`, and all 21 unit tests pass

### Milestone 8 — History / Past Entries
- `app/history/page.tsx`: read-only list of past entries (newest first), each showing input type, current stage (derived via `getStage()`), the raw input, and creation timestamp; links through to `/entry/[id]` to resume
- Explicitly forced dynamic rendering (`export const dynamic = "force-dynamic"`) — Next.js had statically prerendered the page at build time by default, which would have baked in a stale/empty entries list instead of querying fresh on each request
- Added a "History" link on the homepage and a "New entry" link back from history
- Verified: resuming a completed entry from history loads it without triggering any AI calls (only `GET /api/entries/[id]`), confirmed via network inspection — no accidental quota usage from browsing history

### Milestone 7 — Edit & Copy UI
- `PATCH /api/entries/[id]` now also accepts `draft` edits (validated as a non-empty string)
- `DraftView` is now editable: changes save automatically on blur (only when the text actually changed), plus a "Copy to clipboard" button with a "Copied!" confirmation
- Copy failures (e.g. clipboard permission denied) now show a graceful fallback message instead of silently doing nothing — caught during manual verification when the automated browser sandbox denied clipboard access
- Verified end-to-end: editing a draft persists via PATCH and survives reload; copy button correctly reports success or failure

### Milestone 6 — Draft Generation
- `draftPrompt` added to `lib/prompts.ts`, sharing `VOICE_GUIDELINES` with the question prompt; instructs the model to return only the post text, grounded strictly in the user's own answers (no invented facts/opinions)
- `POST /api/draft`: generates the single LinkedIn draft from summary + question/answer pairs + additional thoughts once answers exist, persists it to `draft`
- `EntryFlow` auto-triggers draft generation right after answers are saved (or on reload, if answers exist but no draft yet); `DraftView` shows a loading state, retry-on-error banner, and the finished draft
- Verified against the real Gemini API: draft was strongly grounded in the specific answers given (including a requested angle — "push back on the ship-more-code narrative"), first-person, no hashtags/emojis/clichés — met the quality bar without prompt iteration
- Confirmed draft persists across a full page reload without regenerating
- Unit tests for `draftPrompt`

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
