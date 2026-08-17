import { describe, expect, it } from "vitest";
import { anchorLineIndex } from "../lib/index.js";

describe("anchorLineIndex", () => {
  it("returns the 0-based line of an exact match", () => {
    const code = "def f():\n    return 1\n";
    expect(anchorLineIndex(code, "    return 1")).toBe(1);
  });

  it("resolves a duplicate anchor to its first occurrence", () => {
    // Documented contract: duplicates resolve to the first occurrence;
    // callers that need the later one disambiguate via the block lines field.
    const code = "log('x');\nlog('x');\nreturn;";
    expect(anchorLineIndex(code, "log('x');")).toBe(0);
  });

  it("matches a mid-line substring even without leading indentation", () => {
    const code = "    x = 1\n    return x\n";
    expect(anchorLineIndex(code, "x = 1")).toBe(0);
  });

  it("falls back to per-line trim matching across different indentation", () => {
    const code = "def f():\n    if x:\n        return 1\n    return 2\n";
    expect(anchorLineIndex(code, "if x:\n    return 1")).toBe(1);
  });

  it("matches a multi-line anchor exactly", () => {
    const code = "def f():\n    return 1\n";
    expect(anchorLineIndex(code, "def f():\n    return 1")).toBe(0);
  });

  it("normalizes CRLF before matching", () => {
    const code = "a\r\nb\r\nc";
    expect(anchorLineIndex(code, "b\nc")).toBe(1);
  });

  it("does not collapse inner whitespace in the fallback", () => {
    const code = "  foo bar  \n";
    expect(anchorLineIndex(code, "foo   bar")).toBeNull();
  });

  it("returns null when the anchor is absent", () => {
    expect(anchorLineIndex("a\nb", "zzz")).toBeNull();
  });

  it("returns null for an empty or whitespace-only anchor", () => {
    expect(anchorLineIndex("a\nb", "")).toBeNull();
    expect(anchorLineIndex("a\nb", "   ")).toBeNull();
  });
});
