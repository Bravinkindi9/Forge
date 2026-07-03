# Forge — Vision

## Why Forge exists

Most "AI writing" tools generate content for you. Forge does the opposite: it helps you think, then you write.

The problem Forge solves is not "I can't write a LinkedIn post." It's "I have a raw idea, an article reaction, or a half-formed thought, and I want to turn it into something authentic without either (a) staring at a blank page, or (b) letting an AI ghostwrite it for me."

Forge sits in the middle: it asks good questions, you answer them, and it hands you one honest draft built from your own words — which you then edit and own.

## Product philosophy

- **The AI organizes thinking, it does not replace it.**
- **Simplicity over cleverness.** The simplest implementation that satisfies the product goal wins.
- **One user, daily usability.** This is a personal tool used every day, not a platform for many users.
- **Low friction.** Every extra click, field, or decision the user has to make is a cost.
- **One draft, not many.** Forcing a single draft keeps the tool honest — it's a starting point for editing, not a content slot machine.
- **The questioning step is the heart of the app.** Everything else exists to support it.
- **Calm, lightweight, invisible.** Forge should feel like a quiet thinking partner, not software you have to operate.

## Version 1 goals

- Accept a URL, pasted text, or a raw thought as input.
- For URLs: extract article content, produce a neutral summary, generate three thoughtful questions.
- For pasted text and raw thoughts: skip extraction/summary, go straight to three questions.
- Capture the user's answers and any additional thoughts.
- Generate exactly one LinkedIn draft from that reflection.
- Let the user edit the draft and copy it to LinkedIn.
- Keep a simple history of past entries.

## Explicit non-goals (Version 1)

Deliberately excluded to protect focus. See [future.md](future.md) for ideas postponed, not rejected.

- Analytics
- Scheduling
- LinkedIn API integration (posting directly)
- Notifications
- Multi-user support / authentication / OAuth
- Teams
- Search, categories, tags
- AI memory / semantic search
- Dashboards
- Gamification
- Prompt-editing UI

If a feature doesn't serve "raw thought → guided questions → one honest draft," it doesn't belong in V1.
