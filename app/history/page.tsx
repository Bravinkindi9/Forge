import Link from "next/link";
import { listEntries } from "@/lib/entries-store";
import { getStage, type EntryStage } from "@/lib/entry-stage";
import type { Entry } from "@/lib/entries-store";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<Entry["inputType"], string> = {
  url: "URL",
  pasted_text: "Pasted text",
  raw_thought: "Raw thought",
};

const STAGE_LABELS: Record<EntryStage, string> = {
  new: "Just started",
  awaiting_answers: "Awaiting answers",
  ready_for_draft: "Answers saved",
  complete: "Draft ready",
};

export default async function HistoryPage() {
  const entries = await listEntries();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">History</h1>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 underline dark:text-zinc-400"
          >
            New entry
          </Link>
        </div>

        {entries.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">No entries yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {entries.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/entry/${entry.id}`}
                  className="flex flex-col gap-1 rounded-lg border border-zinc-200 p-3 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {TYPE_LABELS[entry.inputType]} · {STAGE_LABELS[getStage(entry)]}
                  </span>
                  <span className="truncate text-zinc-900 dark:text-zinc-50">{entry.rawInput}</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
