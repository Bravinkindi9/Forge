"use client";

import { useState } from "react";
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
  onSave,
}: {
  entry: Entry;
  draft: DraftState;
  onRetry: () => void;
  onSave: (draft: string) => Promise<void>;
}) {
  const [text, setText] = useState(entry.draft ?? "");
  const [syncedDraft, setSyncedDraft] = useState(entry.draft);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  if (entry.draft !== syncedDraft) {
    setSyncedDraft(entry.draft);
    setText(entry.draft ?? "");
  }

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

  async function handleBlur() {
    if (text.trim() === entry.draft || !text.trim()) return;
    setSaveError(null);
    try {
      await onSave(text);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save your edit.");
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyError(null);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Couldn't copy automatically — please select and copy the text manually.");
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <p className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Draft</p>
      <textarea
        className="min-h-40 w-full rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
      />
      {saveError && <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>}
      {copyError && <p className="text-sm text-red-600 dark:text-red-400">{copyError}</p>}
      <button
        onClick={handleCopy}
        className="self-start rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
      >
        {copied ? "Copied!" : "Copy to clipboard"}
      </button>
    </div>
  );
}
