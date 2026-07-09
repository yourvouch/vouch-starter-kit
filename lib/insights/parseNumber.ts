export function parseNumericValue(raw: string | undefined | null): number | null {
  if (!raw) return null;

  const cleaned = raw.replace(/[^0-9.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === ".") return null;

  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}
