import { describe, expect, it } from "vitest";
import type { BusinessHealthItem } from "./buildBusinessHealth";
import { buildTextSummary } from "./buildTextSummary";
import type { InsightSummary } from "./types";

const summary: InsightSummary = {
  summaryText:
    "This dataset contains 100 leads with a total pipeline value of ₹15,31,50,000 across 12 sales stages.",
  goingWell: ["All leads have an email address on file."],
  needsAttention: ["3 leads are missing a phone number."],
  todaysPriority: "Review the highest-value pipeline stages first.",
  additionalRecommendations: ["Check the top lead source and compare it with conversion quality."],
};

const businessHealth: BusinessHealthItem[] = [
  { label: "Pipeline Value", status: "good", detail: "₹15.32Cr" },
  { label: "Contact Quality", status: "attention", detail: "3 contact issues found" },
];

describe("buildTextSummary", () => {
  it("includes the file name and row count", () => {
    const text = buildTextSummary({ fileName: "leads.csv", rowCount: 100, summary, businessHealth });

    expect(text).toContain("File: leads.csv");
    expect(text).toContain("Rows: 100");
  });

  it("includes the executive summary sentence", () => {
    const text = buildTextSummary({ fileName: "leads.csv", rowCount: 100, summary, businessHealth });

    expect(text).toContain(summary.summaryText);
  });

  it("includes business health statuses with their labels", () => {
    const text = buildTextSummary({ fileName: "leads.csv", rowCount: 100, summary, businessHealth });

    expect(text).toContain("Pipeline Value: Good — ₹15.32Cr");
    expect(text).toContain("Contact Quality: Needs Attention — 3 contact issues found");
  });

  it("includes going well, needs attention, priority, and additional recommendations", () => {
    const text = buildTextSummary({ fileName: "leads.csv", rowCount: 100, summary, businessHealth });

    expect(text).toContain("- All leads have an email address on file.");
    expect(text).toContain("- 3 leads are missing a phone number.");
    expect(text).toContain("Review the highest-value pipeline stages first.");
    expect(text).toContain("1. Check the top lead source and compare it with conversion quality.");
  });

  it("handles empty going well, needs attention, and recommendations gracefully", () => {
    const emptySummary: InsightSummary = {
      ...summary,
      goingWell: [],
      needsAttention: [],
      additionalRecommendations: [],
    };

    const text = buildTextSummary({
      fileName: "leads.csv",
      rowCount: 100,
      summary: emptySummary,
      businessHealth,
    });

    expect(text).toContain("No items to report.");
    expect(text).toContain("No additional recommendations.");
  });
});
