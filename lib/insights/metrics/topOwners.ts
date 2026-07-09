import { parseNumericValue } from "@/lib/insights/parseNumber";
import { metricAvailable, metricUnavailable, type Metric, type OwnerBucket } from "@/lib/insights/types";
import type { CsvRow } from "@/lib/upload/types";

const DEFAULT_LIMIT = 5;
const UNASSIGNED_OWNER = "Unassigned";

export function getTopOwners(
  rows: CsvRow[],
  ownerHeader: string | null,
  revenueHeader: string | null,
  limit = DEFAULT_LIMIT,
): Metric<OwnerBucket[]> {
  if (!ownerHeader) return metricUnavailable;

  const buckets = new Map<string, { count: number; revenue: number | null }>();

  for (const row of rows) {
    const raw = row[ownerHeader]?.trim();
    const owner = raw ? raw : UNASSIGNED_OWNER;
    const bucket = buckets.get(owner) ?? { count: 0, revenue: revenueHeader ? 0 : null };

    bucket.count += 1;
    if (revenueHeader) {
      const value = parseNumericValue(row[revenueHeader]);
      if (value !== null) bucket.revenue = (bucket.revenue ?? 0) + value;
    }

    buckets.set(owner, bucket);
  }

  const result: OwnerBucket[] = Array.from(buckets.entries())
    .map(([owner, { count, revenue }]) => ({ owner, count, revenue }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return metricAvailable(result);
}
