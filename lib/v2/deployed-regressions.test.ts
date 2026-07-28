import { describe, expect, it } from "vitest";
import { assessOpportunity, reviewRiskSummary } from "./intelligence";
import { suggestMappings, updateMapping } from "./mapping";
import { verticalPacks } from "./packs";
import { buildReviewSnapshot } from "./reviews";
import type { Opportunity, PackId } from "./domain";

describe("deployed vertical regressions", () => {
  it("keeps each vertical's sample, fields, stages, rules, and saved pack ID", () => {
    const expected: Record<Exclude<PackId, "recruitment">, { field: string; stage: string; rule?: string }> = {
      general: { field: "company", stage: "Negotiation" },
      interiors: { field: "projectType", stage: "Design proposal", rule: "site-visit-gap" },
      agency: { field: "serviceLine", stage: "Contracting", rule: "proposal-silence" },
      saas: { field: "mrr", stage: "Trial", rule: "trial-ending" },
    };
    for (const packId of Object.keys(expected) as Exclude<PackId, "recruitment">[]) {
      const pack = verticalPacks[packId]; const spec = expected[packId];
      expect(pack.fields.some((field) => field.key === spec.field)).toBe(true);
      expect(pack.stages.some((stage) => stage.name === spec.stage)).toBe(true);
      expect(pack.stages.some((stage) => stage.name === String(pack.samples.current[0].Stage))).toBe(true);
      if (spec.rule) expect(pack.rules.some((rule) => rule.id === spec.rule)).toBe(true);
      const mappings = suggestMappings(Object.keys(pack.samples.current[0]), pack.samples.current, pack);
      expect(buildReviewSnapshot({ workspaceId: `w-${packId}`, packId, reviewDate: "2026-07-17", readiness: "reduced", rows: pack.samples.current, mappings }).packId).toBe(packId);
    }
  });

  it("supports clearing and duplicate-column prevention", () => {
    const rows = [{ Project: "Villa", Client: "Asha", Stage: "Enquiry" }];
    const detected = suggestMappings(Object.keys(rows[0]), rows, verticalPacks.interiors);
    const cleared = updateMapping(detected, "name", undefined, rows);
    expect(cleared.find((item) => item.field === "name")?.column).toBeUndefined();
    const remapped = updateMapping(cleared, "company", "Project", rows);
    expect(remapped.find((item) => item.field === "company")?.column).toBe("Project");
    expect(remapped.find((item) => item.field === "name")?.column).toBeUndefined();
    expect(remapped.find((item) => item.field === "company")?.explanation).toContain("Manually selected");
  });

  it("derives a useful interior label and preserves the client", () => {
    const rows = [{ Client: "Asha Rao", "Project Type": "Villa", Location: "Pune", Stage: "Enquiry" }];
    const mappings = suggestMappings(Object.keys(rows[0]), rows, verticalPacks.interiors);
    const snapshot = buildReviewSnapshot({ workspaceId: "w", packId: "interiors", reviewDate: "2026-07-17", readiness: "reduced", rows, mappings });
    expect(snapshot.opportunities[0].name).toBe("Villa · Pune");
    expect(snapshot.opportunities[0].company).toBe("Asha Rao");
    expect(snapshot.opportunities[0].vertical.clientName).toBe("Asha Rao");
  });

  it("does not turn missing follow-up alone into blanket high priority or value at risk", () => {
    const opportunities: Opportunity[] = Array.from({ length: 100 }, (_, index) => ({ id: `i-${index}`, name: `Project ${index + 1}`, company: `Client ${index + 1}`, value: index < 20 ? 50000 : undefined, stage: "Enquiry", lifecycle: "open", vertical: { projectType: "Home", location: "Pune" }, sourceRow: index + 2 }));
    const assessments = opportunities.map((item) => assessOpportunity(item, "2026-07-17", verticalPacks.interiors));
    expect(assessments.filter((item) => ["high", "critical"].includes(item.band))).toHaveLength(0);
    expect(assessments.every((item) => item.rules.every((rule) => rule.id !== "missing-follow-up"))).toBe(true);
    expect(assessments.every((item) => item.unavailableChecks.some((check) => check.includes("data-limited")))).toBe(true);
    const risk = reviewRiskSummary(opportunities, assessments);
    expect(risk.openPipelineValue).toBe(1_000_000);
    expect(risk.includedCount).toBe(0);
    expect(risk.valueIncluded).toBeUndefined();
    expect(risk.unavailableMonetaryCount).toBe(80);
  });
});
