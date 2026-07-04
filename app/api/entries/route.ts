import { NextRequest, NextResponse } from "next/server";
import { detectInputType } from "@/lib/detect-input";
import { createEntry } from "@/lib/entries-store";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawInput =
    typeof body === "object" && body !== null && "rawInput" in body && typeof (body as { rawInput: unknown }).rawInput === "string"
      ? (body as { rawInput: string }).rawInput.trim()
      : "";

  if (!rawInput) {
    return NextResponse.json({ error: "Input cannot be empty." }, { status: 400 });
  }

  const inputType = detectInputType(rawInput);

  try {
    const entry = await createEntry({ rawInput, inputType });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Failed to create entry:", error);
    return NextResponse.json({ error: "Failed to save entry. Please try again." }, { status: 502 });
  }
}
