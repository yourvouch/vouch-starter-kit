import { formatNumber } from "@/lib/insights/format";
import { NOT_AVAILABLE_LABEL, type Metric } from "@/lib/insights/types";

interface StatCardProps {
  label: string;
  value: number | Metric<number>;
  format?: (value: number) => string;
}

export function StatCard({ label, value, format = formatNumber }: StatCardProps) {
  const display =
    typeof value === "number"
      ? format(value)
      : value.available
        ? format(value.value)
        : NOT_AVAILABLE_LABEL;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        {display}
      </p>
    </div>
  );
}
