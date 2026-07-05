# Forge

A thinking assistant that helps transform ideas into authentic LinkedIn posts through guided reflection.

Forge is not a content generator. It organizes your thinking — it doesn't replace it.

```
Raw Thought / URL / Pasted Text
        ↓
  Guided Questions
        ↓
    Reflection
        ↓
    One Draft
        ↓
   You edit it
        ↓
 Copy to LinkedIn
```

See [docs/vision.md](docs/vision.md) for the full product philosophy and [docs/decisions.md](docs/decisions.md) for engineering decisions.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Drizzle ORM + Vercel Postgres (Neon-backed, via `postgres`/`drizzle-orm/postgres-js`)
- Vercel AI SDK + Gemini (isolated behind `lib/ai.ts`)
- Jina Reader (URL extraction, free tier, no key required)

## How it works

- `/` — start a new entry (paste a URL, an article, or write a raw thought)
- `/entry/[id]` — the guided flow for one entry: extraction (URL only) → summary + questions → your answers → generated draft → edit and copy
- `/history` — a read-only list of past entries, linking back into `/entry/[id]` to resume

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in POSTGRES_URL, GEMINI_API_KEY (JINA_API_KEY is optional)
npm run db:push              # create the entries table
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |
| `npm test` | Run the unit test suite |
| `npm run db:push` | Push the schema to the database |
| `npm run db:generate` | Generate a versioned migration from schema changes |
| `npm run db:studio` | Open Drizzle Studio against the configured database |

## Project status

See [CHANGELOG.md](CHANGELOG.md) for milestone-level progress.
