import { describe, expect, it } from "vitest";
import type { CsvRow } from "@/lib/upload/types";
import { getDuplicateEmailCount } from "./duplicateEmails";

describe("getDuplicateEmailCount", () => {
  it("is unavailable when no email column is mapped", () => {
    expect(getDuplicateEmailCount([{ Email: "a@example.com" }], null)).toEqual({
      available: false,
    });
  });

  it("counts duplicate emails case-insensitively, ignoring blanks", () => {
    const rows: CsvRow[] = [
      { Email: "a@example.com" },
      { Email: "A@Example.com" },
      { Email: "b@example.com" },
      { Email: "" },
    ];
    // "a@example.com" appears twice -> 1 extra occurrence counted as a duplicate.
    expect(getDuplicateEmailCount(rows, "Email")).toEqual({ available: true, value: 1 });
  });

  it("returns 0 when there are no duplicates", () => {
    const rows: CsvRow[] = [{ Email: "a@example.com" }, { Email: "b@example.com" }];
    expect(getDuplicateEmailCount(rows, "Email")).toEqual({ available: true, value: 0 });
  });
});
