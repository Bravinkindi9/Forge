"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Entry } from "@/lib/entries-store";
import { getStage } from "@/lib/entry-stage";
import { EntryPreview, type ExtractionState, type QuestionsState } from "@/components/EntryPreview";
import { AnswerForm } from "@/components/AnswerForm";
import { DraftView, type DraftState } from "@/components/DraftView";

export function EntryFlow({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [extraction, setExtraction] = useState<ExtractionState>({ status: "idle" });
  const [questions, setQuestions] = useState<QuestionsState>({ status: "idle" });
  const [draft, setDraft] = useState<DraftState>({ status: "idle" });

  useEffect(() => {
    void loadEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId]);

  async function loadEntry() {
    setLoadError(null);
    try {
      const res = await fetch(`/api/entries/${entryId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Entry not found.");
      setEntry(data.entry);

      const stage = getStage(data.entry);
      if (stage === "new") {
        if (data.entry.inputType === "url") {
          void runExtraction();
        } else {
          void runQuestions();
        }
      } else if (stage === "ready_for_draft") {
        void runDraft();
      } else if (stage === "complete") {
        setDraft({ status: "done" });
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load entry.");
    }
  }

  async function runExtraction() {
    setExtraction({ status: "loading" });
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract content from that URL.");
      setEntry(data.entry);
      setExtraction({ status: "done", title: data.title ?? null });
      void runQuestions();
    } catch (err) {
      setExtraction({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to extract content from that URL.",
      });
    }
  }

  async function runQuestions() {
    setQuestions({ status: "loading" });
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate questions.");
      setEntry(data.entry);
      setQuestions({ status: "done" });
    } catch (err) {
      setQuestions({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to generate questions.",
      });
    }
  }

  async function runDraft() {
    setDraft({ status: "loading" });
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate a draft.");
      setEntry(data.entry);
      setDraft({ status: "done" });
    } catch (err) {
      setDraft({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to generate a draft.",
      });
    }
  }

  async function submitAnswers(answers: string[], additionalThoughts: string) {
    const res = await fetch(`/api/entries/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, additionalThoughts: additionalThoughts || null }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save your answers.");
    setEntry(data.entry);
    void runDraft();
  }

  async function saveDraft(draftText: string) {
    const res = await fetch(`/api/entries/${entryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draft: draftText }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save your edit.");
    setEntry(data.entry);
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
        <span>{loadError}</span>
        <button onClick={loadEntry} className="shrink-0 font-medium underline">
          Retry
        </button>
      </div>
    );
  }

  if (!entry) {
    return <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <EntryPreview entry={entry} extraction={extraction} onRetryExtraction={runExtraction} />
      <AnswerForm
        entry={entry}
        questions={questions}
        onRetryQuestions={runQuestions}
        onSubmit={submitAnswers}
      />
      <DraftView entry={entry} draft={draft} onRetry={runDraft} onSave={saveDraft} />
      <button
        onClick={() => router.push("/")}
        className="self-start text-sm font-medium text-zinc-500 underline dark:text-zinc-400"
      >
        Start over
      </button>
    </div>
  );
}
