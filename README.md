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
- Drizzle ORM + Vercel Postgres
- Vercel AI SDK + Gemini
- Jina Reader (URL extraction)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values as each milestone requires them
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

## Project status

See [CHANGELOG.md](CHANGELOG.md) for milestone-level progress.
