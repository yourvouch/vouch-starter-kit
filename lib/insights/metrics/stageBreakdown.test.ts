import { describe, expect, it } from "vitest";
import type { CsvRow } from "@/lib/upload/types";
import { getPipelineByStage, getRevenueByStage } from "./stageBreakdown";

const rows: CsvRow[] = [
  { Stage: "Negotiation", Revenue: "1000" },
  { Stage: "Negotiation", Revenue: "500" },
  { Stage: "Closed Won", Revenue: "2000" },
  { Stage: "", Revenue: "100" },
];

describe("getPipelineByStage", () => {
  it("is unavailable when no stage column is mapped", () => {
    expect(getPipelineByStage(rows, null)).toEqual({ available: false });
  });

  it("counts leads per stage, grouping blanks as Unspecified", () => {
    const result = getPipelineByStage(rows, "Stage");
    expect(result).toEqual({
      available: true,
      value: [
        { stage: "Negotiation", count: 2 },
        { stage: "Closed Won", count: 1 },
        { stage: "Unspecified", count: 1 },
      ],
    });
  });
});

describe("getRevenueByStage", () => {
  it("is unavailable when stage or revenue column is missing", () => {
    expect(getRevenueByStage(rows, null, "Revenue")).toEqual({ available: false });
    expect(getRevenueByStage(rows, "Stage", null)).toEqual({ available: false });
  });

  it("sums revenue per stage, sorted descending", () => {
    const result = getRevenueByStage(rows, "Stage", "Revenue");
    expect(result).toEqual({
      available: true,
      value: [
        { stage: "Closed Won", revenue: 2000 },
        { stage: "Negotiation", revenue: 1500 },
        { stage: "Unspecified", revenue: 100 },
      ],
    });
  });
});
