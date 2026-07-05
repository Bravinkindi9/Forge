"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { detectInputType, isValidUrl } from "@/lib/detect-input";

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = input.trim();
  const invalidUrl = trimmed.length > 0 && detectInputType(trimmed) === "url" && !isValidUrl(trimmed);

  async function handleSubmit() {
    if (!trimmed || invalidUrl || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      router.push(`/entry/${data.entry.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Forge</h1>
          <Link
            href="/history"
            className="text-sm font-medium text-zinc-500 underline dark:text-zinc-400"
          >
            History
          </Link>
        </div>

        <textarea
          className="min-h-40 w-full rounded-lg border border-zinc-300 bg-white p-4 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          placeholder="Paste a URL, an article, or just write down a raw thought..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {invalidUrl && (
          <p className="text-sm text-red-600 dark:text-red-400">
            This doesn&apos;t look like a valid URL.
          </p>
        )}
        {error && (
          <div className="flex items-center justify-between gap-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            <span>{error}</span>
            <button onClick={handleSubmit} className="shrink-0 font-medium underline">
              Retry
            </button>
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={!trimmed || invalidUrl || loading}
          className="self-start rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900"
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </main>
    </div>
  );
}
