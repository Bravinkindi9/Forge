import { describe, expect, it } from "vitest";
import { questionsPrompt, questionsSchema, summaryPrompt } from "@/lib/prompts";

describe("summaryPrompt", () => {
  it("embeds the article content in the prompt", () => {
    const prompt = summaryPrompt("An article about side projects.");
    expect(prompt).toContain("An article about side projects.");
    expect(prompt.toLowerCase()).toContain("summarize");
  });
});

describe("questionsPrompt", () => {
  it("embeds the source content and asks for exactly three questions", () => {
    const prompt = questionsPrompt("Some reflection material.");
    expect(prompt).toContain("Some reflection material.");
    expect(prompt).toContain("exactly three");
  });
});

describe("questionsSchema", () => {
  it("accepts exactly three questions", () => {
    const result = questionsSchema.safeParse({ questions: ["a", "b", "c"] });
    expect(result.success).toBe(true);
  });

  it("rejects a different number of questions", () => {
    const result = questionsSchema.safeParse({ questions: ["a", "b"] });
    expect(result.success).toBe(false);
  });
});
