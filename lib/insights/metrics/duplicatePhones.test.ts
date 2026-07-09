import { describe, expect, it } from "vitest";
import type { CsvRow } from "@/lib/upload/types";
import { getDuplicatePhoneCount } from "./duplicatePhones";

describe("getDuplicatePhoneCount", () => {
  it("is unavailable when no phone column is mapped", () => {
    expect(getDuplicatePhoneCount([{ Phone: "555-1234" }], null)).toEqual({ available: false });
  });

  it("counts duplicates after stripping non-digit formatting", () => {
    const rows: CsvRow[] = [
      { Phone: "(555) 123-4567" },
      { Phone: "555-123-4567" },
      { Phone: "555-000-0000" },
    ];
    expect(getDuplicatePhoneCount(rows, "Phone")).toEqual({ available: true, value: 1 });
  });
});
