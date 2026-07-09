import { describe, expect, it } from "vitest";
import type { ColumnMapping } from "@/lib/upload/types";
import { buildBusinessHealth } from "./buildBusinessHealth";
import type { DashboardMetrics } from "./types";

const fullMapping: ColumnMapping = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  revenue: "Revenue",
  stage: "Stage",
  owner: "Owner",
  leadSource: "Source",
  date: "Date",
};

const healthyMetrics: DashboardMetrics = {
  totalLeads: 100,
  totalRevenue: { available: true, value: 153150000 },
  averageDealValue: { available: true, value: 1531500 },
  pipelineByStage: { available: true, value: [{ stage: "Negotiation", count: 100 }] },
  missingEmailCount: { available: true, value: 0 },
  missingPhoneCount: { available: true, value: 0 },
  missingOwnerCount: { available: true, value: 0 },
  duplicateEmailCount: { available: true, value: 0 },
  duplicatePhoneCount: { available: true, value: 0 },
  topLeadSources: { available: true, value: [{ source: "Meta Ads", count: 35 }] },
  topOwners: { available: true, value: [{ owner: "Alex", count: 42, revenue: 500000 }] },
  revenueByStage: { available: true, value: [{ stage: "Negotiation", revenue: 1000000 }] },
};

function findItem(items: ReturnType<typeof buildBusinessHealth>, label: string) {
  const item = items.find((entry) => entry.label === label);
  if (!item) throw new Error(`Missing health item: ${label}`);
  return item;
}

describe("buildBusinessHealth", () => {
  it("marks every card as good when the dataset is clean and fully mapped", () => {
    const items = buildBusinessHealth(healthyMetrics, fullMapping);

    expect(findItem(items, "Pipeline Value").status).toBe("good");
    expect(findItem(items, "Contact Quality").status).toBe("good");
    expect(findItem(items, "Data Completeness").status).toBe("good");
    expect(findItem(items, "Owner Coverage").status).toBe("good");
    expect(findItem(items, "Revenue Visibility").status).toBe("good");
  });

  it("marks Pipeline Value and Revenue Visibility unavailable when revenue isn't mapped", () => {
    const metrics: DashboardMetrics = {
      ...healthyMetrics,
      totalRevenue: { available: false },
      averageDealValue: { available: false },
      revenueByStage: { available: false },
    };

    const items = buildBusinessHealth(metrics, fullMapping);

    expect(findItem(items, "Pipeline Value").status).toBe("unavailable");
    expect(findItem(items, "Revenue Visibility").status).toBe("unavailable");
  });

  it("flags Contact Quality as needing attention when contacts are missing or duplicated", () => {
    const metrics: DashboardMetrics = {
      ...healthyMetrics,
      missingEmailCount: { available: true, value: 4 },
    };

    const items = buildBusinessHealth(metrics, fullMapping);

    expect(findItem(items, "Contact Quality").status).toBe("attention");
  });

  it("flags Owner Coverage as needing attention when leads are unassigned", () => {
    const metrics: DashboardMetrics = {
      ...healthyMetrics,
      missingOwnerCount: { available: true, value: 3 },
    };

    const items = buildBusinessHealth(metrics, fullMapping);

    expect(findItem(items, "Owner Coverage").status).toBe("attention");
  });

  it("marks Owner Coverage unavailable when the owner column isn't mapped", () => {
    const metrics: DashboardMetrics = {
      ...healthyMetrics,
      topOwners: { available: false },
      missingOwnerCount: { available: false },
    };

    const items = buildBusinessHealth(metrics, fullMapping);

    expect(findItem(items, "Owner Coverage").status).toBe("unavailable");
  });

  it("flags Data Completeness as needing attention when fewer than 6 fields are mapped", () => {
    const partialMapping: ColumnMapping = {
      name: "Name",
      email: "Email",
      phone: null,
      revenue: null,
      stage: null,
      owner: null,
      leadSource: null,
      date: null,
    };

    const items = buildBusinessHealth(healthyMetrics, partialMapping);

    expect(findItem(items, "Data Completeness").status).toBe("attention");
    expect(findItem(items, "Data Completeness").detail).toBe("2 of 8 fields mapped");
  });
});
