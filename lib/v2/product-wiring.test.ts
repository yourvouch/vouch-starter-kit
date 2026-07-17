import { describe, expect, it } from "vitest";
import { actionsToCsv, createAction, dueState, measureAction, outcomeLanguage, transitionAction } from "./actions";
import { aggregateDeltas, compareReviews, comparisonEligibility, latestEligiblePair } from "./comparison";
import type { Opportunity, ReviewSnapshot } from "./domain";
import { verticalPacks } from "./packs";
import { buildReviewSnapshot } from "./reviews";
import { SCHEMA_VERSION, validateBackup, type Backup } from "./storage";

const opportunity = (input: Partial<Opportunity> & Pick<Opportunity, "id" | "name">): Opportunity => ({ lifecycle: "open", vertical: {}, sourceRow: 2, ...input });
const review = (id: string, date: string, opportunities: Opportunity[], scores: number[] = opportunities.map(() => 0)): ReviewSnapshot => ({ id, workspaceId: "w", packId: "general", reviewDate: date, createdAt: `${date}T10:00:00.000Z`, readiness: "full", opportunities, assessments: opportunities.map((item, index) => ({ opportunityId: item.id, score: scores[index], band: scores[index] >= 50 ? "high" : "low", confidence: "high", rules: [], unavailableChecks: [], recommendedNextStep: "Continue", valueAtRisk: scores[index] >= 50 ? item.value : undefined })) });

describe("saved review construction", () => {
  it("builds a normalized immutable-ready snapshot without file data", () => { const snapshot = buildReviewSnapshot({ workspaceId: "w", packId: "general", reviewDate: "2026-07-17", readiness: "full", id: "r", createdAt: "2026-07-17T00:00:00.000Z", rows: [{ Deal: "Aster", Amount: "₹2 lakh", Stage: "Lead" }], mappings: [{ field: "name", column: "Deal", confidence: 1, explanation: "", samples: [], importance: "required", ambiguous: [] }, { field: "value", column: "Amount", confidence: 1, explanation: "", samples: [], importance: "recommended", ambiguous: [] }, { field: "stage", column: "Stage", confidence: 1, explanation: "", samples: [], importance: "required", ambiguous: [] }] }); expect(snapshot.opportunities[0].value).toBe(200000); expect(snapshot).not.toHaveProperty("file"); expect(snapshot).not.toHaveProperty("rows"); });
});

describe("comparison eligibility and matching", () => {
  const old = opportunity({ id: "id:a", explicitId: "A", name: "Aster", stage: "Lead", value: 100 }); const current = opportunity({ id: "id:a", explicitId: "A", name: "Aster", stage: "Proposal", value: 150 });
  const previous = review("p", "2026-07-01", [old], [70]); const latest = review("c", "2026-07-17", [current], [30]);
  it("selects the latest eligible pair", () => expect(latestEligiblePair([previous, latest])).toEqual({ previous, current: latest }));
  it("reports exact eligibility failures", () => expect(comparisonEligibility(latest, previous).failures).toContain("The previous review date must be earlier than the current review date."));
  it("matches explicit IDs with high confidence and movement", () => { const match = compareReviews(previous, latest, verticalPacks.general)[0]; expect(match.confidence).toBe("high"); expect(match.movements).toEqual(expect.arrayContaining(["Progressed", "Value increased", "Risk decreased"])); });
  it("matches email and phone identities with medium confidence", () => { const emailOld = opportunity({ id: "email:a", name: "Deal", company: "Acme", email: "x@a.com" }); const emailNew = { ...emailOld }; expect(compareReviews(review("a", "2026-01-01", [emailOld]), review("b", "2026-02-01", [emailNew]), verticalPacks.general)[0].confidence).toBe("medium"); const phoneOld = opportunity({ id: "phone:a", name: "Deal", company: "Acme", phone: "+919999999999" }); expect(compareReviews(review("a", "2026-01-01", [phoneOld]), review("b", "2026-02-01", [{ ...phoneOld }]), verticalPacks.general)[0].confidence).toBe("medium"); });
  it("classifies new and removed opportunities", () => { const matches = compareReviews(review("a", "2026-01-01", [old]), review("b", "2026-02-01", [opportunity({ id: "id:b", explicitId: "B", name: "Beta" })]), verticalPacks.general); expect(matches.flatMap((item) => item.movements)).toEqual(expect.arrayContaining(["New", "Removed"])); });
  it("excludes duplicate identity conflicts", () => { const duplicate = { ...old, id: "second" }; const match = compareReviews(review("a", "2026-01-01", [old, duplicate]), latest, verticalPacks.general)[0]; expect(match.unresolved).toBe(true); expect(match.movements).toEqual([]); });
  it("computes previous/current/delta aggregates", () => expect(aggregateDeltas(previous, latest).openPipeline).toEqual({ previous: 100, current: 150, delta: 50 }));
});

describe("persistent action behavior", () => {
  const action = createAction({ workspaceId: "w", reviewId: "p", source: "founder-priority", title: "Advance Aster", reviewDate: "2026-07-01", opportunityIds: ["id:a"], priority: "high" });
  it("creates source-linked actions with suggested dates", () => { expect(action.source).toBe("founder-priority"); expect(action.dueDate).toBe("2026-07-06"); });
  it("records lifecycle timestamps and carry-forward state", () => { expect(transitionAction(action, "Accepted", "2026-07-02T00:00:00Z").acceptedAt).toBeTruthy(); expect(transitionAction(action, "Carried forward").carriedForward).toBe(true); expect(transitionAction({ ...action, status: "Completed" }, "Accepted").status).toBe("Accepted"); });
  it("reports overdue and due-today states", () => { expect(dueState({ ...action, dueDate: "2026-07-01" }, "2026-07-02")).toBe("overdue"); expect(dueState({ ...action, dueDate: "2026-07-02" }, "2026-07-02")).toBe("due-today"); });
  it("measures every linked opportunity separately", () => { const oldA = opportunity({ id: "id:a", explicitId: "A", name: "Aster", stage: "Lead", owner: undefined }); const newA = opportunity({ id: "id:a", explicitId: "A", name: "Aster", stage: "Proposal", owner: "Meera" }); const measured = measureAction(action, review("p", "2026-07-01", [oldA], [70]), review("c", "2026-07-17", [newA], [20]), verticalPacks.general, "2026-07-17T12:00:00Z"); expect(measured.outcome).toBe("Improved"); expect(measured.measurements).toHaveLength(1); expect(measured.measurements[0].previousEvidence.owner).toBeUndefined(); expect(measured.measurements[0].currentEvidence.owner).toBe("Meera"); });
  it("retains unable-to-measure outcomes", () => { const measured = measureAction({ ...action, opportunityIds: ["missing"] }, review("p", "2026-07-01", []), review("c", "2026-07-17", []), verticalPacks.general); expect(measured.outcome).toBe("Unable to measure"); });
  it("uses explicit non-causal language", () => { expect(outcomeLanguage("Improved")).toContain("cannot establish"); expect(outcomeLanguage("Improved")).toContain("associated improvement"); });
  it("exports escaped CSV", () => { const csv = actionsToCsv([{ ...action, title: 'Call "Aster"' }]); expect(csv).toContain('"Call ""Aster"""'); expect(csv).toContain('"founder-priority"'); });
});

describe("versioned backups", () => {
  const backup: Backup = { schemaVersion: SCHEMA_VERSION, exportedAt: "2026-07-17T00:00:00Z", workspaces: [], reviews: [], actions: [] };
  it("accepts the current schema", () => expect(validateBackup(backup)).toEqual(backup));
  it("rejects future schemas", () => expect(() => validateBackup({ ...backup, schemaVersion: SCHEMA_VERSION + 1 })).toThrow(/newer/));
  it("requires every persisted collection", () => expect(() => validateBackup({ schemaVersion: SCHEMA_VERSION, workspaces: [] })).toThrow(/missing/));
});
