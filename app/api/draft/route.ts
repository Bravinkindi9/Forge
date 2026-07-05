import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai";
import { getEntry, updateEntry } from "@/lib/entries-store";
import { draftPrompt } from "@/lib/prompts";
import { getStringField, parseJsonBody } from "@/lib/api";

export async function POST(request: NextRequest) {
  const body = await parseJsonBody(request);
  if (body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const entryId = getStringField(body, "entryId") ?? "";
  if (!entryId) {
    return NextResponse.json({ error: "entryId is required." }, { status: 400 });
  }

  const entry = await getEntry(entryId);
  if (!entry) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  if (!entry.questions || !entry.answers) {
    return NextResponse.json(
      { error: "This entry doesn't have answers yet." },
      { status: 400 },
    );
  }

  try {
    const draft = await generateText(
      draftPrompt({
        summary: entry.summary,
        questions: entry.questions,
        answers: entry.answers,
        additionalThoughts: entry.additionalThoughts,
      }),
    );
    const updated = await updateEntry(entryId, { draft });
    return NextResponse.json({ entry: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate a draft.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
