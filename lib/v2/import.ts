import Papa from "papaparse";
import { parseXlsx } from "./xlsx";

export interface TabularFile { name: string; rows: Record<string, string>[]; sheets: string[] }
export async function parseBusinessFile(file: File): Promise<TabularFile> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "xlsx") { const parsed = await parseXlsx(await file.arrayBuffer()); const first = parsed.sheets[0]; if (!first) throw new Error("No readable worksheet was found. Export as CSV and try again."); return { name: file.name, rows: first.rows, sheets: parsed.sheets.map((sheet) => sheet.name) }; }
  if (extension !== "csv") throw new Error("Choose a modern .xlsx or .csv file.");
  return await new Promise((resolve, reject) => Papa.parse<Record<string, string>>(file, { header: true, skipEmptyLines: true, complete: (result) => result.errors.length ? reject(new Error(result.errors[0].message)) : resolve({ name: file.name, rows: result.data.slice(0, 50_000), sheets: [] }), error: reject }));
}
