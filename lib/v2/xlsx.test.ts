import { describe, expect, it } from "vitest";
import { parseXlsx, WorkbookError } from "./xlsx";

const crc32 = (data: Uint8Array) => { let crc = 0xffffffff; for (const byte of data) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); } return (crc ^ 0xffffffff) >>> 0; };
const le16 = (value: number) => [value & 255, value >>> 8 & 255]; const le32 = (value: number) => [value & 255, value >>> 8 & 255, value >>> 16 & 255, value >>> 24 & 255];
function xlsxFixture() {
  const files: Record<string, string> = {
    "xl/workbook.xml": '<?xml version="1.0"?><workbook><sheets><sheet name="Pipeline" sheetId="1" r:id="rId1"/></sheets></workbook>',
    "xl/_rels/workbook.xml.rels": '<?xml version="1.0"?><Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>',
    "xl/worksheets/sheet1.xml": '<?xml version="1.0"?><worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Name</t></is></c><c r="B1" t="inlineStr"><is><t>Value</t></is></c></row><row r="2"><c r="A2" t="inlineStr"><is><t>Aster</t></is></c><c r="B2"><v>125000</v></c></row></sheetData></worksheet>',
  };
  const encoder = new TextEncoder(); const local: number[] = []; const central: number[] = []; let offset = 0;
  for (const [path, value] of Object.entries(files)) { const name = encoder.encode(path), data = encoder.encode(value), crc = crc32(data); const header = [...le32(0x04034b50),...le16(20),...le16(0),...le16(0),...le16(0),...le16(0),...le32(crc),...le32(data.length),...le32(data.length),...le16(name.length),...le16(0),...name,...data]; local.push(...header); central.push(...le32(0x02014b50),...le16(20),...le16(20),...le16(0),...le16(0),...le16(0),...le16(0),...le32(crc),...le32(data.length),...le32(data.length),...le16(name.length),...le16(0),...le16(0),...le16(0),...le16(0),...le32(0),...le32(offset),...name); offset += header.length; }
  const count = Object.keys(files).length; return new Uint8Array([...local,...central,...le32(0x06054b50),...le16(0),...le16(0),...le16(count),...le16(count),...le32(central.length),...le32(local.length),...le16(0)]).buffer;
}
describe("dependency-free XLSX", () => {
  it("parses a real programmatically generated XLSX ZIP/XML fixture", async () => { const result = await parseXlsx(xlsxFixture()); expect(result.sheets[0].name).toBe("Pipeline"); expect(result.sheets[0].rows).toEqual([{ Name: "Aster", Value: "125000" }]); });
  it("rejects invalid workbooks with CSV fallback guidance", async () => { await expect(parseXlsx(new Uint8Array([1,2,3]).buffer)).rejects.toThrow(/Export.*CSV/); });
  it("rejects path traversal", async () => { const bytes = new Uint8Array(xlsxFixture()); const needle = "xl/workbook.xml"; let decoded = new TextDecoder().decode(bytes); let index = decoded.indexOf(needle); while (index >= 0) { bytes.set(new TextEncoder().encode("../workbook.xml"), index); decoded = new TextDecoder().decode(bytes); index = decoded.indexOf(needle); } await expect(parseXlsx(bytes.buffer)).rejects.toBeInstanceOf(WorkbookError); });
});
