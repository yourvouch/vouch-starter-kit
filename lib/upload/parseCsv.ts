import Papa from "papaparse";
import { MAX_PARSE_ROWS } from "./constants";
import type { CsvRow, ParsedCsv } from "./types";

export class CsvParseError extends Error {}

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

export function parseCsvFile(file: File): Promise<ParsedCsv> {
  assertCsvFile(file);

  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        const headers = (results.meta.fields ?? []).filter((field) => field.trim().length > 0);

        if (headers.length === 0) {
          reject(new CsvParseError("Couldn't find any column headers in this file."));
          return;
        }

        if (results.data.length === 0) {
          reject(new CsvParseError("This file doesn't contain any data rows."));
          return;
        }

        const rows = results.data.slice(0, MAX_PARSE_ROWS);

        resolve({
          fileName: file.name,
          headers,
          rows,
          rowCount: results.data.length,
        });
      },
      error: (error) => {
        reject(new CsvParseError(error.message || "Couldn't read this file."));
      },
    });
  });
}
