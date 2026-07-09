import { TARGET_FIELDS } from "@/lib/upload/constants";
import type { ColumnMapping } from "@/lib/upload/types";
import { formatCompactCurrency, formatNumber } from "./format";
import { choose, valueOrZero } from "./textHelpers";
import type { DashboardMetrics } from "./types";

export type HealthStatus = "good" | "attention" | "unavailable";

export const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  good: "Good",
  attention: "Needs Attention",
  unavailable: "Not Available",
};

export interface BusinessHealthItem {
  label: string;
  status: HealthStatus;
  detail: string;
}

function buildPipelineValueHealth(metrics: DashboardMetrics): BusinessHealthItem {
  if (!metrics.totalRevenue.available) {
    return { label: "Pipeline Value", status: "unavailable", detail: "Revenue column not mapped" };
  }

  if (metrics.totalRevenue.value <= 0) {
    return { label: "Pipeline Value", status: "attention", detail: "No revenue recorded yet" };
  }

  return {
    label: "Pipeline Value",
    status: "good",
    detail: formatCompactCurrency(metrics.totalRevenue.value),
  };
}

function buildContactQualityHealth(metrics: DashboardMetrics): BusinessHealthItem {
  if (!metrics.missingEmailCount.available && !metrics.missingPhoneCount.available) {
    return {
      label: "Contact Quality",
      status: "unavailable",
      detail: "Email and phone columns not mapped",
    };
  }

  const issues =
    valueOrZero(metrics.missingEmailCount) +
    valueOrZero(metrics.missingPhoneCount) +
    valueOrZero(metrics.duplicateEmailCount) +
    valueOrZero(metrics.duplicatePhoneCount);

  if (issues === 0) {
    return { label: "Contact Quality", status: "good", detail: "No missing or duplicate contacts" };
  }

  return {
    label: "Contact Quality",
    status: "attention",
    detail: `${formatNumber(issues)} contact ${choose(issues, "issue", "issues")} found`,
  };
}

function buildDataCompletenessHealth(mapping: ColumnMapping): BusinessHealthItem {
  const mappedCount = TARGET_FIELDS.filter((field) => mapping[field.id]).length;
  const status: HealthStatus = mappedCount >= 6 ? "good" : "attention";

  return {
    label: "Data Completeness",
    status,
    detail: `${mappedCount} of ${TARGET_FIELDS.length} fields mapped`,
  };
}

function buildOwnerCoverageHealth(metrics: DashboardMetrics): BusinessHealthItem {
  if (!metrics.topOwners.available || !metrics.missingOwnerCount.available) {
    return { label: "Owner Coverage", status: "unavailable", detail: "Owner column not mapped" };
  }

  if (metrics.missingOwnerCount.value === 0) {
    return { label: "Owner Coverage", status: "good", detail: "Every lead has an owner" };
  }

  return {
    label: "Owner Coverage",
    status: "attention",
    detail: `${formatNumber(metrics.missingOwnerCount.value)} unassigned ${choose(metrics.missingOwnerCount.value, "lead", "leads")}`,
  };
}

function buildRevenueVisibilityHealth(metrics: DashboardMetrics): BusinessHealthItem {
  if (!metrics.revenueByStage.available) {
    return {
      label: "Revenue Visibility",
      status: "unavailable",
      detail: "Revenue or stage column not mapped",
    };
  }

  if (metrics.revenueByStage.value.length === 0) {
    return { label: "Revenue Visibility", status: "attention", detail: "No stage revenue found" };
  }

  return {
    label: "Revenue Visibility",
    status: "good",
    detail: `Revenue visible across ${formatNumber(metrics.revenueByStage.value.length)} stages`,
  };
}

export function buildBusinessHealth(
  metrics: DashboardMetrics,
  mapping: ColumnMapping,
): BusinessHealthItem[] {
  return [
    buildPipelineValueHealth(metrics),
    buildContactQualityHealth(metrics),
    buildDataCompletenessHealth(mapping),
    buildOwnerCoverageHealth(metrics),
    buildRevenueVisibilityHealth(metrics),
  ];
}
