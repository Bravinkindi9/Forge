import type { Entry } from "@/lib/entries-store";

export type DraftState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done" }
  | { status: "error"; message: string };

export function DraftView({
  entry,
  draft,
  onRetry,
}: {
  entry: Entry;
  draft: DraftState;
  onRetry: () => void;
}) {
  if (draft.status === "idle") return null;

  if (draft.status === "loading") {
    return <p className="text-zinc-500 dark:text-zinc-400">Writing your draft...</p>;
  }

  if (draft.status === "error") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
        <span>{draft.message}</span>
        <button onClick={onRetry} className="shrink-0 font-medium underline">
          Retry
        </button>
      </div>
    );
  }

  if (!entry.draft) return null;

  return (
    <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <p className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Draft</p>
      <p className="whitespace-pre-wrap text-zinc-900 dark:text-zinc-50">{entry.draft}</p>
    </div>
  );
}
