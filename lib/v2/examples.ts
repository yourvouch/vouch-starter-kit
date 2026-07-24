import { createAction, measureAction, transitionAction, type VouchAction } from "./actions";
import { aggregateDeltas, compareReviews } from "./comparison";
import type { PackId, ReviewSnapshot } from "./domain";
import { suggestMappings } from "./mapping";
import { verticalPacks } from "./packs";
import { buildReviewSnapshot } from "./reviews";

export const EXAMPLE_PACK_IDS = ["interiors", "agency", "saas", "general", "recruitment"] as const satisfies readonly PackId[];
export type ExamplePackId = (typeof EXAMPLE_PACK_IDS)[number];
export const EXAMPLE_SLUGS = { interiors: "interiors", agency: "agency", saas: "saas", "general-sales": "general", recruitment: "recruitment" } as const;
export type ExampleSlug = keyof typeof EXAMPLE_SLUGS;

const dates: Record<ExamplePackId, [string, string]> = {
  interiors: ["2026-06-15", "2026-07-15"],
  agency: ["2026-06-15", "2026-07-15"],
  saas: ["2026-06-15", "2026-07-15"],
  general: ["2026-06-15", "2026-07-15"],
  recruitment: ["2026-06-15", "2026-07-15"],
};

function review(packId: ExamplePackId, period: "previous" | "current"): ReviewSnapshot {
  const pack = verticalPacks[packId];
  const rows = pack.samples[period];
  return buildReviewSnapshot({
    workspaceId: `example-${packId}`,
    packId,
    reviewDate: dates[packId][period === "previous" ? 0 : 1],
    readiness: "reduced",
    rows,
    mappings: suggestMappings(Object.keys(rows[0]), rows, pack),
    id: `example-${packId}-${period}`,
    createdAt: `${dates[packId][period === "previous" ? 0 : 1]}T09:00:00.000Z`,
  });
}

function exampleActions(packId: ExamplePackId, previous: ReviewSnapshot, current: ReviewSnapshot): VouchAction[] {
  const opportunityId = previous.opportunities[0]?.id;
  const base = createAction({
    workspaceId: previous.workspaceId,
    reviewId: previous.id,
    source: "founder-priority",
    title: `Advance ${previous.opportunities[0]?.name ?? verticalPacks[packId].name}`,
    reviewDate: previous.reviewDate,
    opportunityIds: opportunityId ? [opportunityId] : [],
    rationale: "The stored review showed supported delay or follow-up evidence.",
    recommendedNextStep: "Confirm the next responsible action.",
    expectedOutcome: "Progress the opportunity or reduce supported risk.",
    successMeasure: "Stage progression, lower risk score, completed ownership, or a recorded outcome.",
    priority: "high",
  });
  const completed = transitionAction({ ...base, id: `example-${packId}-action-completed`, createdAt: "2026-06-15T10:00:00.000Z", updatedAt: "2026-06-15T10:00:00.000Z" }, "Completed", "2026-06-18T10:00:00.000Z");
  const measured = measureAction(completed, previous, current, verticalPacks[packId], "2026-07-15T10:00:00.000Z");
  const active = createAction({
    workspaceId: current.workspaceId,
    reviewId: current.id,
    source: "movement",
    title: `Review ${current.opportunities[1]?.name ?? "current movement"}`,
    reviewDate: current.reviewDate,
    opportunityIds: current.opportunities[1] ? [current.opportunities[1].id] : [],
    rationale: "The latest comparison contains a movement that deserves attention.",
    priority: "medium",
  });
  return [measured, { ...transitionAction(active, "In progress", "2026-07-16T10:00:00.000Z"), id: `example-${packId}-action-active`, createdAt: "2026-07-15T10:00:00.000Z" }];
}

export function buildExampleWorkspace(packId: ExamplePackId) {
  const pack = verticalPacks[packId];
  const previous = review(packId, "previous");
  const current = review(packId, "current");
  const actions = exampleActions(packId, previous, current);
  return {
    schemaVersion: 1 as const,
    sample: true as const,
    workspace: { id: `example-${packId}`, name: `${pack.name} sample workspace`, packId, createdAt: previous.createdAt, updatedAt: current.createdAt, mapping: {}, preferences: {} },
    pack,
    reviews: [previous, current],
    current,
    previous,
    comparison: { matches: compareReviews(previous, current, pack), deltas: aggregateDeltas(previous, current) },
    actions,
  };
}

export function isExamplePackId(value: string): value is ExamplePackId {
  return EXAMPLE_PACK_IDS.includes(value as ExamplePackId);
}

export function packIdForExampleSlug(value: string): ExamplePackId | undefined {
  return EXAMPLE_SLUGS[value as ExampleSlug];
}
