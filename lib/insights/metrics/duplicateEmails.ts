import { metricAvailable, metricUnavailable, type Metric } from "@/lib/insights/types";
import type { CsvRow } from "@/lib/upload/types";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function getDuplicateEmailCount(
  rows: CsvRow[],
  emailHeader: string | null,
): Metric<number> {
  if (!emailHeader) return metricUnavailable;

  const occurrences = new Map<string, number>();
  for (const row of rows) {
    const raw = row[emailHeader]?.trim();
    if (!raw) continue;
    const key = normalizeEmail(raw);
    occurrences.set(key, (occurrences.get(key) ?? 0) + 1);
  }

  const duplicateCount = Array.from(occurrences.values())
    .filter((count) => count > 1)
    .reduce((sum, count) => sum + (count - 1), 0);

  return metricAvailable(duplicateCount);
}
