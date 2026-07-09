import { describe, expect, it } from "vitest";
import {
  columnNotMappedMessage,
  NO_METRIC_DATA_MESSAGE,
  unavailableHelperText,
} from "./emptyStateMessages";

describe("columnNotMappedMessage", () => {
  it("names the column that was not mapped", () => {
    expect(columnNotMappedMessage("Email")).toBe("Email column was not mapped");
    expect(columnNotMappedMessage("Revenue")).toBe("Revenue column was not mapped");
  });
});

describe("unavailableHelperText", () => {
  it("explains why a stat card value is unavailable, lowercasing the column name", () => {
    expect(unavailableHelperText("Email")).toBe(
      "Unavailable because email column was not mapped",
    );
    expect(unavailableHelperText("Revenue")).toBe(
      "Unavailable because revenue column was not mapped",
    );
  });
});

describe("NO_METRIC_DATA_MESSAGE", () => {
  it("is a clear, non-generic fallback for empty (but mapped) metrics", () => {
    expect(NO_METRIC_DATA_MESSAGE).toBe("No data found for this metric");
  });
});
