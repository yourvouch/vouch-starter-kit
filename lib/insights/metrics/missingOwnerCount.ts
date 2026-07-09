import { metricAvailable, metricUnavailable, type Metric } from "@/lib/insights/types";
import type { CsvRow } from "@/lib/upload/types";

export function getMissingOwnerCount(
  rows: CsvRow[],
  ownerHeader: string | null,
): Metric<number> {
  if (!ownerHeader) return metricUnavailable;

  const missing = rows.filter((row) => !row[ownerHeader]?.trim()).length;
  return metricAvailable(missing);
}
