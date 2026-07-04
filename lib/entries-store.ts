import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { entries } from "@/lib/schema";
import type { InputType } from "@/lib/detect-input";

export type Entry = {
  id: string;
  inputType: InputType;
  rawInput: string;
  extractedContent: string | null;
  summary: string | null;
  questions: string[] | null;
  answers: string[] | null;
  additionalThoughts: string | null;
  draft: string | null;
  createdAt: string;
  updatedAt: string;
};

type EntryRow = typeof entries.$inferSelect;

function toEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    inputType: row.inputType,
    rawInput: row.rawInput,
    extractedContent: row.extractedContent,
    summary: row.summary,
    questions: row.questions ?? null,
    answers: row.answers ?? null,
    additionalThoughts: row.additionalThoughts,
    draft: row.draft,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createEntry(params: {
  rawInput: string;
  inputType: InputType;
}): Promise<Entry> {
  const [row] = await db
    .insert(entries)
    .values({ rawInput: params.rawInput, inputType: params.inputType })
    .returning();
  return toEntry(row);
}

export async function getEntry(id: string): Promise<Entry | undefined> {
  const [row] = await db.select().from(entries).where(eq(entries.id, id));
  return row ? toEntry(row) : undefined;
}

export async function updateEntry(
  id: string,
  changes: Partial<
    Pick<
      Entry,
      "extractedContent" | "summary" | "questions" | "answers" | "additionalThoughts" | "draft"
    >
  >,
): Promise<Entry | undefined> {
  const [row] = await db
    .update(entries)
    .set({ ...changes, updatedAt: new Date() })
    .where(eq(entries.id, id))
    .returning();
  return row ? toEntry(row) : undefined;
}

export async function listEntries(): Promise<Entry[]> {
  const rows = await db.select().from(entries).orderBy(desc(entries.createdAt));
  return rows.map(toEntry);
}
