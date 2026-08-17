import { beforeEach, describe, expect, it } from "vitest";
import { docKey, walkRenameChain, wouldCreateRenameCycle } from "../lib/index.js";

const sid = "session-1";
const rows = new Map();
const getRow = (title) => rows.get(docKey(sid, title)) || null;
const put = (from, to) => rows.set(docKey(sid, from), { newTitle: to, updatedAt: 1 });

beforeEach(() => rows.clear());

describe("rename chain walk", () => {
  it("resolves a straight chain and stops at a missing row", () => {
    put("A", "B");
    put("B", "C");
    expect(walkRenameChain(getRow, "A")).toBe("C");
    expect(walkRenameChain(getRow, "C")).toBe("C");
    expect(walkRenameChain(getRow, "missing")).toBe("missing");
  });

  it("terminates on a real A-B-A cycle instead of looping forever", () => {
    put("A", "B");
    put("B", "A");
    expect(walkRenameChain(getRow, "A")).toBe("A");
    expect(walkRenameChain(getRow, "B")).toBe("B");
  });

  it("stays bounded on a very long chain", () => {
    for (let i = 0; i < 150; i++) put("t" + i, "t" + (i + 1));
    expect(walkRenameChain(getRow, "t0")).toBe("t100");
  });

  it("stops at a broken row", () => {
    rows.set(docKey(sid, "A"), { newTitle: "", updatedAt: 1 });
    expect(walkRenameChain(getRow, "A")).toBe("A");
  });
});

describe("rename cycle rejection", () => {
  it("rejects renaming B to A after A was renamed to B (would close a cycle)", () => {
    put("A", "B");
    // Doc is currently titled B (effective B); renaming it to A would make A resolve back to B.
    expect(wouldCreateRenameCycle(getRow, "B", "A")).toBe(true);
  });

  it("allows a fresh title", () => {
    put("A", "B");
    expect(wouldCreateRenameCycle(getRow, "B", "C")).toBe(false);
  });

  it("flags identity through the predicate (the handler rejects identity even earlier)", () => {
    put("A", "B");
    expect(wouldCreateRenameCycle(getRow, "B", "B")).toBe(true);
  });
});
