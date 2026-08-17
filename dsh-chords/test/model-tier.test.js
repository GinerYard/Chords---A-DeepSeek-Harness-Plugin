import { describe, expect, it } from "vitest";
import { tierForLineCount } from "../lib/index.js";

const DEFAULT_ROUTE = { smallLines: 200, largeLines: 500 };

describe("tierForLineCount", () => {
  it("maps the documented default boundaries (200 / 201 / 500 / 501)", () => {
    expect(tierForLineCount(200, DEFAULT_ROUTE)).toBe("small");
    expect(tierForLineCount(201, DEFAULT_ROUTE)).toBe("medium");
    expect(tierForLineCount(500, DEFAULT_ROUTE)).toBe("medium");
    expect(tierForLineCount(501, DEFAULT_ROUTE)).toBe("large");
  });

  it("handles trivial inputs", () => {
    expect(tierForLineCount(1, DEFAULT_ROUTE)).toBe("small");
    expect(tierForLineCount(1000, DEFAULT_ROUTE)).toBe("large");
  });

  it("honors custom thresholds from config", () => {
    const route = { smallLines: 50, largeLines: 100 };
    expect(tierForLineCount(50, route)).toBe("small");
    expect(tierForLineCount(51, route)).toBe("medium");
    expect(tierForLineCount(100, route)).toBe("medium");
    expect(tierForLineCount(101, route)).toBe("large");
  });
});
