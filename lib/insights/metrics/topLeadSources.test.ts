import { describe, expect, it } from "vitest";
import type { CsvRow } from "@/lib/upload/types";
import { getTopLeadSources } from "./topLeadSources";

const rows: CsvRow[] = [
  { Source: "Referral" },
  { Source: "Referral" },
  { Source: "Website" },
  { Source: "" },
];

describe("getTopLeadSources", () => {
  it("is unavailable when no lead source column is mapped", () => {
    expect(getTopLeadSources(rows, null)).toEqual({ available: false });
  });

  it("ranks sources by count, grouping blanks as Unspecified", () => {
    expect(getTopLeadSources(rows, "Source")).toEqual({
      available: true,
      value: [
        { source: "Referral", count: 2 },
        { source: "Website", count: 1 },
        { source: "Unspecified", count: 1 },
      ],
    });
  });

  it("respects the limit parameter", () => {
    const result = getTopLeadSources(rows, "Source", 1);
    expect(result).toEqual({ available: true, value: [{ source: "Referral", count: 2 }] });
  });
});
