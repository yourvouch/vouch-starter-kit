import { describe, expect, it } from "vitest";
import type { CsvRow } from "@/lib/upload/types";
import { getTopOwners } from "./topOwners";

const rows: CsvRow[] = [
  { Owner: "Alex", Revenue: "1000" },
  { Owner: "Alex", Revenue: "500" },
  { Owner: "Sam", Revenue: "2000" },
];

describe("getTopOwners", () => {
  it("is unavailable when no owner column is mapped", () => {
    expect(getTopOwners(rows, null, "Revenue")).toEqual({ available: false });
  });

  it("ranks owners by lead count and sums revenue when mapped", () => {
    expect(getTopOwners(rows, "Owner", "Revenue")).toEqual({
      available: true,
      value: [
        { owner: "Alex", count: 2, revenue: 1500 },
        { owner: "Sam", count: 1, revenue: 2000 },
      ],
    });
  });

  it("reports revenue as null per owner when revenue isn't mapped", () => {
    expect(getTopOwners(rows, "Owner", null)).toEqual({
      available: true,
      value: [
        { owner: "Alex", count: 2, revenue: null },
        { owner: "Sam", count: 1, revenue: null },
      ],
    });
  });
});
