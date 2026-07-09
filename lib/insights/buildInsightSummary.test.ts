import { describe, expect, it } from "vitest";
import { buildInsightSummary } from "./buildInsightSummary";
import type { DashboardMetrics } from "./types";

const fullMetrics: DashboardMetrics = {
  totalLeads: 100,
  totalRevenue: { available: true, value: 153150000 },
  averageDealValue: { available: true, value: 1531500 },
  pipelineByStage: {
    available: true,
    value: Array.from({ length: 12 }, (_, index) => ({ stage: `Stage ${index + 1}`, count: 1 })),
  },
  missingEmailCount: { available: true, value: 0 },
  missingPhoneCount: { available: true, value: 0 },
  missingOwnerCount: { available: true, value: 0 },
  duplicateEmailCount: { available: true, value: 0 },
  duplicatePhoneCount: { available: true, value: 0 },
  topLeadSources: { available: true, value: [{ source: "Meta Ads", count: 35 }] },
  topOwners: { available: true, value: [{ owner: "Alex", count: 42, revenue: 500000 }] },
  revenueByStage: { available: true, value: [{ stage: "Negotiation", revenue: 1000000 }] },
};

describe("buildInsightSummary", () => {
  it("builds a plain-English executive summary sentence when all key metrics are available", () => {
    const summary = buildInsightSummary(fullMetrics);

    expect(summary.summaryText).toBe(
      "This dataset contains 100 leads with a total pipeline value of ₹15,31,50,000 across 12 sales stages.",
    );
  });

  it("puts healthy metrics under goingWell and flags an unmapped email column under needsAttention", () => {
    const summary = buildInsightSummary(fullMetrics);

    expect(summary.goingWell).toContain(
      "Revenue data is available, showing a total pipeline value of ₹15,31,50,000.",
    );
    expect(summary.goingWell).toContain("No duplicate phone numbers detected.");

    const metrics: DashboardMetrics = {
      ...fullMetrics,
      missingEmailCount: { available: false },
      duplicateEmailCount: { available: false },
    };
    const summaryWithUnmappedEmail = buildInsightSummary(metrics);
    expect(summaryWithUnmappedEmail.needsAttention).toContain(
      "Email data is unavailable because the Email column was not mapped.",
    );
  });

  it("omits the revenue clause and flags revenue as unavailable when it isn't mapped", () => {
    const metrics: DashboardMetrics = {
      ...fullMetrics,
      totalRevenue: { available: false },
      averageDealValue: { available: false },
    };

    const summary = buildInsightSummary(metrics);

    expect(summary.summaryText).toBe("This dataset contains 100 leads across 12 sales stages.");
    expect(summary.needsAttention).toContain(
      "Revenue data is unavailable because the Revenue column was not mapped.",
    );
  });

  it("names the top lead source and top owner as going-well observations", () => {
    const summary = buildInsightSummary(fullMetrics);

    expect(summary.goingWell).toContain("Meta Ads is the top lead source with 35 leads.");
    expect(summary.goingWell).toContain("Alex is the top owner with 42 leads.");
  });

  it("promotes exactly one recommendation to Today's Priority and keeps the rest as additional", () => {
    const summary = buildInsightSummary(fullMetrics);

    expect(summary.todaysPriority).toBe("Review the highest-value pipeline stages first.");
    expect(summary.additionalRecommendations).not.toContain(summary.todaysPriority);
    expect(summary.additionalRecommendations).toContain(
      "Check the top lead source and compare it with conversion quality.",
    );
  });

  it("prioritizes capturing missing emails over a healthy pipeline recommendation", () => {
    const metrics: DashboardMetrics = {
      ...fullMetrics,
      missingEmailCount: { available: true, value: 5 },
    };

    const summary = buildInsightSummary(metrics);

    expect(summary.todaysPriority).toBe("Capture email addresses for future customer communication.");
  });

  it("falls back to a healthy status message when nothing needs action", () => {
    const metrics: DashboardMetrics = {
      ...fullMetrics,
      revenueByStage: { available: false },
      topLeadSources: { available: false },
      topOwners: { available: false },
    };

    const summary = buildInsightSummary(metrics);

    expect(summary.todaysPriority).toBe(
      "Your data looks healthy — keep monitoring lead quality and follow-ups.",
    );
    expect(summary.additionalRecommendations).toEqual([]);
  });
});
