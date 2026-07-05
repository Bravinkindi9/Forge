import { NextResponse } from "next/server";
import { getEntry, updateEntry } from "@/lib/entries-store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }
  return NextResponse.json({ entry });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;

  const existing = await getEntry(id);
  if (!existing) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { answers, additionalThoughts } = body as { answers?: unknown; additionalThoughts?: unknown };

  const changes: Parameters<typeof updateEntry>[1] = {};

  if (answers !== undefined) {
    const expectedCount = existing.questions?.length ?? 3;
    const isValidAnswers =
      Array.isArray(answers) &&
      answers.length === expectedCount &&
      answers.every((a) => typeof a === "string" && a.trim().length > 0);

    if (!isValidAnswers) {
      return NextResponse.json(
        { error: `answers must be an array of ${expectedCount} non-empty strings.` },
        { status: 400 },
      );
    }
    changes.answers = (answers as string[]).map((a) => a.trim());
  }

  if (additionalThoughts !== undefined) {
    if (additionalThoughts !== null && typeof additionalThoughts !== "string") {
      return NextResponse.json({ error: "additionalThoughts must be a string or null." }, { status: 400 });
    }
    changes.additionalThoughts = additionalThoughts ? additionalThoughts.trim() : null;
  }

  const updated = await updateEntry(id, changes);
  return NextResponse.json({ entry: updated });
}
