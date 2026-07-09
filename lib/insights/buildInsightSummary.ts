import { formatCurrency, formatNumber } from "./format";
import { choose, valueOrZero } from "./textHelpers";
import type { DashboardMetrics, InsightSummary } from "./types";

interface ObservationGroup {
  goingWell: string[];
  needsAttention: string[];
}

function buildSummaryText(metrics: DashboardMetrics): string {
  const parts: string[] = [
    `This dataset contains ${formatNumber(metrics.totalLeads)} ${choose(metrics.totalLeads, "lead", "leads")}`,
  ];

  if (metrics.totalRevenue.available) {
    parts.push(`with a total pipeline value of ${formatCurrency(metrics.totalRevenue.value)}`);
  }

  if (metrics.pipelineByStage.available) {
    const stageCount = metrics.pipelineByStage.value.length;
    parts.push(`across ${formatNumber(stageCount)} sales ${choose(stageCount, "stage", "stages")}`);
  }

  return `${parts.join(" ")}.`;
}

function buildRevenueItems(metrics: DashboardMetrics): ObservationGroup {
  if (!metrics.totalRevenue.available) {
    return {
      goingWell: [],
      needsAttention: ["Revenue data is unavailable because the Revenue column was not mapped."],
    };
  }

  return {
    goingWell: [
      `Revenue data is available, showing a total pipeline value of ${formatCurrency(metrics.totalRevenue.value)}.`,
    ],
    needsAttention: [],
  };
}

function buildEmailItems(metrics: DashboardMetrics): ObservationGroup {
  if (!metrics.missingEmailCount.available) {
    return {
      goingWell: [],
      needsAttention: ["Email data is unavailable because the Email column was not mapped."],
    };
  }

  const goingWell: string[] = [];
  const needsAttention: string[] = [];

  const missing = metrics.missingEmailCount.value;
  if (missing === 0) {
    goingWell.push("All leads have an email address on file.");
  } else {
    needsAttention.push(
      `${formatNumber(missing)} ${choose(missing, "lead is", "leads are")} missing an email address.`,
    );
  }

  if (metrics.duplicateEmailCount.available) {
    const duplicates = metrics.duplicateEmailCount.value;
    if (duplicates === 0) {
      goingWell.push("No duplicate email addresses detected.");
    } else {
      needsAttention.push(
        `${formatNumber(duplicates)} duplicate email ${choose(duplicates, "address was", "addresses were")} detected.`,
      );
    }
  }

  return { goingWell, needsAttention };
}

function buildPhoneItems(metrics: DashboardMetrics): ObservationGroup {
  if (!metrics.missingPhoneCount.available) {
    return {
      goingWell: [],
      needsAttention: ["Phone data is unavailable because the Phone column was not mapped."],
    };
  }

  const goingWell: string[] = [];
  const needsAttention: string[] = [];

  const missing = metrics.missingPhoneCount.value;
  if (missing === 0) {
    goingWell.push("All leads have a phone number on file.");
  } else {
    needsAttention.push(
      `${formatNumber(missing)} ${choose(missing, "lead is", "leads are")} missing a phone number.`,
    );
  }

  if (metrics.duplicatePhoneCount.available) {
    const duplicates = metrics.duplicatePhoneCount.value;
    if (duplicates === 0) {
      goingWell.push("No duplicate phone numbers detected.");
    } else {
      needsAttention.push(
        `${formatNumber(duplicates)} duplicate phone ${choose(duplicates, "number was", "numbers were")} detected.`,
      );
    }
  }

  return { goingWell, needsAttention };
}

function buildLeadSourceItems(metrics: DashboardMetrics): ObservationGroup {
  if (!metrics.topLeadSources.available) {
    return {
      goingWell: [],
      needsAttention: [
        "Lead source data is unavailable because the Lead Source column was not mapped.",
      ],
    };
  }

  const [topSource] = metrics.topLeadSources.value;
  if (!topSource) {
    return { goingWell: [], needsAttention: ["No lead source data was found."] };
  }

  return {
    goingWell: [
      `${topSource.source} is the top lead source with ${formatNumber(topSource.count)} ${choose(topSource.count, "lead", "leads")}.`,
    ],
    needsAttention: [],
  };
}

function buildOwnerItems(metrics: DashboardMetrics): ObservationGroup {
  if (!metrics.topOwners.available) {
    return {
      goingWell: [],
      needsAttention: ["Owner data is unavailable because the Owner column was not mapped."],
    };
  }

  const goingWell: string[] = [];
  const needsAttention: string[] = [];

  const [topOwner] = metrics.topOwners.value;
  if (topOwner) {
    goingWell.push(
      `${topOwner.owner} is the top owner with ${formatNumber(topOwner.count)} ${choose(topOwner.count, "lead", "leads")}.`,
    );
  }

  if (metrics.missingOwnerCount.available) {
    const missing = metrics.missingOwnerCount.value;
    if (missing === 0) {
      goingWell.push("Every lead has an assigned owner.");
    } else {
      needsAttention.push(
        `${formatNumber(missing)} ${choose(missing, "lead is", "leads are")} unassigned.`,
      );
    }
  }

  return { goingWell, needsAttention };
}

function buildCategorizedObservations(metrics: DashboardMetrics): ObservationGroup {
  const groups = [
    buildRevenueItems(metrics),
    buildEmailItems(metrics),
    buildPhoneItems(metrics),
    buildLeadSourceItems(metrics),
    buildOwnerItems(metrics),
  ];

  return {
    goingWell: groups.flatMap((group) => group.goingWell),
    needsAttention: groups.flatMap((group) => group.needsAttention),
  };
}

interface RecommendationCandidate {
  condition: boolean;
  text: string;
}

function buildRecommendationCandidates(metrics: DashboardMetrics): RecommendationCandidate[] {
  const missingEmail = valueOrZero(metrics.missingEmailCount);
  const missingPhone = valueOrZero(metrics.missingPhoneCount);
  const missingOwners = valueOrZero(metrics.missingOwnerCount);
  const duplicateContacts =
    valueOrZero(metrics.duplicateEmailCount) + valueOrZero(metrics.duplicatePhoneCount);
  const hasRevenueByStage =
    metrics.revenueByStage.available && metrics.revenueByStage.value.length > 0;
  const hasTopLeadSource =
    metrics.topLeadSources.available && metrics.topLeadSources.value.length > 0;
  const hasTopOwners = metrics.topOwners.available && metrics.topOwners.value.length > 0;

  return [
    {
      condition: missingEmail > 0 && missingEmail >= missingPhone,
      text: "Capture email addresses for future customer communication.",
    },
    {
      condition: missingPhone > 0 && missingPhone > missingEmail,
      text: "Capture phone numbers for future customer follow-ups.",
    },
    {
      condition: missingOwners > 0,
      text: "Assign owners to unassigned leads.",
    },
    {
      condition: duplicateContacts > 0,
      text: "Clean up duplicate contacts before your next campaign.",
    },
    {
      condition: hasRevenueByStage,
      text: "Review the highest-value pipeline stages first.",
    },
    {
      condition: hasTopLeadSource,
      text: "Check the top lead source and compare it with conversion quality.",
    },
    {
      condition: hasTopOwners,
      text: "Review owner workload distribution before assigning new leads.",
    },
  ];
}

const NOTHING_URGENT_MESSAGE =
  "Your data looks healthy — keep monitoring lead quality and follow-ups.";

function buildPriorityAndRecommendations(metrics: DashboardMetrics): {
  todaysPriority: string;
  additionalRecommendations: string[];
} {
  const candidates = buildRecommendationCandidates(metrics).filter(
    (candidate) => candidate.condition,
  );

  if (candidates.length === 0) {
    return { todaysPriority: NOTHING_URGENT_MESSAGE, additionalRecommendations: [] };
  }

  const [priority, ...rest] = candidates;
  return {
    todaysPriority: priority.text,
    additionalRecommendations: rest.map((candidate) => candidate.text),
  };
}

export function buildInsightSummary(metrics: DashboardMetrics): InsightSummary {
  const { goingWell, needsAttention } = buildCategorizedObservations(metrics);
  const { todaysPriority, additionalRecommendations } = buildPriorityAndRecommendations(metrics);

  return {
    summaryText: buildSummaryText(metrics),
    goingWell,
    needsAttention,
    todaysPriority,
    additionalRecommendations,
  };
}
