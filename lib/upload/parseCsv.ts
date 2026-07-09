import Papa from "papaparse";
import { MAX_PARSE_ROWS } from "./constants";
import type { CsvRow, ParsedCsv } from "./types";

export class CsvParseError extends Error {}

const PROGRESS_REPORT_INTERVAL = 200;

function assertCsvFile(file: File): void {
  if (file.size === 0) {
    throw new CsvParseError("This file is empty. Choose a CSV file with data in it.");
  }

  const looksLikeCsv =
    file.name.toLowerCase().endsWith(".csv") ||
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel";

  if (!looksLikeCsv) {
    throw new CsvParseError("Only .csv files are supported.");
  }
}

export function parseCsvFile(
  file: File,
  onProgress?: (rowsParsed: number) => void,
): Promise<ParsedCsv> {
  assertCsvFile(file);

  return new Promise((resolve, reject) => {
    const rows: CsvRow[] = [];
    let headers: string[] = [];
    let totalRowCount = 0;

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      step: (results) => {
        if (headers.length === 0 && results.meta.fields) {
          headers = results.meta.fields.filter((field) => field.trim().length > 0);
        }

        totalRowCount += 1;
        if (rows.length < MAX_PARSE_ROWS) {
          rows.push(results.data);
        }

        if (onProgress && totalRowCount % PROGRESS_REPORT_INTERVAL === 0) {
          onProgress(totalRowCount);
        }
      },
      complete: () => {
        if (headers.length === 0) {
          reject(new CsvParseError("Couldn't find any column headers in this file."));
          return;
        }

        if (totalRowCount === 0) {
          reject(new CsvParseError("This file doesn't contain any data rows."));
          return;
        }

        onProgress?.(totalRowCount);
        resolve({
          fileName: file.name,
          headers,
          rows,
          rowCount: totalRowCount,
        });
      },
      error: (error) => {
        reject(new CsvParseError(error.message || "Couldn't read this file."));
      },
    });
  });
}
