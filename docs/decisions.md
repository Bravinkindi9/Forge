# Engineering Decisions

Chronological record of notable engineering decisions and the reasoning behind them. See [vision.md](vision.md) for product philosophy and [future.md](future.md) for postponed ideas.

---

## `postgres` + `drizzle-orm/postgres-js` instead of `@vercel/postgres`

**Decision:** Database access goes through the plain `postgres` driver and `drizzle-orm/postgres-js`, not the `@vercel/postgres` package.

**Why:** `@vercel/postgres` is deprecated — Vercel migrated its Postgres offering onto Neon and no longer maintains that client. `postgres` connects with any standard Postgres connection string (works identically with Vercel/Neon or any other provider) and isn't tied to a single vendor's SDK, which fits "keep architecture clean" better than depending on a deprecated package from day one.

---

## Lazy Drizzle client instead of connecting at import time

**Decision:** `lib/db.ts` wraps the Drizzle client in a `Proxy` that only opens the Postgres connection on first real query, instead of connecting as soon as the module is imported.

**Why:** Next.js's build step collects page/route data for every API route, which imports `lib/db.ts` even though no query actually runs at build time. An eager connection (or an eager throw when `POSTGRES_URL` is unset) broke `next build` in environments without a live database. Lazy connection means `build`/`lint`/tests never require real database credentials, while runtime behavior is unchanged.

---

## Local `.env.local` sourced via `vercel env pull`, from Production not Development

**Decision:** Local development pulls environment variables with `vercel env pull .env.local --environment=production`, not the default `development` target.

**Why:** The Neon-backed Postgres integration only populated `POSTGRES_URL` (and related vars) for the Production and Preview environments, not Development — pulling the default target returned nothing useful. Separately, Vercel marks these connection-string variables as "sensitive," which means `vercel env pull` returns them as empty strings regardless of environment; the real value had to be copied manually from the Vercel/Neon dashboard into `.env.local`. `drizzle.config.ts` explicitly loads `.env.local` via `dotenv` (drizzle-kit only auto-loads `.env` by default).

---

## Input capture built before the database layer, with a stubbed store

**Decision:** Milestone 2 (input capture UI) was built ahead of the database milestone, using a temporary in-memory store (`lib/entries-store.ts`) instead of Drizzle/Postgres.

**Why:** Getting the input → detect → persist → display loop working end-to-end early de-risks the UI and API contract before wiring up real persistence. The store exposes the same `createEntry`/`getEntry` shape the Drizzle-backed version will use, so the database milestone only needs to swap the implementation, not the call sites. The in-memory map resets on server restart — acceptable for this milestone, not for production.

**Alternative considered:** Build the database layer first, per the original milestone order. Rejected for this pass — explicitly reprioritized to validate the input UI sooner.

---

## No explicit `status` field on entries

**Decision:** The `entries` table has no `status`/workflow-state column.

**Why:** Every stage of the flow (new → awaiting answers → ready to draft → complete) is fully derivable from which columns are already populated (`questions`, `answers`, `draft`). A separate status column would just cache information the row already encodes, and caches can drift out of sync with reality if an update partially fails. A pure `getStage(entry)` helper computes the stage on read instead.

**Alternative considered:** An explicit enum status column. Rejected — adds a synchronization hazard for no benefit.

---

## Dedicated `/entry/[id]` route instead of one all-in-one page

**Decision:** The question → answer → draft → edit flow lives on `app/entry/[id]/page.tsx`, not on the home page.

**Why:** Each entry is durable, resumable work — the user may start an entry and return to it later, or reload mid-session. A URL carrying the entry id makes resumption free (reload, bookmark, back-button all behave correctly) via Next.js's native routing, rather than requiring hand-rolled client-side state tracking for "which entry is currently active." The home page stays a single-purpose "start a new entry" screen; the dynamic route is the one place all stages render, selected via `getStage()`. Net effect: less custom state logic, not more surface area.

**Alternative considered:** Keep everything on the home page with in-memory state. Rejected — would lose the user's place on refresh and needs equivalent logic anyway, just without a URL to show for it.

---

## Three distinct input types instead of two

**Decision:** `inputType` is `'url' | 'pasted_text' | 'raw_thought'`, not collapsed into `url` vs `text`.

**Why:** A raw thought is the user's own unfinished idea; pasted text is someone else's finished writing they're reacting to. Both skip URL extraction/summary and go straight to question generation, but the distinction is cheap to store and may inform question/draft prompt tone later (e.g., "help me think this through" vs. "help me respond to this").

---

## Gemini as the sole configured provider, via the Vercel AI SDK

**Decision:** All AI calls go through the Vercel AI SDK's provider abstraction (`lib/gemini.ts`), with Gemini as the only configured provider for V1.

**Why:** Gemini's free tier is sufficient for a single-user daily tool, and the AI SDK abstraction means switching providers later (if quota or quality becomes a problem) is a one-file change, not an application-wide rewrite.
