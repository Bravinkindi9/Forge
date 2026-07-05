"use client";

import { useState } from "react";
import type { Entry } from "@/lib/entries-store";
import type { QuestionsState } from "@/components/EntryPreview";

const textareaClasses =
  "min-h-20 w-full rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export function AnswerForm({
  entry,
  questions,
  onRetryQuestions,
  onSubmit,
}: {
  entry: Entry;
  questions: QuestionsState;
  onRetryQuestions: () => void;
  onSubmit: (answers: string[], additionalThoughts: string) => Promise<void>;
}) {
  const alreadySaved = Boolean(entry.answers);
  const [answers, setAnswers] = useState<string[]>(entry.answers ?? ["", "", ""]);
  const [additionalThoughts, setAdditionalThoughts] = useState(entry.additionalThoughts ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (questions.status === "loading") {
    return <p className="text-zinc-500 dark:text-zinc-400">Thinking of questions...</p>;
  }

  if (questions.status === "error") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
        <span>{questions.message}</span>
        <button onClick={onRetryQuestions} className="shrink-0 font-medium underline">
          Retry
        </button>
      </div>
    );
  }

  if (!entry.questions) return null;

  const allAnswered = answers.every((a) => a.trim().length > 0);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSubmit(
        answers.map((a) => a.trim()),
        additionalThoughts.trim(),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save your answers.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      {entry.summary && <p className="text-zinc-700 dark:text-zinc-300">{entry.summary}</p>}

      {entry.questions.map((question, i) => (
        <div key={i} className="flex flex-col gap-1">
          <label className="text-zinc-900 dark:text-zinc-50">
            {i + 1}. {question}
          </label>
          <textarea
            className={textareaClasses}
            value={answers[i]}
            onChange={(e) =>
              setAnswers((prev) => prev.map((a, idx) => (idx === i ? e.target.value : a)))
            }
            disabled={alreadySaved}
          />
        </div>
      ))}

      <div className="flex flex-col gap-1">
        <label className="text-zinc-900 dark:text-zinc-50">
          Anything else you want to add? (optional)
        </label>
        <textarea
          className={textareaClasses}
          value={additionalThoughts}
          onChange={(e) => setAdditionalThoughts(e.target.value)}
          disabled={alreadySaved}
        />
      </div>

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          <span>{error}</span>
          <button onClick={handleSave} className="shrink-0 font-medium underline">
            Retry
          </button>
        </div>
      )}

      {alreadySaved ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Your answers are saved.</p>
      ) : (
        <button
          onClick={handleSave}
          disabled={!allAnswered || saving}
          className="self-start rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {saving ? "Saving..." : "Save answers"}
        </button>
      )}
    </div>
  );
}
