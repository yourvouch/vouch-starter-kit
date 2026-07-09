"use client";

import { useRef, useState } from "react";
import { AlertCircleIcon, UploadIcon } from "@/components/icons";

interface DropzoneProps {
  onFileSelected: (file: File) => void;
  error: string | null;
  disabled?: boolean;
}

export function Dropzone({ onFileSelected, error, disabled = false }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function openFileBrowser() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file);
    event.target.value = "";
  }

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label="Upload a CSV file: drag and drop, or click to browse"
        onClick={openFileBrowser}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFileBrowser();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
          disabled
            ? "cursor-not-allowed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
            : isDragging
              ? "cursor-pointer border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
              : "cursor-pointer border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:border-zinc-600"
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
          <UploadIcon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-base font-semibold text-zinc-900 dark:text-white">
            Drag and drop your CSV here
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            or click to browse files
          </p>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          .csv files only &middot; processed entirely in your browser
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          disabled={disabled}
          onChange={handleInputChange}
          tabIndex={-1}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
        >
          <AlertCircleIcon className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
