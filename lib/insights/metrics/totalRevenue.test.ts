import { describe, expect, it } from "vitest";
import type { CsvRow } from "@/lib/upload/types";
import { getTotalRevenue } from "./totalRevenue";

const rows: CsvRow[] = [
  { Revenue: "1000" },
  { Revenue: "$2,500" },
  { Revenue: "" },
  { Revenue: "not a number" },
];

describe("getTotalRevenue", () => {
  it("is unavailable when no revenue column is mapped", () => {
    expect(getTotalRevenue(rows, null)).toEqual({ available: false });
  });

  it("sums parsable revenue values, ignoring blanks and invalid text", () => {
    expect(getTotalRevenue(rows, "Revenue")).toEqual({ available: true, value: 3500 });
  });
});
