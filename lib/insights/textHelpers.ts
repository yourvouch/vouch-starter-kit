import type { Metric } from "./types";

export function choose(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function valueOrZero(metric: Metric<number>): number {
  return metric.available ? metric.value : 0;
}
