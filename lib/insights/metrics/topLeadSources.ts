import { metricAvailable, metricUnavailable, type LeadSourceBucket, type Metric } from "@/lib/insights/types";
import type { CsvRow } from "@/lib/upload/types";

const DEFAULT_LIMIT = 5;
const UNSPECIFIED_SOURCE = "Unspecified";

export function getTopLeadSources(
  rows: CsvRow[],
  leadSourceHeader: string | null,
  limit = DEFAULT_LIMIT,
): Metric<LeadSourceBucket[]> {
  if (!leadSourceHeader) return metricUnavailable;

  const counts = new Map<string, number>();
  for (const row of rows) {
    const raw = row[leadSourceHeader]?.trim();
    const source = raw ? raw : UNSPECIFIED_SOURCE;
    counts.set(source, (counts.get(source) ?? 0) + 1);
  }

  const result = Array.from(counts.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return metricAvailable(result);
}
