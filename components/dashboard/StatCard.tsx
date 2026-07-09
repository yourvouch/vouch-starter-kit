import { formatNumber } from "@/lib/insights/format";
import { NOT_AVAILABLE_LABEL, type Metric } from "@/lib/insights/types";

interface StatCardProps {
  label: string;
  value: number | Metric<number>;
  format?: (value: number) => string;
  helperText?: string;
  unavailableMessage?: string;
}

export function StatCard({
  label,
  value,
  format = formatNumber,
  helperText,
  unavailableMessage,
}: StatCardProps) {
  const isAvailable = typeof value === "number" || value.available;
  const numericValue = typeof value === "number" ? value : value.available ? value.value : null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 print:break-inside-avoid dark:border-zinc-800 dark:bg-zinc-900/40">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      {isAvailable && numericValue !== null ? (
        <>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            {format(numericValue)}
          </p>
          {helperText && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{helperText}</p>
          )}
        </>
      ) : (
        <p className="mt-2 text-sm font-medium text-zinc-400 dark:text-zinc-600">
          {unavailableMessage ?? NOT_AVAILABLE_LABEL}
        </p>
      )}
    </div>
  );
}
