import type { MappingSuggestion } from "./mapping";
import type { Opportunity, PackId, ReviewSnapshot } from "./domain";
import { assessOpportunity } from "./intelligence";
import { identityFor, lifecycleFor, normalizeDate, normalizeEmail, normalizeMoney, normalizePhone, normalizeText } from "./normalize";
import { verticalPacks } from "./packs";

const cleanHeader = (value: string) => value.toLowerCase().replace(/[_-]+/g, " ").trim();
const valueFor = (row: Record<string, string>, mappings: MappingSuggestion[], field: string) => {
  const column = mappings.find((item) => item.field === field)?.column;
  return column ? row[column] : undefined;
};

export function buildReviewSnapshot(input: { workspaceId: string; packId: PackId; reviewDate: string; readiness: ReviewSnapshot["readiness"]; rows: Record<string, string>[]; mappings: MappingSuggestion[]; id?: string; createdAt?: string }) {
  const pack = verticalPacks[input.packId];
  const opportunities = input.rows.map((row, index) => {
    const company = normalizeText(valueFor(row, input.mappings, "company")) || undefined;
    const explicitName = normalizeText(valueFor(row, input.mappings, "name")) || undefined;
    const projectType = normalizeText(valueFor(row, input.mappings, "projectType")) || undefined;
    const location = normalizeText(valueFor(row, input.mappings, "location")) || undefined;
    const displayName = pack.id === "interiors" ? explicitName ?? (projectType && location ? `${projectType} · ${location}` : company && projectType ? `${company} · ${projectType}` : company) : explicitName;
    const base: Partial<Opportunity> = {
      explicitId: valueFor(row, input.mappings, "opportunityId"),
      name: displayName || `Opportunity ${index + 1}`,
      company,
      email: normalizeEmail(valueFor(row, input.mappings, "email")),
      phone: normalizePhone(valueFor(row, input.mappings, "phone")),
      value: normalizeMoney(valueFor(row, input.mappings, "value")),
      currency: normalizeText(valueFor(row, input.mappings, "currency")) || "INR",
      stage: normalizeText(valueFor(row, input.mappings, "stage")) || undefined,
      status: normalizeText(valueFor(row, input.mappings, "status")) || undefined,
      owner: normalizeText(valueFor(row, input.mappings, "owner")) || undefined,
      source: normalizeText(valueFor(row, input.mappings, "source")) || undefined,
      createdDate: normalizeDate(valueFor(row, input.mappings, "createdDate")),
      lastActivity: normalizeDate(valueFor(row, input.mappings, "lastActivity")),
      nextFollowUp: normalizeDate(valueFor(row, input.mappings, "nextFollowUp")),
      expectedClose: normalizeDate(valueFor(row, input.mappings, "expectedClose")),
    };
    const mappedColumns = new Set(input.mappings.map((item) => item.column).filter(Boolean));
    const vertical = { ...Object.fromEntries(Object.entries(row).filter(([header]) => !mappedColumns.has(header)).map(([header, value]) => [cleanHeader(header), value])), projectType, location, siteVisit: normalizeDate(valueFor(row, input.mappings, "siteVisit")), startDate: normalizeDate(valueFor(row, input.mappings, "startDate")), clientName: company };
    return { ...base, id: identityFor(base).id, lifecycle: lifecycleFor(base.stage, base.status, pack), vertical, sourceRow: index + 2 } as Opportunity;
  });
  return {
    id: input.id ?? crypto.randomUUID(), workspaceId: input.workspaceId, packId: input.packId, reviewDate: input.reviewDate,
    createdAt: input.createdAt ?? new Date().toISOString(), readiness: input.readiness, opportunities,
    assessments: opportunities.map((item) => assessOpportunity(item, input.reviewDate, pack)),
  } satisfies ReviewSnapshot;
}
