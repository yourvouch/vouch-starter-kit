import { describe, expect, it } from "vitest";
import type { ColumnMapping, CsvRow } from "@/lib/upload/types";
import { buildDashboardMetrics } from "./buildDashboardMetrics";

const rows: CsvRow[] = [
  {
    Name: "Jane Doe",
    Email: "jane@example.com",
    Phone: "555-1234",
    Revenue: "4500",
    Stage: "Negotiation",
    Owner: "Alex",
    Source: "Referral",
  },
  {
    Name: "John Smith",
    Email: "",
    Phone: "555-5678",
    Revenue: "1200",
    Stage: "Closed Won",
    Owner: "Sam",
    Source: "Website",
  },
];

const fullMapping: ColumnMapping = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  revenue: "Revenue",
  stage: "Stage",
  owner: "Owner",
  leadSource: "Source",
  date: null,
};

describe("buildDashboardMetrics", () => {
  it("computes every metric when all relevant columns are mapped", () => {
    const metrics = buildDashboardMetrics(rows, fullMapping);

    expect(metrics.totalLeads).toBe(2);
    expect(metrics.totalRevenue).toEqual({ available: true, value: 5700 });
    expect(metrics.averageDealValue).toEqual({ available: true, value: 2850 });
    expect(metrics.missingEmailCount).toEqual({ available: true, value: 1 });
    expect(metrics.missingPhoneCount).toEqual({ available: true, value: 0 });
    expect(metrics.missingOwnerCount).toEqual({ available: true, value: 0 });
    expect(metrics.duplicateEmailCount).toEqual({ available: true, value: 0 });
    expect(metrics.pipelineByStage.available).toBe(true);
    expect(metrics.revenueByStage.available).toBe(true);
    expect(metrics.topLeadSources.available).toBe(true);
    expect(metrics.topOwners.available).toBe(true);
  });

  it("falls back to Not Available for every metric tied to an unmapped column", () => {
    const partialMapping: ColumnMapping = {
      name: null,
      email: null,
      phone: null,
      revenue: null,
      stage: null,
      owner: null,
      leadSource: null,
      date: null,
    };

    const metrics = buildDashboardMetrics(rows, partialMapping);

    expect(metrics.totalLeads).toBe(2);
    expect(metrics.totalRevenue).toEqual({ available: false });
    expect(metrics.averageDealValue).toEqual({ available: false });
    expect(metrics.pipelineByStage).toEqual({ available: false });
    expect(metrics.missingEmailCount).toEqual({ available: false });
    expect(metrics.missingPhoneCount).toEqual({ available: false });
    expect(metrics.missingOwnerCount).toEqual({ available: false });
    expect(metrics.duplicateEmailCount).toEqual({ available: false });
    expect(metrics.duplicatePhoneCount).toEqual({ available: false });
    expect(metrics.topLeadSources).toEqual({ available: false });
    expect(metrics.topOwners).toEqual({ available: false });
    expect(metrics.revenueByStage).toEqual({ available: false });
  });
});
