import type { Entry } from "@/lib/entries-store";

const LABELS: Record<Entry["inputType"], string> = {
  url: "URL",
  pasted_text: "Pasted text",
  raw_thought: "Raw thought",
};

export function EntryPreview({ entry, onReset }: { entry: Entry; onReset: () => void }) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <p className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {LABELS[entry.inputType]}
      </p>
      {entry.inputType === "url" ? (
        <a
          href={entry.rawInput}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-lg text-blue-600 underline dark:text-blue-400"
        >
          {entry.rawInput}
        </a>
      ) : (
        <p className="whitespace-pre-wrap text-lg text-zinc-900 dark:text-zinc-50">
          {entry.rawInput}
        </p>
      )}
      <button
        onClick={onReset}
        className="self-start text-sm font-medium text-zinc-500 underline dark:text-zinc-400"
      >
        Start over
      </button>
    </div>
  );
}
