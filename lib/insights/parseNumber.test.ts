import { describe, expect, it } from "vitest";
import { parseNumericValue } from "./parseNumber";

describe("parseNumericValue", () => {
  it("parses plain numbers", () => {
    expect(parseNumericValue("4500")).toBe(4500);
  });

  it("strips currency symbols and commas", () => {
    expect(parseNumericValue("$4,500.50")).toBe(4500.5);
  });

  it("returns null for empty or missing values", () => {
    expect(parseNumericValue("")).toBeNull();
    expect(parseNumericValue(undefined)).toBeNull();
    expect(parseNumericValue(null)).toBeNull();
  });

  it("returns null for non-numeric text", () => {
    expect(parseNumericValue("N/A")).toBeNull();
  });

  it("handles negative numbers", () => {
    expect(parseNumericValue("-150")).toBe(-150);
  });
});
