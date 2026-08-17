import { describe, expect, it } from "vitest";
import * as lens from "../lib/index.js";

describe("module smoke (import without booting DSH)", () => {
  it("exports the plugin contract", () => {
    expect(lens.name).toBe("chords");
    expect(Array.isArray(lens.inject)).toBe(true);
    expect(lens.inject).toContain("tools");
    expect(typeof lens.apply).toBe("function");
  });

  it("exposes the pure helpers the tests build on", () => {
    for (const fn of ["anchorLineIndex", "extractJson", "docKey", "splitLines", "tierForLineCount", "walkRenameChain", "wouldCreateRenameCycle", "appendHistoryEntry"]) {
      expect(typeof lens[fn], fn + " must be a function").toBe("function");
    }
    expect(typeof lens.docSchema.safeParse).toBe("function");
  });
});
