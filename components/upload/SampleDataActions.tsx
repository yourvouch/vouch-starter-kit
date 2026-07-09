"use client";

import { DownloadIcon, SparkleIcon } from "@/components/icons";
import { ToolbarButton } from "@/components/ui/ToolbarButton";
import { downloadTextFile } from "@/lib/downloadFile";
import { SAMPLE_CSV_CONTENT, SAMPLE_CSV_FILENAME } from "@/lib/sampleData";

interface SampleDataActionsProps {
  onTryDemo: () => void;
  disabled?: boolean;
}

export function SampleDataActions({ onTryDemo, disabled = false }: SampleDataActionsProps) {
  function handleDownloadSample() {
    downloadTextFile(SAMPLE_CSV_FILENAME, SAMPLE_CSV_CONTENT, "text/csv;charset=utf-8");
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        No CSV handy? Try it with sample data.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <ToolbarButton onClick={onTryDemo} disabled={disabled}>
          <SparkleIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Try with sample data
        </ToolbarButton>
        <ToolbarButton onClick={handleDownloadSample} disabled={disabled}>
          <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Download sample CSV
        </ToolbarButton>
      </div>
    </div>
  );
}
