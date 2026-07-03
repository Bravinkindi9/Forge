import { describe, expect, it } from "vitest";
import { detectInputType, isValidUrl } from "@/lib/detect-input";

describe("detectInputType", () => {
  it("detects http and https URLs", () => {
    expect(detectInputType("https://example.com/article")).toBe("url");
    expect(detectInputType("http://example.com")).toBe("url");
  });

  it("detects pasted text when long and not a URL", () => {
    expect(detectInputType("a".repeat(300))).toBe("pasted_text");
  });

  it("detects raw thought when short and not a URL", () => {
    expect(detectInputType("just a quick idea")).toBe("raw_thought");
  });
});

describe("isValidUrl", () => {
  it("accepts valid http/https URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
  });

  it("rejects malformed or non-URL input", () => {
    expect(isValidUrl("https://")).toBe(false);
    expect(isValidUrl("not a url")).toBe(false);
  });
});
