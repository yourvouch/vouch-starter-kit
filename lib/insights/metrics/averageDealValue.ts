import { parseNumericValue } from "@/lib/insights/parseNumber";
import { metricAvailable, metricUnavailable, type Metric } from "@/lib/insights/types";
import type { CsvRow } from "@/lib/upload/types";

export function getAverageDealValue(
  rows: CsvRow[],
  revenueHeader: string | null,
): Metric<number> {
  if (!revenueHeader) return metricUnavailable;

  const values = rows
    .map((row) => parseNumericValue(row[revenueHeader]))
    .filter((value): value is number => value !== null);

  if (values.length === 0) return metricAvailable(0);

  const total = values.reduce((sum, value) => sum + value, 0);
  return metricAvailable(total / values.length);
}
