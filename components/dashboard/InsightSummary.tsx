import type { InsightSummary as InsightSummaryData } from "@/lib/insights/types";

interface InsightSummaryProps {
  summary: InsightSummaryData;
}

export function InsightSummary({ summary }: InsightSummaryProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 print:break-inside-avoid sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/40">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Executive Summary
      </h2>
      <p className="mt-3 text-xl leading-8 font-semibold text-balance text-zinc-900 sm:text-2xl sm:leading-9 dark:text-white">
        {summary.summaryText}
      </p>

      <div className="mt-8 rounded-lg border border-zinc-200 border-l-4 border-l-emerald-500 bg-zinc-50 p-5 dark:border-zinc-800 dark:border-l-emerald-500 dark:bg-zinc-900/60">
        <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
          <span aria-hidden="true">⭐</span>
          Today&rsquo;s Priority
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {summary.todaysPriority}
        </p>
      </div>

      {(summary.goingWell.length > 0 || summary.needsAttention.length > 0) && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {summary.goingWell.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
                <span aria-hidden="true">🟢</span>
                What&rsquo;s Going Well
              </h3>
              <ul className="mt-3 space-y-2">
                {summary.goingWell.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg bg-emerald-50 px-3 py-2 text-sm leading-6 text-zinc-700 dark:bg-emerald-500/10 dark:text-zinc-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.needsAttention.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
                <span aria-hidden="true">⚠️</span>
                Needs Attention
              </h3>
              <ul className="mt-3 space-y-2">
                {summary.needsAttention.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg bg-amber-50 px-3 py-2 text-sm leading-6 text-zinc-700 dark:bg-amber-500/10 dark:text-zinc-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {summary.additionalRecommendations.length > 0 && (
        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Additional Recommendations
          </h3>
          <ol className="mt-3 space-y-2">
            {summary.additionalRecommendations.map((action, index) => (
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
