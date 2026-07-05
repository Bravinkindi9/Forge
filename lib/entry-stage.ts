import type { Entry } from "@/lib/entries-store";

export type EntryStage = "new" | "awaiting_answers" | "ready_for_draft" | "complete";

export function getStage(entry: Entry): EntryStage {
  if (entry.draft) return "complete";
  if (entry.answers) return "ready_for_draft";
  if (entry.questions) return "awaiting_answers";
  return "new";
}
