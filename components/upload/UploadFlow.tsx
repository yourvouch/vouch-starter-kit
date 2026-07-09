"use client";

import { useState } from "react";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LoaderIcon } from "@/components/icons";
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
    return (
      <div className="w-full max-w-6xl">
        <DashboardHeader
          fileName={parsed.fileName}
          rowCount={parsed.rowCount}
          onReset={handleReset}
        />
        <div className="mt-8">
          <Dashboard rows={parsed.rows} mapping={mapping} />
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
