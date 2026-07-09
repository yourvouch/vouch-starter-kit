import {
  HEALTH_STATUS_LABELS,
  type BusinessHealthItem,
  type HealthStatus,
} from "@/lib/insights/buildBusinessHealth";

const STATUS_DOT_STYLES: Record<HealthStatus, string> = {
  good: "bg-emerald-500",
  attention: "bg-amber-500",
  unavailable: "bg-zinc-300 dark:bg-zinc-700",
};

const HEALTH_ICONS: Record<string, string> = {
  "Pipeline Value": "📈",
  "Contact Quality": "📞",
  "Data Completeness": "🗂️",
  "Owner Coverage": "👤",
  "Revenue Visibility": "👁️",
};

interface BusinessHealthStripProps {
  items: BusinessHealthItem[];
}

export function BusinessHealthStrip({ items }: BusinessHealthStripProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => {
        return (
          <div
            key={item.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 print:break-inside-avoid dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <div className="flex items-center justify-between">
              <span aria-hidden="true" className="text-base leading-none opacity-80">
                {HEALTH_ICONS[item.label]}
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_STYLES[item.status]}`}
                />
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {HEALTH_STATUS_LABELS[item.status]}
                </span>
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-white">
              {item.label}
            </p>
            <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{item.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
