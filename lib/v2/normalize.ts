import type { Lifecycle, Opportunity, VerticalPack } from "./domain";

export const normalizeText = (value: unknown) => String(value ?? "").trim().replace(/\s+/g, " ");
export const normalizeEmail = (value: unknown) => normalizeText(value).toLowerCase().replace(/^mailto:/, "") || undefined;
export const normalizePhone = (value: unknown) => {
  const digits = normalizeText(value).replace(/\D/g, "");
  if (!digits) return undefined;
  return digits.length === 10 ? `+91${digits}` : `+${digits.replace(/^00/, "")}`;
};
export const normalizeMoney = (value: unknown) => {
  const text = normalizeText(value).toLowerCase().replace(/[₹,$€£\s]/g, "").replace(/,/g, "");
  const match = text.match(/^(-?\d+(?:\.\d+)?)(k|l|lac|lakh|cr|crore|m)?$/);
  if (!match) return undefined;
  const factor: Record<string, number> = { k: 1e3, l: 1e5, lac: 1e5, lakh: 1e5, cr: 1e7, crore: 1e7, m: 1e6 };
  const amount = Number(match[1]) * (factor[match[2] ?? ""] ?? 1);
  return Number.isFinite(amount) && amount >= 0 ? amount : undefined;
};
export const normalizeDate = (value: unknown) => {
  const text = normalizeText(value);
  if (!text) return undefined;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(text) ? new Date(`${text}T00:00:00Z`) : new Date(text);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
};
export const lifecycleFor = (stage: string | undefined, status: string | undefined, pack: VerticalPack): Lifecycle => {
  const combined = `${stage ?? ""} ${status ?? ""}`.toLowerCase();
  if (/\b(won|customer|handover|closed won)\b/.test(combined)) return "won";
  if (/\b(lost|churned|closed lost)\b/.test(combined)) return "lost";
  const defined = pack.stages.find((item) => item.name.toLowerCase() === stage?.toLowerCase())?.lifecycle;
  return defined ?? (stage || status ? "open" : "unknown");
};
const slug = (value?: string) => normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const identityFor = (data: Partial<Opportunity>) => {
  if (data.explicitId) return { id: `id:${slug(data.explicitId)}`, confidence: "high" as const, strategy: "explicit ID" };
  if (data.email && (data.name || data.company)) return { id: `email:${normalizeEmail(data.email)}:${slug(data.company || data.name)}`, confidence: "medium" as const, strategy: "email plus name/company" };
  if (data.phone && (data.name || data.company)) return { id: `phone:${normalizePhone(data.phone)}:${slug(data.company || data.name)}`, confidence: "medium" as const, strategy: "phone plus name/company" };
  return { id: `fp:${slug(data.name)}:${slug(data.company)}:${slug(data.source)}`, confidence: "low" as const, strategy: "fingerprint" };
};
