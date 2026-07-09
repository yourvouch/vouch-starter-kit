import { metricAvailable, metricUnavailable, type Metric } from "@/lib/insights/types";
import type { CsvRow } from "@/lib/upload/types";

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function getDuplicatePhoneCount(
  rows: CsvRow[],
  phoneHeader: string | null,
): Metric<number> {
  if (!phoneHeader) return metricUnavailable;

  const occurrences = new Map<string, number>();
  for (const row of rows) {
    const raw = row[phoneHeader]?.trim();
    if (!raw) continue;
    const key = normalizePhone(raw);
    if (!key) continue;
    occurrences.set(key, (occurrences.get(key) ?? 0) + 1);
  }

  const duplicateCount = Array.from(occurrences.values())
    .filter((count) => count > 1)
    .reduce((sum, count) => sum + (count - 1), 0);

  return metricAvailable(duplicateCount);
}
