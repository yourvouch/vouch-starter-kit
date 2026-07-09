import { metricAvailable, metricUnavailable, type Metric } from "@/lib/insights/types";
import type { CsvRow } from "@/lib/upload/types";

export function getMissingEmailCount(
  rows: CsvRow[],
  emailHeader: string | null,
): Metric<number> {
  if (!emailHeader) return metricUnavailable;

  const missing = rows.filter((row) => !row[emailHeader]?.trim()).length;
  return metricAvailable(missing);
}
