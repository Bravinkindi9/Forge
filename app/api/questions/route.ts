import { NextRequest, NextResponse } from "next/server";
import { generateStructured, generateText } from "@/lib/ai";
import { getEntry, updateEntry } from "@/lib/entries-store";
import { questionsPrompt, questionsSchema, summaryPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const entryId =
    typeof body === "object" && body !== null && "entryId" in body && typeof (body as { entryId: unknown }).entryId === "string"
      ? (body as { entryId: string }).entryId
      : "";

  if (!entryId) {
    return NextResponse.json({ error: "entryId is required." }, { status: 400 });
  }

  const entry = await getEntry(entryId);
  if (!entry) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  const isUrl = entry.inputType === "url";
  const sourceContent = isUrl ? entry.extractedContent : entry.rawInput;

  if (!sourceContent) {
    return NextResponse.json(
      { error: "No content available to generate questions from yet." },
      { status: 400 },
    );
  }

  try {
    const summary = isUrl ? await generateText(summaryPrompt(sourceContent)) : null;
    const { questions } = await generateStructured(
      questionsPrompt(summary ?? sourceContent),
      questionsSchema,
    );
    const updated = await updateEntry(entryId, { summary, questions });
    return NextResponse.json({ entry: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate questions.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
