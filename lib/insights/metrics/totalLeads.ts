import type { CsvRow } from "@/lib/upload/types";

export function getTotalLeads(rows: CsvRow[]): number {
  return rows.length;
}
