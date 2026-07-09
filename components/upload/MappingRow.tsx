import type { CsvRow, TargetField } from "@/lib/upload/types";
import { getSampleValues } from "@/lib/upload/getSampleValues";

const NOT_MAPPED_VALUE = "";

interface MappingRowProps {
  field: TargetField;
  headers: string[];
  rows: CsvRow[];
  value: string | null;
  wasAutoDetected: boolean;
  onChange: (header: string | null) => void;
}

export function MappingRow({
  field,
  headers,
  rows,
  value,
  wasAutoDetected,
  onChange,
}: MappingRowProps) {
  const samples = getSampleValues(rows, value);
  const selectId = `mapping-${field.id}`;

  return (
    <div className="flex flex-col gap-3 border-b border-zinc-200 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
      <div className="sm:w-48 sm:flex-none">
        <div className="flex items-center gap-2">
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-zinc-900 dark:text-white"
          >
            {field.label}
          </label>
          {wasAutoDetected && value && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              Detected
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-5 text-zinc-500 dark:text-zinc-500">
          {field.description}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <select
          id={selectId}
          value={value ?? NOT_MAPPED_VALUE}
          onChange={(event) => onChange(event.target.value || null)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:max-w-xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        >
          <option value={NOT_MAPPED_VALUE}>Not mapped</option>
          {headers.map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
        <p className="truncate text-xs text-zinc-500 sm:flex-1 dark:text-zinc-500">
          {samples.length > 0 ? `e.g. ${samples.join(", ")}` : "No sample values"}
        </p>
      </div>
    </div>
  );
}
