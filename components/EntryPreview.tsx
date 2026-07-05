import type { Entry } from "@/lib/entries-store";
import { ErrorBanner } from "@/components/ErrorBanner";

export type ExtractionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; title: string | null }
  | { status: "error"; message: string };

export type QuestionsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done" }
  | { status: "error"; message: string };

const LABELS: Record<Entry["inputType"], string> = {
  url: "URL",
  pasted_text: "Pasted text",
  raw_thought: "Raw thought",
};

const PREVIEW_LIMIT = 500;

function previewOf(content: string | null): string {
  if (!content) return "";
  return content.length > PREVIEW_LIMIT ? `${content.slice(0, PREVIEW_LIMIT).trim()}…` : content;
}

export function EntryPreview({
  entry,
  extraction,
  onRetryExtraction,
}: {
  entry: Entry;
  extraction: ExtractionState;
  onRetryExtraction: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {LABELS[entry.inputType]}
      </p>

      {entry.inputType === "url" ? (
        <>
          <a
            href={entry.rawInput}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sm text-blue-600 underline dark:text-blue-400"
          >
            {entry.rawInput}
          </a>

          {extraction.status === "loading" && (
            <p aria-live="polite" className="text-zinc-500 dark:text-zinc-400">
              Extracting article...
            </p>
          )}

          {extraction.status === "error" && (
            <ErrorBanner message={extraction.message} onRetry={onRetryExtraction} />
          )}

          {extraction.status === "done" && (
            <div className="flex flex-col gap-2">
              {extraction.title && (
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                  {extraction.title}
                </p>
              )}
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                {previewOf(entry.extractedContent)}
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="whitespace-pre-wrap text-lg text-zinc-900 dark:text-zinc-50">
          {entry.rawInput}
        </p>
      )}
    </div>
  );
}
