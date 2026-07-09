import Papa from "papaparse";
import { describe, expect, it } from "vitest";
import { detectColumns } from "./upload/detectColumns";
import { getDuplicateEmailCount } from "./insights/metrics/duplicateEmails";
import { getDuplicatePhoneCount } from "./insights/metrics/duplicatePhones";
import { getMissingEmailCount } from "./insights/metrics/missingEmailCount";
import { getMissingOwnerCount } from "./insights/metrics/missingOwnerCount";
import { getMissingPhoneCount } from "./insights/metrics/missingPhoneCount";
import { createSampleCsvFile, SAMPLE_CSV_CONTENT, SAMPLE_CSV_FILENAME } from "./sampleData";

function parseSample() {
  return Papa.parse<Record<string, string>>(SAMPLE_CSV_CONTENT, {
    header: true,
    skipEmptyLines: true,
  });
}

describe("SAMPLE_CSV_CONTENT", () => {
  it("has headers that auto-detect to every target field", () => {
    const { meta } = parseSample();
    const mapping = detectColumns(meta.fields ?? []);

    expect(Object.values(mapping)).not.toContain(null);
  });

  it("contains a realistic, non-trivial number of rows", () => {
    const { data } = parseSample();
    expect(data.length).toBeGreaterThanOrEqual(20);
  });

  it("intentionally contains missing contact and owner data to demonstrate Needs Attention states", () => {
    const { data, meta } = parseSample();
    const mapping = detectColumns(meta.fields ?? []);

    expect(getMissingEmailCount(data, mapping.email)).toEqual({ available: true, value: 3 });
    expect(getMissingPhoneCount(data, mapping.phone)).toEqual({ available: true, value: 2 });
    expect(getMissingOwnerCount(data, mapping.owner)).toEqual({ available: true, value: 2 });
  });

  it("intentionally contains a duplicate email and phone to demonstrate duplicate detection", () => {
    const { data, meta } = parseSample();
    const mapping = detectColumns(meta.fields ?? []);

    expect(getDuplicateEmailCount(data, mapping.email)).toEqual({ available: true, value: 1 });
    expect(getDuplicatePhoneCount(data, mapping.phone)).toEqual({ available: true, value: 1 });
  });
});

describe("createSampleCsvFile", () => {
  it("returns a CSV File with the expected name and type", () => {
    const file = createSampleCsvFile();

    expect(file.name).toBe(SAMPLE_CSV_FILENAME);
    expect(file.type).toBe("text/csv");
    expect(file.size).toBeGreaterThan(0);
  });
});
