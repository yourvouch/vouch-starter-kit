import { describe, expect, it } from "vitest";
import { formatCompactCurrency, formatCurrency, formatNumber } from "./format";

describe("formatCurrency", () => {
  it("formats large values with Indian digit grouping and the rupee symbol", () => {
    expect(formatCurrency(153150000)).toBe("₹15,31,50,000");
  });

  it("formats smaller values with Indian digit grouping", () => {
    expect(formatCurrency(1531500)).toBe("₹15,31,500");
  });

  it("never renders a dollar sign", () => {
    expect(formatCurrency(1531500)).not.toContain("$");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("₹0");
  });
});

describe("formatCompactCurrency", () => {
  it("abbreviates crore values", () => {
    expect(formatCompactCurrency(153150000)).toBe("₹15.32Cr");
  });

  it("abbreviates lakh values", () => {
    expect(formatCompactCurrency(1531500)).toBe("₹15.32L");
  });

  it("never renders a dollar sign", () => {
    expect(formatCompactCurrency(153150000)).not.toContain("$");
  });
});

describe("formatNumber", () => {
  it("uses Indian digit grouping for plain counts", () => {
    expect(formatNumber(1531500)).toBe("15,31,500");
  });

  it("does not add a currency symbol", () => {
    expect(formatNumber(42)).toBe("42");
  });
});
