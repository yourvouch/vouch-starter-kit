import { formatCurrency, formatNumber } from "./format";
import type { DashboardMetrics, InsightSummary } from "./types";

function choose(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

function buildSummaryText(metrics: DashboardMetrics): string {
  const parts: string[] = [
    `Your CSV has ${formatNumber(metrics.totalLeads)} ${choose(metrics.totalLeads, "lead", "leads")}`,
  ];

  if (metrics.totalRevenue.available) {
    parts.push(`worth ${formatCurrency(metrics.totalRevenue.value)}`);
  }

  if (metrics.pipelineByStage.available) {
    const stageCount = metrics.pipelineByStage.value.length;
    parts.push(`across ${formatNumber(stageCount)} pipeline ${choose(stageCount, "stage", "stages")}`);
  }

  return `${parts.join(" ")}.`;
}

function buildRevenueObservation(metrics: DashboardMetrics): string {
  if (!metrics.totalRevenue.available) {
    return "Revenue data is not available because the revenue column was not mapped.";
  }

  return `Revenue data is available and shows total pipeline value of ${formatCurrency(metrics.totalRevenue.value)}.`;
}

function buildEmailObservations(metrics: DashboardMetrics): string[] {
  if (!metrics.missingEmailCount.available) {
    return ["Email data is not available because the email column was not mapped."];
  }

  const observations: string[] = [];
  const missing = metrics.missingEmailCount.value;
  observations.push(
    missing === 0
      ? "All leads have an email on file."
      : `${formatNumber(missing)} ${choose(missing, "lead is", "leads are")} missing an email address.`,
  );

  if (metrics.duplicateEmailCount.available) {
    const duplicates = metrics.duplicateEmailCount.value;
    observations.push(
      duplicates === 0
        ? "No duplicate email addresses were found."
        : `${formatNumber(duplicates)} duplicate email ${choose(duplicates, "address was", "addresses were")} found.`,
    );
  }

  return observations;
}

function buildPhoneObservations(metrics: DashboardMetrics): string[] {
  if (!metrics.missingPhoneCount.available) {
    return ["Phone data is not available because the phone column was not mapped."];
  }

  const observations: string[] = [];
  const missing = metrics.missingPhoneCount.value;
  observations.push(
    missing === 0
      ? "All leads have a phone number on file."
      : `${formatNumber(missing)} ${choose(missing, "lead is", "leads are")} missing a phone number.`,
  );

  if (metrics.duplicatePhoneCount.available) {
    const duplicates = metrics.duplicatePhoneCount.value;
    observations.push(
      duplicates === 0
        ? "No duplicate phone numbers were found."
        : `${formatNumber(duplicates)} duplicate phone ${choose(duplicates, "number was", "numbers were")} found.`,
    );
  }

  return observations;
}

function buildLeadSourceObservation(metrics: DashboardMetrics): string {
  if (!metrics.topLeadSources.available) {
    return "Lead source data is not available because the lead source column was not mapped.";
  }

  const [topSource] = metrics.topLeadSources.value;
  if (!topSource) {
    return "No lead source data was found.";
  }

  return `${topSource.source} is the top lead source with ${formatNumber(topSource.count)} ${choose(topSource.count, "lead", "leads")}.`;
}

function buildOwnerObservation(metrics: DashboardMetrics): string {
  if (!metrics.topOwners.available) {
    return "Owner data is not available because the owner column was not mapped.";
  }

  const [topOwner] = metrics.topOwners.value;
  if (!topOwner) {
    return "No owner data was found.";
  }

  return `${topOwner.owner} is the top owner with ${formatNumber(topOwner.count)} ${choose(topOwner.count, "lead", "leads")}.`;
}

function buildObservations(metrics: DashboardMetrics): string[] {
  return [
    buildRevenueObservation(metrics),
    ...buildEmailObservations(metrics),
    ...buildPhoneObservations(metrics),
    buildLeadSourceObservation(metrics),
    buildOwnerObservation(metrics),
  ];
}

function buildNextActions(metrics: DashboardMetrics): string[] {
  const actions: string[] = [];

  if (metrics.revenueByStage.available && metrics.revenueByStage.value.length > 0) {
    actions.push("Review the highest-value pipeline stages first.");
  }

  const hasMissingContactInfo =
    (metrics.missingEmailCount.available && metrics.missingEmailCount.value > 0) ||
    (metrics.missingPhoneCount.available && metrics.missingPhoneCount.value > 0);
  if (hasMissingContactInfo) {
    actions.push("Clean missing contact details before running follow-ups.");
  }

  if (metrics.topLeadSources.available && metrics.topLeadSources.value.length > 0) {
    actions.push("Check the top lead source and compare it with conversion quality.");
  }

  if (metrics.topOwners.available && metrics.topOwners.value.length > 0) {
    actions.push("Review owner workload distribution before assigning new leads.");
  }

  return actions;
}

export function buildInsightSummary(metrics: DashboardMetrics): InsightSummary {
  return {
    summaryText: buildSummaryText(metrics),
    observations: buildObservations(metrics),
    nextActions: buildNextActions(metrics),
  };
}
