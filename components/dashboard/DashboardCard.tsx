import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DashboardCard({ title, description, children }: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 print:break-inside-avoid dark:border-zinc-800 dark:bg-zinc-900/40">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}
