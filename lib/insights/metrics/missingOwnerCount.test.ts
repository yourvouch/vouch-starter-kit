import { describe, expect, it } from "vitest";
import type { CsvRow } from "@/lib/upload/types";
import { getMissingOwnerCount } from "./missingOwnerCount";

const rows: CsvRow[] = [{ Owner: "Alex" }, { Owner: "" }, { Owner: "   " }];

describe("getMissingOwnerCount", () => {
  it("is unavailable when no owner column is mapped", () => {
    expect(getMissingOwnerCount(rows, null)).toEqual({ available: false });
  });

  it("counts blank and whitespace-only values as missing", () => {
    expect(getMissingOwnerCount(rows, "Owner")).toEqual({ available: true, value: 2 });
  });
});
