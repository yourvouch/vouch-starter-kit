"use client";

import { useState } from "react";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DashboardActionBar } from "@/components/dashboard/DashboardActionBar";
import { LoaderIcon } from "@/components/icons";
import { buildBusinessHealth } from "@/lib/insights/buildBusinessHealth";
import { buildDashboardMetrics } from "@/lib/insights/buildDashboardMetrics";
import { buildInsightSummary } from "@/lib/insights/buildInsightSummary";
import { buildTextSummary } from "@/lib/insights/buildTextSummary";
import { detectColumns } from "@/lib/upload/detectColumns";
import { CsvParseError, parseCsvFile } from "@/lib/upload/parseCsv";
import type { ColumnMapping, ParsedCsv, UploadStatus } from "@/lib/upload/types";
import { Dropzone } from "./Dropzone";
import { MappingScreen } from "./MappingScreen";

export function UploadFlow() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedCsv | null>(null);
  const [detectedMapping, setDetectedMapping] = useState<ColumnMapping | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);

  const isParsing = status === "parsing";

  async function handleFileSelected(file: File) {
    setError(null);
    setStatus("parsing");

    try {
      const result = await parseCsvFile(file);
      const detected = detectColumns(result.headers);
      setParsed(result);
      setDetectedMapping(detected);
      setMapping(detected);
      setStatus("mapping");
    } catch (caught) {
      const message =
        caught instanceof CsvParseError
          ? caught.message
          : "Something went wrong while reading this file. Please try again.";
      setError(message);
      setStatus("idle");
    }
  }

  function handleMappingChange(fieldId: keyof ColumnMapping, header: string | null) {
    setMapping((current) => (current ? { ...current, [fieldId]: header } : current));
  }

  function handleReset() {
    setStatus("idle");
    setError(null);
    setParsed(null);
    setDetectedMapping(null);
    setMapping(null);
  }

  if (status === "mapping" && parsed && mapping && detectedMapping) {
    return (
      <div className="w-full max-w-3xl">
        <MappingScreen
          parsed={parsed}
          mapping={mapping}
          detectedMapping={detectedMapping}
          onMappingChange={handleMappingChange}
          onConfirm={() => setStatus("confirmed")}
          onCancel={handleReset}
        />
      </div>
    );
  }

  if (status === "confirmed" && parsed && mapping) {
    const metrics = buildDashboardMetrics(parsed.rows, mapping);
    const summary = buildInsightSummary(metrics);
    const businessHealth = buildBusinessHealth(metrics, mapping);
    const textSummary = buildTextSummary({
      fileName: parsed.fileName,
      rowCount: parsed.rowCount,
      summary,
      businessHealth,
    });

    return (
      <div className="w-full max-w-6xl">
        <DashboardActionBar
          fileName={parsed.fileName}
          rowCount={parsed.rowCount}
          textSummary={textSummary}
          onReset={handleReset}
        />
        <div className="mt-6">
          <Dashboard metrics={metrics} summary={summary} businessHealth={businessHealth} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <Dropzone onFileSelected={handleFileSelected} error={error} disabled={isParsing} />
      {isParsing && (
        <div
          role="status"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
        >
          <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
          Parsing your file&hellip;
        </div>
      )}
    </div>
  );
}
