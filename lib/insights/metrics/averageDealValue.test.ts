import { describe, expect, it } from "vitest";
import type { CsvRow } from "@/lib/upload/types";
import { getAverageDealValue } from "./averageDealValue";

describe("getAverageDealValue", () => {
  it("is unavailable when no revenue column is mapped", () => {
    const rows: CsvRow[] = [{ Revenue: "100" }];
    expect(getAverageDealValue(rows, null)).toEqual({ available: false });
  });

  it("averages only the parsable values", () => {
    const rows: CsvRow[] = [{ Revenue: "100" }, { Revenue: "200" }, { Revenue: "" }];
    expect(getAverageDealValue(rows, "Revenue")).toEqual({ available: true, value: 150 });
  });

  it("returns 0 when the column is mapped but has no parsable values", () => {
    const rows: CsvRow[] = [{ Revenue: "" }, { Revenue: "n/a" }];
    expect(getAverageDealValue(rows, "Revenue")).toEqual({ available: true, value: 0 });
  });
});
