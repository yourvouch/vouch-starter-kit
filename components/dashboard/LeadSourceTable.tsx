import { columnNotMappedMessage, NO_METRIC_DATA_MESSAGE } from "@/lib/insights/emptyStateMessages";
import { formatNumber } from "@/lib/insights/format";
import type { LeadSourceBucket, Metric } from "@/lib/insights/types";
import { EmptyMetricState } from "./EmptyMetricState";

interface LeadSourceTableProps {
  data: Metric<LeadSourceBucket[]>;
}

export function LeadSourceTable({ data }: LeadSourceTableProps) {
  if (!data.available) {
    return <EmptyMetricState message={columnNotMappedMessage("Lead Source")} />;
  }

  if (data.value.length === 0) {
    return <EmptyMetricState message={NO_METRIC_DATA_MESSAGE} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <th scope="col" className="py-2 font-medium">
              Source
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              Leads
            </th>
          </tr>
        </thead>
        <tbody>
          {data.value.map((row) => (
            <tr
              key={row.source}
              className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800/60"
            >
              <td className="py-2 text-zinc-900 dark:text-white">{row.source}</td>
              <td className="py-2 text-right text-zinc-600 dark:text-zinc-400">
                {formatNumber(row.count)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
