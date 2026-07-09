import { parseNumericValue } from "@/lib/insights/parseNumber";
import { metricAvailable, metricUnavailable, type Metric } from "@/lib/insights/types";
import type { CsvRow } from "@/lib/upload/types";

export function getTotalRevenue(rows: CsvRow[], revenueHeader: string | null): Metric<number> {
  if (!revenueHeader) return metricUnavailable;

  const total = rows.reduce((sum, row) => {
    const value = parseNumericValue(row[revenueHeader]);
    return value !== null ? sum + value : sum;
  }, 0);

  return metricAvailable(total);
}
