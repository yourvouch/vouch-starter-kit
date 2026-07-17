export const XLSX_LIMITS = { workbookBytes: 15 * 1024 * 1024, expandedBytes: 60 * 1024 * 1024, entries: 256, worksheets: 12, retainedRows: 50_000, entryBytes: 20 * 1024 * 1024 } as const;

export class WorkbookError extends Error {
  constructor(message: string) { super(`${message} Export the workbook as CSV and try again if the problem continues.`); this.name = "WorkbookError"; }
}

interface ZipEntry { path: string; method: number; compressedSize: number; expandedSize: number; offset: number }
const u16 = (view: DataView, offset: number) => view.getUint16(offset, true);
const u32 = (view: DataView, offset: number) => view.getUint32(offset, true);
const decode = (bytes: Uint8Array) => new TextDecoder().decode(bytes);
const safePath = (path: string) => !path.startsWith("/") && !path.includes("\\") && !path.split("/").includes("..");

function centralEntries(buffer: ArrayBuffer): ZipEntry[] {
  if (buffer.byteLength > XLSX_LIMITS.workbookBytes) throw new WorkbookError("Workbook is larger than the 15 MB safety limit.");
  const bytes = new Uint8Array(buffer); const view = new DataView(buffer);
  if (bytes.length < 22 || u32(view, 0) !== 0x04034b50) throw new WorkbookError("This is not a valid modern XLSX ZIP file.");
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) if (u32(view, i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new WorkbookError("The XLSX ZIP directory is missing or damaged.");
  const count = u16(view, eocd + 10); const centralOffset = u32(view, eocd + 16);
  if (count > XLSX_LIMITS.entries) throw new WorkbookError(`Workbook contains more than ${XLSX_LIMITS.entries} ZIP entries.`);
  const entries: ZipEntry[] = []; let offset = centralOffset; let total = 0;
  for (let index = 0; index < count; index++) {
    if (offset + 46 > bytes.length || u32(view, offset) !== 0x02014b50) throw new WorkbookError("The XLSX ZIP directory has invalid bounds.");
    const flags = u16(view, offset + 8); const method = u16(view, offset + 10); const compressedSize = u32(view, offset + 20); const expandedSize = u32(view, offset + 24);
    const nameLength = u16(view, offset + 28); const extraLength = u16(view, offset + 30); const commentLength = u16(view, offset + 32); const localOffset = u32(view, offset + 42);
    const end = offset + 46 + nameLength + extraLength + commentLength;
    if (end > bytes.length) throw new WorkbookError("A ZIP entry exceeds workbook bounds.");
    const path = decode(bytes.slice(offset + 46, offset + 46 + nameLength));
    if (!safePath(path)) throw new WorkbookError("Workbook contains an unsafe path.");
    if ((flags & 1) !== 0) throw new WorkbookError("Encrypted workbooks are not supported.");
    if (![0, 8].includes(method)) throw new WorkbookError("Workbook uses an unsupported ZIP compression method.");
    if (expandedSize > XLSX_LIMITS.entryBytes) throw new WorkbookError(`ZIP entry ${path} exceeds the expanded-size limit.`);
    total += expandedSize; if (total > XLSX_LIMITS.expandedBytes) throw new WorkbookError("Workbook expands beyond the 60 MB safety limit.");
    entries.push({ path, method, compressedSize, expandedSize, offset: localOffset }); offset = end;
  }
  return entries;
}

async function inflate(buffer: ArrayBuffer, entry: ZipEntry) {
  const view = new DataView(buffer); const bytes = new Uint8Array(buffer); const offset = entry.offset;
  if (offset + 30 > bytes.length || u32(view, offset) !== 0x04034b50) throw new WorkbookError(`Invalid local ZIP header for ${entry.path}.`);
  const start = offset + 30 + u16(view, offset + 26) + u16(view, offset + 28); const end = start + entry.compressedSize;
  if (end > bytes.length) throw new WorkbookError(`Compressed data for ${entry.path} exceeds workbook bounds.`);
  const payload = bytes.slice(start, end);
  if (entry.method === 0) return payload;
  try {
    const stream = new Blob([payload]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    const expanded = new Uint8Array(await new Response(stream).arrayBuffer());
    if (expanded.length !== entry.expandedSize) throw new Error("size mismatch");
    return expanded;
  } catch { throw new WorkbookError(`Could not safely decompress ${entry.path}.`); }
}

const entities = (value: string) => value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const attrs = (tag: string) => Object.fromEntries(Array.from(tag.matchAll(/([\w:-]+)="([^"]*)"/g), (match) => [match[1], entities(match[2])]));
const tags = (source: string, name: string) => Array.from(source.matchAll(new RegExp(`<${name}\\b[^>]*(?:\\/>|>[\\s\\S]*?<\\/${name}>)`, "gi")), (match) => match[0]);
const text = (source: string, name: string) => { const match = source.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, "i")); return entities((match?.[1] ?? "").replace(/<[^>]+>/g, "")); };
const validateXml = (source: string) => { if (/<!DOCTYPE|<!ENTITY/i.test(source) || !source.trim().startsWith("<")) throw new WorkbookError("Workbook contains unsafe or malformed XML."); return source; };
const relTarget = (base: string, target: string) => {
  const root = base.split("/").slice(0, -1); for (const part of target.split("/")) { if (part === "..") root.pop(); else if (part !== ".") root.push(part); }
  const resolved = root.join("/"); if (!safePath(resolved)) throw new WorkbookError("Workbook relationship contains an unsafe path."); return resolved;
};

export interface ParsedWorkbook { sheets: { name: string; rows: Record<string, string>[] }[]; warnings: string[] }
export async function parseXlsx(buffer: ArrayBuffer): Promise<ParsedWorkbook> {
  const entries = centralEntries(buffer); const byPath = new Map(entries.map((entry) => [entry.path, entry]));
  if (entries.some((entry) => /encryptedpackage|encryptioninfo/i.test(entry.path))) throw new WorkbookError("Encrypted workbooks are not supported.");
  const read = async (path: string) => { const entry = byPath.get(path); if (!entry) throw new WorkbookError(`Required workbook part ${path} is missing.`); return decode(await inflate(buffer, entry)); };
  const workbookPath = "xl/workbook.xml"; const workbook = validateXml(await read(workbookPath));
  const rels = validateXml(await read("xl/_rels/workbook.xml.rels")); const relations = new Map(tags(rels, "Relationship").map((tag) => { const attributes = attrs(tag); return [attributes.Id ?? "", relTarget(workbookPath, attributes.Target ?? "")]; }));
  const sheetNodes = tags(workbook, "sheet");
  if (sheetNodes.length > XLSX_LIMITS.worksheets) throw new WorkbookError(`Workbook contains more than ${XLSX_LIMITS.worksheets} worksheets.`);
  const sharedEntry = byPath.get("xl/sharedStrings.xml"); const shared = sharedEntry ? tags(validateXml(decode(await inflate(buffer, sharedEntry))), "si").map((item) => tags(item, "t").map((node) => text(node, "t")).join("")) : [];
  const sheets = [];
  for (const sheet of sheetNodes) {
    const sheetAttributes = attrs(sheet); const relationId = sheetAttributes["r:id"] ?? "";
    const path = relations.get(relationId); if (!path || !path.startsWith("xl/worksheets/") || !byPath.has(path)) throw new WorkbookError("A worksheet relationship is invalid or missing.");
    const document = validateXml(await read(path)); const rawRows = tags(document, "row").slice(0, XLSX_LIMITS.retainedRows + 1);
    const matrix = rawRows.map((row) => { const values: string[] = []; for (const cell of tags(row, "c")) { const cellAttributes = attrs(cell); const ref = cellAttributes.r ?? "A1"; const letters = ref.match(/[A-Z]+/i)?.[0]?.toUpperCase() ?? "A"; let column = 0; for (const char of letters) column = column * 26 + char.charCodeAt(0) - 64; const raw = text(cell, "v") || text(cell, "t"); values[column - 1] = cellAttributes.t === "s" ? shared[Number(raw)] ?? "" : raw; } return values; });
    const headers = matrix[0] ?? []; const rows = matrix.slice(1, XLSX_LIMITS.retainedRows + 1).map((values) => Object.fromEntries(headers.map((header, index) => [header || `Column ${index + 1}`, values[index] ?? ""])));
    sheets.push({ name: sheetAttributes.name ?? `Sheet ${sheets.length + 1}`, rows });
  }
  return { sheets, warnings: sheetNodes.length ? [] : ["No worksheets were found."] };
}
