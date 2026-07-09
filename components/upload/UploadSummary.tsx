import { ActionButton } from "@/components/ui/ActionButton";
import { CheckCircleIcon } from "@/components/icons";
import { TARGET_FIELDS } from "@/lib/upload/constants";
import type { ColumnMapping, ParsedCsv } from "@/lib/upload/types";

interface UploadSummaryProps {
  parsed: ParsedCsv;
  mapping: ColumnMapping;
  onReset: () => void;
}

export function UploadSummary({ parsed, mapping, onReset }: UploadSummaryProps) {
  const mappedFields = TARGET_FIELDS.filter((field) => mapping[field.id]);

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Mapping confirmed
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {parsed.fileName} &middot; {parsed.rowCount.toLocaleString()} rows parsed
          </p>
        </div>
      </div>

      {mappedFields.length > 0 && (
        <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">
          {mappedFields.map((field) => (
            <div key={field.id} className="flex items-baseline justify-between gap-4">
              <dt className="text-sm font-medium text-zinc-900 dark:text-white">{field.label}</dt>
              <dd className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                {mapping[field.id]}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-6 text-sm leading-6 text-zinc-500 dark:text-zinc-500">
        Your data stays in this browser tab — nothing was uploaded to a server. Dashboard and
        insights are coming in a future sprint.
      </p>

      <div className="mt-6">
        <ActionButton onClick={onReset} variant="secondary">
          Upload another file
        </ActionButton>
      </div>
    </div>
  );
}
