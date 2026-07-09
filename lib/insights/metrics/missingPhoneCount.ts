import { metricAvailable, metricUnavailable, type Metric } from "@/lib/insights/types";
import type { CsvRow } from "@/lib/upload/types";

export function getMissingPhoneCount(
  rows: CsvRow[],
  phoneHeader: string | null,
): Metric<number> {
  if (!phoneHeader) return metricUnavailable;

  const missing = rows.filter((row) => !row[phoneHeader]?.trim()).length;
  return metricAvailable(missing);
}
