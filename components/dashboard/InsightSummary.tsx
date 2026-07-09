import type { InsightSummary as InsightSummaryData } from "@/lib/insights/types";

interface InsightSummaryProps {
  summary: InsightSummaryData;
}

export function InsightSummary({ summary }: InsightSummaryProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Insight Summary</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {summary.summaryText}
      </p>

      {summary.observations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Observations</h3>
          <ul className="mt-3 space-y-2">
            {summary.observations.map((observation) => (
              <li
                key={observation}
                className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-emerald-500"
                />
                <span>{observation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.nextActions.length > 0 && (
        <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Recommended Next Actions
          </h3>
          <ol className="mt-3 space-y-2">
            {summary.nextActions.map((action, index) => (
              <li
                key={action}
                className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                  {index + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
