import type { CsvRow } from "./types";

export function getSampleValues(rows: CsvRow[], header: string | null, limit = 2): string[] {
  if (!header) return [];

  const samples: string[] = [];

  for (const row of rows) {
    const value = row[header]?.trim();
    if (value) samples.push(value);
    if (samples.length >= limit) break;
  }

  return samples;
}
