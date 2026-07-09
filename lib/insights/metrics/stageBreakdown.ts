import { parseNumericValue } from "@/lib/insights/parseNumber";
import {
  metricAvailable,
  metricUnavailable,
  type Metric,
  type StageBucket,
  type StageRevenueBucket,
} from "@/lib/insights/types";
import type { CsvRow } from "@/lib/upload/types";

const UNSPECIFIED_STAGE = "Unspecified";

function groupByStage(rows: CsvRow[], stageHeader: string, revenueHeader: string | null) {
  const buckets = new Map<string, { count: number; revenue: number }>();

  for (const row of rows) {
    const rawStage = row[stageHeader]?.trim();
    const stage = rawStage ? rawStage : UNSPECIFIED_STAGE;
    const bucket = buckets.get(stage) ?? { count: 0, revenue: 0 };

    bucket.count += 1;
    if (revenueHeader) {
      const value = parseNumericValue(row[revenueHeader]);
      if (value !== null) bucket.revenue += value;
    }

    buckets.set(stage, bucket);
  }

  return buckets;
}

export function getPipelineByStage(
  rows: CsvRow[],
  stageHeader: string | null,
): Metric<StageBucket[]> {
  if (!stageHeader) return metricUnavailable;

  const buckets = groupByStage(rows, stageHeader, null);
  const result: StageBucket[] = Array.from(buckets.entries())
    .map(([stage, { count }]) => ({ stage, count }))
    .sort((a, b) => b.count - a.count);

  return metricAvailable(result);
}

export function getRevenueByStage(
  rows: CsvRow[],
  stageHeader: string | null,
  revenueHeader: string | null,
): Metric<StageRevenueBucket[]> {
  if (!stageHeader || !revenueHeader) return metricUnavailable;

  const buckets = groupByStage(rows, stageHeader, revenueHeader);
  const result: StageRevenueBucket[] = Array.from(buckets.entries())
    .map(([stage, { revenue }]) => ({ stage, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  return metricAvailable(result);
}
