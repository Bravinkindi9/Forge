import { NextRequest, NextResponse } from "next/server";
import { detectInputType, isValidUrl } from "@/lib/detect-input";
import { createEntry } from "@/lib/entries-store";
import { getStringField, parseJsonBody } from "@/lib/api";

export async function POST(request: NextRequest) {
  const body = await parseJsonBody(request);
  if (body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawInput = getStringField(body, "rawInput")?.trim() ?? "";
  if (!rawInput) {
    return NextResponse.json({ error: "Input cannot be empty." }, { status: 400 });
  }

  const inputType = detectInputType(rawInput);
  if (inputType === "url" && !isValidUrl(rawInput)) {
    return NextResponse.json({ error: "This doesn't look like a valid URL." }, { status: 400 });
  }

  try {
    const entry = await createEntry({ rawInput, inputType });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Failed to create entry:", error);
    return NextResponse.json({ error: "Failed to save entry. Please try again." }, { status: 502 });
  }
}
