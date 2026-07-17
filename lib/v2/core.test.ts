import { describe, expect, it } from "vitest";
import { verticalPacks } from "./packs";
import { identityFor, normalizeEmail, normalizeMoney, normalizePhone } from "./normalize";
import { mappingReadiness, suggestMappings } from "./mapping";
import { assessOpportunity } from "./intelligence";
import { duplicateAction, outcomeLanguage, suggestedDueDate } from "./actions";
import type { Opportunity } from "./domain";

describe("v2 foundation", () => {
  it("defines four complete typed packs", () => { expect(Object.keys(verticalPacks)).toEqual(["general", "interiors", "agency", "saas"]); for (const pack of Object.values(verticalPacks)) { expect(pack.fields.some((field) => field.importance === "required")).toBe(true); expect(pack.stages.some((stage) => stage.lifecycle === "won")).toBe(true); expect(pack.samples.current.length).toBeGreaterThan(0); } });
  it("normalizes India-first values and contacts", () => { expect(normalizeMoney("₹12.5 lakh")).toBe(1_250_000); expect(normalizeEmail(" MAILTO:Founder@Example.COM ")).toBe("founder@example.com"); expect(normalizePhone("98765 43210")).toBe("+919876543210"); });
  it("uses identity strategies in deterministic order", () => { expect(identityFor({ explicitId: "A-1", email: "a@b.com", name: "A" }).strategy).toBe("explicit ID"); expect(identityFor({ email: "a@b.com", company: "A" }).confidence).toBe("medium"); expect(identityFor({ name: "A" }).confidence).toBe("low"); });
  it("shows confidence, samples, and readiness", () => { const pack = verticalPacks.general; const rows = [{ Name: "Deal", Stage: "Lead", Revenue: "100" }]; const result = suggestMappings(Object.keys(rows[0]), rows, pack); expect(result.find((item) => item.field === "name")?.confidence).toBe(1); expect(result.find((item) => item.field === "name")?.samples).toEqual(["Deal"]); expect(mappingReadiness(result)).not.toBe("missing-essential"); });
});

describe("attention and actions", () => {
  const opportunity: Opportunity = { id: "a", name: "Aster", value: 100000, stage: "Proposal", lifecycle: "open", lastActivity: "2026-05-01", nextFollowUp: "2026-07-01", vertical: {}, sourceRow: 2 };
  it("scores explainably without inventing money", () => { const assessment = assessOpportunity(opportunity, "2026-07-17", verticalPacks.general); expect(assessment.score).toBeGreaterThanOrEqual(50); expect(assessment.rules.map((rule) => rule.id)).toContain("overdue-follow-up"); expect(assessment.valueAtRisk).toBe(100000); expect(assessOpportunity({ ...opportunity, value: undefined }, "2026-07-17", verticalPacks.general).valueAtRisk).toBeUndefined(); });
  it("excludes closed lifecycle records", () => { expect(assessOpportunity({ ...opportunity, lifecycle: "won" }, "2026-07-17", verticalPacks.general).excludedReason).toContain("won"); });
  it("suggests due dates and protects causal language", () => { expect(suggestedDueDate("2026-07-17", "critical")).toBe("2026-07-20"); expect(outcomeLanguage("Improved")).toContain("cannot establish"); });
  it("prevents duplicate live actions", () => { const base = { schemaVersion: 1 as const, id: "1", workspaceId: "w", reviewId: "r", source: "manual" as const, opportunityIds: ["o"], title: "Follow up", rationale: "", recommendedNextStep: "", expectedOutcome: "", successMeasure: "", priority: "high" as const, status: "Accepted" as const, dueDate: "2026-07-20", createdAt: "", updatedAt: "", notes: "", outcome: "Not yet measured" as const, measurements: [], carriedForward: false }; expect(duplicateAction([base], base)).toBe(true); });
});
