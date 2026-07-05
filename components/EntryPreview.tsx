import type { Entry } from "@/lib/entries-store";

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
  questions,
  onReset,
  onRetryExtraction,
  onRetryQuestions,
}: {
  entry: Entry;
  extraction: ExtractionState;
  questions: QuestionsState;
  onReset: () => void;
  onRetryExtraction: () => void;
  onRetryQuestions: () => void;
}) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
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
            <p className="text-zinc-500 dark:text-zinc-400">Extracting article...</p>
          )}

          {extraction.status === "error" && (
            <div className="flex items-center justify-between gap-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              <span>{extraction.message}</span>
              <button onClick={onRetryExtraction} className="shrink-0 font-medium underline">
                Retry
              </button>
            </div>
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

      {questions.status === "loading" && (
        <p className="text-zinc-500 dark:text-zinc-400">Thinking of questions...</p>
      )}

      {questions.status === "error" && (
        <div className="flex items-center justify-between gap-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          <span>{questions.message}</span>
          <button onClick={onRetryQuestions} className="shrink-0 font-medium underline">
            Retry
          </button>
        </div>
      )}

      {questions.status === "done" && (
        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          {entry.summary && (
            <p className="text-zinc-700 dark:text-zinc-300">{entry.summary}</p>
          )}
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-zinc-900 dark:text-zinc-50">
            {entry.questions?.map((question, i) => <li key={i}>{question}</li>)}
          </ol>
        </div>
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
