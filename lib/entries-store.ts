import { randomUUID } from "crypto";
import type { InputType } from "@/lib/detect-input";

export type Entry = {
  id: string;
  inputType: InputType;
  rawInput: string;
  createdAt: string;
};

// Temporary in-memory stub for Milestone 2. Resets on server restart —
// will be replaced by Drizzle + Postgres in the database milestone.
const entries = new Map<string, Entry>();

export function createEntry(params: { rawInput: string; inputType: InputType }): Entry {
  const entry: Entry = {
    id: randomUUID(),
    inputType: params.inputType,
    rawInput: params.rawInput,
    createdAt: new Date().toISOString(),
  };
  entries.set(entry.id, entry);
  return entry;
}

export function getEntry(id: string): Entry | undefined {
  return entries.get(id);
}
