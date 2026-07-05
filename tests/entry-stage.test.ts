import { describe, expect, it } from "vitest";
import { getStage } from "@/lib/entry-stage";
import type { Entry } from "@/lib/entries-store";

function makeEntry(overrides: Partial<Entry> = {}): Entry {
  return {
    id: "test-id",
    inputType: "raw_thought",
    rawInput: "test",
    extractedContent: null,
    summary: null,
    questions: null,
    answers: null,
    additionalThoughts: null,
    draft: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("getStage", () => {
  it("is 'new' when there are no questions yet", () => {
    expect(getStage(makeEntry())).toBe("new");
  });

  it("is 'awaiting_answers' once questions exist but answers don't", () => {
    expect(getStage(makeEntry({ questions: ["a", "b", "c"] }))).toBe("awaiting_answers");
  });

  it("is 'ready_for_draft' once answers exist but there's no draft", () => {
    expect(
      getStage(makeEntry({ questions: ["a", "b", "c"], answers: ["1", "2", "3"] })),
    ).toBe("ready_for_draft");
  });

  it("is 'complete' once a draft exists", () => {
    expect(
      getStage(
        makeEntry({ questions: ["a", "b", "c"], answers: ["1", "2", "3"], draft: "post" }),
      ),
    ).toBe("complete");
  });
});
