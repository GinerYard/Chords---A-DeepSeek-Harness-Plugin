import { describe, expect, it } from "vitest";
import { docSchema } from "../lib/index.js";

const valid = () => ({
  key: "s\u0000title",
  title: "title",
  code: "code",
  language: "py",
  blocks: [],
  version: 3,
  summary: "s",
  updatedAt: 1234567890
});

describe("docSchema", () => {
  it("accepts a well-formed document", () => {
    expect(docSchema.safeParse(valid()).success).toBe(true);
  });

  it("rejects a document missing any required field", () => {
    for (const field of ["key", "title", "code", "language", "blocks", "version", "summary", "updatedAt"]) {
      const doc = valid();
      delete doc[field];
      const result = docSchema.safeParse(doc);
      expect(result.success, "missing " + field + " must fail").toBe(false);
    }
  });

  it("rejects a non-integer or non-number version", () => {
    expect(docSchema.safeParse({ ...valid(), version: 1.5 }).success).toBe(false);
    expect(docSchema.safeParse({ ...valid(), version: "3" }).success).toBe(false);
  });

  it("rejects wrong field types", () => {
    expect(docSchema.safeParse({ ...valid(), title: 42 }).success).toBe(false);
    expect(docSchema.safeParse({ ...valid(), code: null }).success).toBe(false);
    expect(docSchema.safeParse({ ...valid(), summary: 7 }).success).toBe(false);
    expect(docSchema.safeParse({ ...valid(), updatedAt: "yesterday" }).success).toBe(false);
  });

  it("keeps every required field on parse (no silent loss)", () => {
    const out = docSchema.parse(valid());
    expect(out.version).toBe(3);
    expect(out.updatedAt).toBe(1234567890);
    expect(out.blocks).toEqual([]);
  });
});
