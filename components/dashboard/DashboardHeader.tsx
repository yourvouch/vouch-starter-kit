import { ActionButton } from "@/components/ui/ActionButton";

interface DashboardHeaderProps {
  fileName: string;
  rowCount: number;
  onReset: () => void;
}

export function DashboardHeader({ fileName, rowCount, onReset }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {fileName} &middot; {rowCount.toLocaleString()} rows &middot; processed entirely in your
          browser
        </p>
      </div>
      <ActionButton onClick={onReset} variant="secondary">
        Upload another file
      </ActionButton>
    </div>
  );
}
