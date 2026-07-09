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
  duplicateEmailCount: { available: true, value: 0 },
  duplicatePhoneCount: { available: true, value: 0 },
  topLeadSources: { available: true, value: [{ source: "Meta Ads", count: 35 }] },
  topOwners: { available: true, value: [{ owner: "Alex", count: 42, revenue: 500000 }] },
  revenueByStage: { available: true, value: [{ stage: "Negotiation", revenue: 1000000 }] },
};

describe("buildInsightSummary", () => {
  it("builds a plain-English summary sentence when all key metrics are available", () => {
    const summary = buildInsightSummary(fullMetrics);

    expect(summary.summaryText).toBe(
      "Your CSV has 100 leads worth ₹15,31,50,000 across 12 pipeline stages.",
    );
    expect(summary.observations).toContain(
      "Revenue data is available and shows total pipeline value of ₹15,31,50,000.",
    );
  });

  it("clearly flags an unmapped email column instead of guessing", () => {
    const metrics: DashboardMetrics = {
      ...fullMetrics,
      missingEmailCount: { available: false },
      duplicateEmailCount: { available: false },
    };

    const summary = buildInsightSummary(metrics);

    expect(summary.observations).toContain(
      "Email data is not available because the email column was not mapped.",
    );
  });

  it("reports no duplicate phone numbers when the count is zero", () => {
    const summary = buildInsightSummary(fullMetrics);

    expect(summary.observations).toContain("No duplicate phone numbers were found.");
  });

  it("omits the revenue clause and flags revenue as unavailable when it isn't mapped", () => {
    const metrics: DashboardMetrics = {
      ...fullMetrics,
      totalRevenue: { available: false },
      averageDealValue: { available: false },
    };

    const summary = buildInsightSummary(metrics);

    expect(summary.summaryText).toBe("Your CSV has 100 leads across 12 pipeline stages.");
    expect(summary.observations).toContain(
      "Revenue data is not available because the revenue column was not mapped.",
    );
  });

  it("names the top lead source and top owner in observations", () => {
    const summary = buildInsightSummary(fullMetrics);

    expect(summary.observations).toContain("Meta Ads is the top lead source with 35 leads.");
    expect(summary.observations).toContain("Alex is the top owner with 42 leads.");
  });

  it("only recommends cleaning contact details when something is actually missing", () => {
    const cleanSummary = buildInsightSummary(fullMetrics);
    expect(cleanSummary.nextActions).not.toContain(
      "Clean missing contact details before running follow-ups.",
    );

    const dirtyMetrics: DashboardMetrics = {
      ...fullMetrics,
      missingEmailCount: { available: true, value: 3 },
    };
    const dirtySummary = buildInsightSummary(dirtyMetrics);
    expect(dirtySummary.nextActions).toContain(
      "Clean missing contact details before running follow-ups.",
    );
  });
});
