"use client";

import { useState } from "react";
import { CheckCircleIcon, ClipboardIcon, DownloadIcon, PrinterIcon, UploadIcon } from "@/components/icons";
import { ToolbarButton } from "@/components/ui/ToolbarButton";

interface DashboardActionBarProps {
  fileName: string;
  rowCount: number;
  textSummary: string;
  onReset: () => void;
}

function buildSummaryFileName(fileName: string): string {
  const baseName = fileName.replace(/\.csv$/i, "");
  return `${baseName}-vouch-summary.txt`;
}

export function DashboardActionBar({
  fileName,
  rowCount,
  textSummary,
  onReset,
}: DashboardActionBarProps) {
  const [copied, setCopied] = useState(false);

  function handleDownload() {
    const blob = new Blob([textSummary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildSummaryFileName(fileName);
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="sticky top-16 z-40 border-b border-zinc-200 bg-white/95 py-4 backdrop-blur print:hidden dark:border-zinc-800 dark:bg-black/90">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Dashboard</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {fileName} &middot; {rowCount.toLocaleString()} rows &middot; processed entirely in
            your browser
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ToolbarButton onClick={onReset}>
            <UploadIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Upload another file
          </ToolbarButton>
          <ToolbarButton onClick={handleDownload}>
            <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Download summary
          </ToolbarButton>
          <ToolbarButton onClick={handleCopy} aria-live="polite">
            {copied ? (
              <>
                <CheckCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Copied
              </>
            ) : (
              <>
                <ClipboardIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Copy summary
              </>
            )}
          </ToolbarButton>
          <ToolbarButton onClick={handlePrint}>
            <PrinterIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Print report
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
}
