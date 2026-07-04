import { describe, expect, it } from "vitest";
import { parseErrorMessage, parseJinaOutput } from "@/lib/jina";

describe("parseJinaOutput", () => {
  it("extracts the title and markdown content from a standard response", () => {
    const raw = [
      "Title: Example Domain",
      "",
      "URL Source: https://example.com/",
      "",
      "Published Time: Wed, 01 Jul 2026 17:52:37 GMT",
      "",
      "Markdown Content:",
      "This domain is for use in documentation examples.",
    ].join("\n");

    const result = parseJinaOutput(raw);

    expect(result.title).toBe("Example Domain");
    expect(result.content).toBe("This domain is for use in documentation examples.");
  });

  it("falls back to the full text when there is no Markdown Content marker", () => {
    const raw = "Just some plain text with no markers.";

    const result = parseJinaOutput(raw);

    expect(result.title).toBeNull();
    expect(result.content).toBe(raw);
  });
});

describe("parseErrorMessage", () => {
  it("extracts the message field from a JSON error body", () => {
    const body = JSON.stringify({ code: 400, message: "Domain could not be resolved" });
    expect(parseErrorMessage(body)).toBe("Domain could not be resolved");
  });

  it("falls back to the raw text when the body is plain text", () => {
    const body = "ParamValidationError(url): Domain 'example' could not be resolved";
    expect(parseErrorMessage(body)).toBe(body);
  });

  it("returns null for an empty or excessively long body", () => {
    expect(parseErrorMessage("")).toBeNull();
    expect(parseErrorMessage("x".repeat(500))).toBeNull();
  });
});
