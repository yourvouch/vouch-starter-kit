import { ActionButton } from "@/components/ui/ActionButton";
import { TARGET_FIELDS } from "@/lib/upload/constants";
import type { ColumnMapping, ParsedCsv } from "@/lib/upload/types";
import { MappingRow } from "./MappingRow";

interface MappingScreenProps {
  parsed: ParsedCsv;
  mapping: ColumnMapping;
  detectedMapping: ColumnMapping;
  onMappingChange: (fieldId: keyof ColumnMapping, header: string | null) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function MappingScreen({
  parsed,
  mapping,
  detectedMapping,
  onMappingChange,
  onConfirm,
  onCancel,
}: MappingScreenProps) {
  const detectedCount = TARGET_FIELDS.filter((field) => mapping[field.id]).length;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Confirm your column mapping
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {parsed.fileName} &middot; {parsed.rowCount.toLocaleString()} rows &middot;{" "}
          {detectedCount} of {TARGET_FIELDS.length} fields detected
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900/40">
        {TARGET_FIELDS.map((field) => (
          <MappingRow
            key={field.id}
            field={field}
            headers={parsed.headers}
            rows={parsed.rows}
            value={mapping[field.id]}
            wasAutoDetected={detectedMapping[field.id] === mapping[field.id]}
            onChange={(header) => onMappingChange(field.id, header)}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <ActionButton onClick={onConfirm} variant="primary">
          Confirm mapping
        </ActionButton>
        <ActionButton onClick={onCancel} variant="secondary">
          Start over
        </ActionButton>
      </div>
    </div>
  );
}
