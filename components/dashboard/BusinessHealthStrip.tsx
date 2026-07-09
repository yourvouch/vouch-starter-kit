import type { BusinessHealthItem, HealthStatus } from "@/lib/insights/buildBusinessHealth";

const STATUS_STYLES: Record<HealthStatus, { dot: string; label: string }> = {
  good: { dot: "bg-emerald-500", label: "Good" },
  attention: { dot: "bg-amber-500", label: "Needs Attention" },
  unavailable: { dot: "bg-zinc-300 dark:bg-zinc-700", label: "Not Available" },
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
        const style = STATUS_STYLES[item.status];
        return (
          <div
            key={item.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <div className="flex items-center justify-between">
              <span aria-hidden="true" className="text-base leading-none opacity-80">
                {HEALTH_ICONS[item.label]}
              </span>
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {style.label}
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
