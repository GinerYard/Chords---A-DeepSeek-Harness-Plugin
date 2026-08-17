import { describe, expect, it } from "vitest";
import { extractJson } from "../lib/index.js";

const OBJ = { code: "def f():\n    return 1\n", blocks: [{ id: "b1", pseudocode: "returns one" }] };

describe("extractJson", () => {
  it("parses a plain JSON object", () => {
    expect(extractJson(JSON.stringify(OBJ))).toEqual(OBJ);
  });

  it("strips a leading and trailing json fence", () => {
    expect(extractJson("```json\n" + JSON.stringify(OBJ) + "\n```")).toEqual(OBJ);
  });

  it("tolerates prose before the fence via bracket extraction", () => {
    expect(extractJson("Sure, here is the result:\n```json\n" + JSON.stringify(OBJ) + "\n```")).toEqual(OBJ);
  });

  it("tolerates prose after the closing fence", () => {
    expect(extractJson("```json\n" + JSON.stringify(OBJ) + "\n```\nLet me know if you need more.")).toEqual(OBJ);
  });

  it("extracts nested braces including a brace inside a string", () => {
    const text = 'before {"outer":{"inner":[1,2,{"deep":true}]},"tail":[{"x":"}"}]} after';
    expect(extractJson(text)).toEqual({ outer: { inner: [1, 2, { deep: true }] }, tail: [{ x: "}" }] });
  });

  it("returns null for prose without JSON", () => {
    expect(extractJson("I am sorry, I cannot do that.")).toBeNull();
  });

  it("returns null for empty or whitespace-only input", () => {
    expect(extractJson("")).toBeNull();
    expect(extractJson("   \n  ")).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    expect(extractJson('{"code": }')).toBeNull();
    expect(extractJson("{not json}")).toBeNull();
  });
});
