export type InputType = "url" | "pasted_text" | "raw_thought";

const PASTED_TEXT_THRESHOLD = 280;

export function detectInputType(input: string): InputType {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return "url";
  }
  return trimmed.length > PASTED_TEXT_THRESHOLD ? "pasted_text" : "raw_thought";
}

export function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
