import { describe, expect, it } from "vitest";
import { draftPrompt, questionsPrompt, questionsSchema, summaryPrompt } from "@/lib/prompts";

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

describe("draftPrompt", () => {
  it("embeds the summary, each question/answer pair, and additional thoughts", () => {
    const prompt = draftPrompt({
      summary: "The article is about X.",
      questions: ["Why does X matter?"],
      answers: ["Because of Y."],
      additionalThoughts: "Also, Z.",
    });

    expect(prompt).toContain("The article is about X.");
    expect(prompt).toContain("Why does X matter?");
    expect(prompt).toContain("Because of Y.");
    expect(prompt).toContain("Also, Z.");
  });

  it("omits the summary and additional-thoughts sections when absent", () => {
    const prompt = draftPrompt({
      summary: null,
      questions: ["Why does X matter?"],
      answers: ["Because of Y."],
      additionalThoughts: null,
    });

    expect(prompt).not.toContain("Summary of the source material");
    expect(prompt).not.toContain("Additional thoughts");
  });

  it("instructs the model to return only the post text", () => {
    const prompt = draftPrompt({
      summary: null,
      questions: ["Q"],
      answers: ["A"],
      additionalThoughts: null,
    });
    expect(prompt).toContain("Return only the post text");
  });
});
