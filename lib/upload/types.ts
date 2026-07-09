export type TargetFieldId =
  | "name"
  | "email"
  | "phone"
  | "revenue"
  | "stage"
  | "owner"
  | "leadSource"
  | "date";

export interface TargetField {
  id: TargetFieldId;
  label: string;
  synonyms: string[];
  description: string;
}

export type ColumnMapping = Record<TargetFieldId, string | null>;

export type CsvRow = Record<string, string>;

export interface ParsedCsv {
  fileName: string;
  headers: string[];
  rows: CsvRow[];
  rowCount: number;
}

export type UploadStatus = "idle" | "parsing" | "mapping" | "confirmed";
