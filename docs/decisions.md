# Engineering Decisions

Chronological record of notable engineering decisions and the reasoning behind them. See [vision.md](vision.md) for product philosophy and [future.md](future.md) for postponed ideas.

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
