import { describe, expect, it } from "vitest";
import { appendHistoryEntry } from "../lib/index.js";

const entry = (v) => ({ version: v, code: "c" + v, blocks: [], summary: "s" + v, updatedAt: v });

describe("appendHistoryEntry", () => {
  it("caps history at 20 entries after 25 consecutive appends", () => {
    let cur = { entries: [] };
    for (let v = 1; v <= 25; v++) cur = appendHistoryEntry(cur, entry(v));
    expect(cur.entries.length).toBe(20);
    expect(cur.entries[0].version).toBe(6);
    expect(cur.entries[19].version).toBe(25);
    expect(cur.entries.map((e) => e.version)).toEqual([...Array(20)].map((_, i) => i + 6));
  });

  it("keeps version order ascending (oldest dropped first)", () => {
    let cur = { entries: [] };
    for (let v = 1; v <= 40; v++) cur = appendHistoryEntry(cur, entry(v));
    const vs = cur.entries.map((e) => e.version);
    for (let i = 1; i < vs.length; i++) expect(vs[i]).toBeGreaterThan(vs[i - 1]);
    expect(vs[0]).toBe(21);
    expect(vs[vs.length - 1]).toBe(40);
  });

  it("treats a missing or malformed current value as empty", () => {
    expect(appendHistoryEntry(undefined, entry(1)).entries).toEqual([entry(1)]);
    expect(appendHistoryEntry(null, entry(1)).entries).toEqual([entry(1)]);
    expect(appendHistoryEntry({ entries: "oops" }, entry(1)).entries).toEqual([entry(1)]);
  });

  it("appends one entry without dropping when under the cap", () => {
    let cur = { entries: [] };
    for (let v = 1; v <= 19; v++) cur = appendHistoryEntry(cur, entry(v));
    cur = appendHistoryEntry(cur, entry(20));
    expect(cur.entries.length).toBe(20);
    expect(cur.entries[0].version).toBe(1);
  });
});
