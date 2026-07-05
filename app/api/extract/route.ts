import { NextRequest, NextResponse } from "next/server";
import { extractArticle } from "@/lib/jina";
import { getEntry, updateEntry } from "@/lib/entries-store";
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

  if (entry.inputType !== "url") {
    return NextResponse.json({ error: "This entry is not a URL." }, { status: 400 });
  }

  try {
    const article = await extractArticle(entry.rawInput);
    const updated = await updateEntry(entryId, { extractedContent: article.content });
    return NextResponse.json({ entry: updated, title: article.title }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to extract content from that URL.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
