import { formatCurrency, formatNumber } from "@/lib/insights/format";
import { NOT_AVAILABLE_LABEL, type Metric, type OwnerBucket } from "@/lib/insights/types";
import { EmptyMetricState } from "./EmptyMetricState";

interface OwnerTableProps {
  data: Metric<OwnerBucket[]>;
}

export function OwnerTable({ data }: OwnerTableProps) {
  if (!data.available) {
    return <EmptyMetricState message={NOT_AVAILABLE_LABEL} />;
  }

  if (data.value.length === 0) {
    return <EmptyMetricState message="No owner data found" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <th scope="col" className="py-2 font-medium">
              Owner
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              Leads
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody>
          {data.value.map((row) => (
            <tr
              key={row.owner}
              className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800/60"
            >
              <td className="py-2 text-zinc-900 dark:text-white">{row.owner}</td>
              <td className="py-2 text-right text-zinc-600 dark:text-zinc-400">
                {formatNumber(row.count)}
              </td>
              <td className="py-2 text-right text-zinc-600 dark:text-zinc-400">
                {row.revenue !== null ? formatCurrency(row.revenue) : NOT_AVAILABLE_LABEL}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
