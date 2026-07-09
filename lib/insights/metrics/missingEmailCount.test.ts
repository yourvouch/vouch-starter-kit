import { describe, expect, it } from "vitest";
import type { CsvRow } from "@/lib/upload/types";
import { getMissingEmailCount } from "./missingEmailCount";

const rows: CsvRow[] = [{ Email: "a@example.com" }, { Email: "" }, { Email: "   " }];

describe("getMissingEmailCount", () => {
  it("is unavailable when no email column is mapped", () => {
    expect(getMissingEmailCount(rows, null)).toEqual({ available: false });
  });

  it("counts blank and whitespace-only values as missing", () => {
    expect(getMissingEmailCount(rows, "Email")).toEqual({ available: true, value: 2 });
  });
});
