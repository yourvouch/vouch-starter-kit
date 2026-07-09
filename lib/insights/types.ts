export const NOT_AVAILABLE_LABEL = "Not Available";

export type Metric<T> = { available: true; value: T } | { available: false };

export function metricAvailable<T>(value: T): Metric<T> {
  return { available: true, value };
}

export const metricUnavailable: Metric<never> = { available: false };

export interface StageBucket {
  stage: string;
  count: number;
}

export interface StageRevenueBucket {
  stage: string;
  revenue: number;
}

export interface LeadSourceBucket {
  source: string;
  count: number;
}

export interface OwnerBucket {
  owner: string;
  count: number;
  revenue: number | null;
}

export interface DashboardMetrics {
  totalLeads: number;
  totalRevenue: Metric<number>;
  averageDealValue: Metric<number>;
  pipelineByStage: Metric<StageBucket[]>;
  missingEmailCount: Metric<number>;
  missingPhoneCount: Metric<number>;
  missingOwnerCount: Metric<number>;
  duplicateEmailCount: Metric<number>;
  duplicatePhoneCount: Metric<number>;
  topLeadSources: Metric<LeadSourceBucket[]>;
  topOwners: Metric<OwnerBucket[]>;
  revenueByStage: Metric<StageRevenueBucket[]>;
}

export interface InsightSummary {
  summaryText: string;
  goingWell: string[];
  needsAttention: string[];
  todaysPriority: string;
  additionalRecommendations: string[];
}
