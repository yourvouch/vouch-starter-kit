import type { Assessment, Opportunity, ReviewSnapshot, VerticalPack } from "./domain";
import { identityFor } from "./normalize";

export type Movement = "New" | "Removed" | "Progressed" | "Regressed" | "Stalled" | "Won" | "Lost" | "Reopened" | "Value increased" | "Value decreased" | "Risk increased" | "Risk decreased" | "Unchanged" | "Newly High" | "Newly Critical" | "Recovered";
export interface Match { previous?: Opportunity; current?: Opportunity; confidence: "high" | "medium" | "low"; unresolved: boolean; movements: Movement[] }
export interface ComparisonMetrics { openPipeline: number; valueAtRisk: number; attentionCount: number; overdueFollowUps: number; ownerGaps: number; reviewConfidence: number }
const risk = (items: Assessment[], id: string) => items.find((item) => item.opportunityId === id)?.score ?? 0;

export function compareReviews(previous: ReviewSnapshot, current: ReviewSnapshot, pack: VerticalPack): Match[] {
  if (previous.workspaceId !== current.workspaceId || previous.packId !== current.packId) throw new Error("Reviews must belong to the same workspace and vertical pack.");
  const oldGroups = new Map<string, Opportunity[]>(); for (const item of previous.opportunities) { const key = identityFor(item).id; oldGroups.set(key, [...(oldGroups.get(key) ?? []), item]); }
  const used = new Set<string>(); const matches: Match[] = [];
  for (const item of current.opportunities) {
    const identity = identityFor(item); const candidates = oldGroups.get(identity.id) ?? []; const unresolved = candidates.length > 1; const old = candidates.length === 1 ? candidates[0] : undefined; if (old) used.add(old.id);
    const movements: Movement[] = [];
    if (!old) movements.push("New"); else {
      const oldStage = pack.stages.find((stage) => stage.name.toLowerCase() === old.stage?.toLowerCase())?.order; const newStage = pack.stages.find((stage) => stage.name.toLowerCase() === item.stage?.toLowerCase())?.order;
      if (old.lifecycle === "open" && item.lifecycle === "won") movements.push("Won"); else if (old.lifecycle === "open" && item.lifecycle === "lost") movements.push("Lost"); else if (old.lifecycle !== "open" && item.lifecycle === "open") movements.push("Reopened"); else if (oldStage != null && newStage != null && newStage > oldStage) movements.push("Progressed"); else if (oldStage != null && newStage != null && newStage < oldStage) movements.push("Regressed");
      if (old.value != null && item.value != null && old.value !== item.value) movements.push(item.value > old.value ? "Value increased" : "Value decreased");
      const oldRisk = risk(previous.assessments, old.id), newRisk = risk(current.assessments, item.id); if (newRisk !== oldRisk) movements.push(newRisk > oldRisk ? "Risk increased" : "Risk decreased");
      if (oldRisk < 75 && newRisk >= 75) movements.push("Newly Critical"); else if (oldRisk < 50 && newRisk >= 50) movements.push("Newly High"); else if (oldRisk >= 50 && newRisk < 25) movements.push("Recovered");
      if (!movements.length && old.lastActivity === item.lastActivity && current.reviewDate > previous.reviewDate) movements.push("Stalled");
      if (!movements.length) movements.push("Unchanged");
    }
    matches.push({ previous: unresolved ? undefined : old, current: item, confidence: identity.confidence, unresolved, movements: unresolved ? [] : movements });
  }
  for (const old of previous.opportunities) if (!used.has(old.id)) matches.push({ previous: old, confidence: identityFor(old).confidence, unresolved: false, movements: ["Removed"] });
  return matches;
}

export function comparisonEligibility(previous: ReviewSnapshot | undefined, current: ReviewSnapshot | undefined) {
  const failures: string[] = [];
  if (!previous || !current) failures.push("Select two saved reviews.");
  if (previous && current && previous.id === current.id) failures.push("Previous and current reviews must be different.");
  if (previous && current && previous.workspaceId !== current.workspaceId) failures.push("Reviews must belong to the same workspace.");
  if (previous && current && previous.packId !== current.packId) failures.push("Reviews must use the same vertical pack.");
  if (previous && current && (previous.reviewDate > current.reviewDate || previous.reviewDate === current.reviewDate && previous.createdAt >= current.createdAt)) failures.push("The previous review must be earlier by review date or saved-snapshot creation order.");
  return { eligible: failures.length === 0, failures };
}

export function latestEligiblePair(reviews: ReviewSnapshot[]) {
  const ordered = [...reviews].sort((a, b) => b.reviewDate.localeCompare(a.reviewDate) || b.createdAt.localeCompare(a.createdAt));
  for (let currentIndex = 0; currentIndex < ordered.length; currentIndex++) {
    for (let previousIndex = currentIndex + 1; previousIndex < ordered.length; previousIndex++) {
      if (comparisonEligibility(ordered[previousIndex], ordered[currentIndex]).eligible) return { previous: ordered[previousIndex], current: ordered[currentIndex] };
    }
  }
  return undefined;
}

export function reviewMetrics(review: ReviewSnapshot): ComparisonMetrics {
  const active = review.opportunities.filter((item) => item.lifecycle === "open");
  const assessments = review.assessments.filter((item) => !item.excludedReason);
  return {
    openPipeline: active.reduce((sum, item) => sum + (item.value ?? 0), 0),
    valueAtRisk: assessments.reduce((sum, item) => sum + (item.valueAtRisk ?? 0), 0),
    attentionCount: assessments.filter((item) => item.score >= 25).length,
    overdueFollowUps: assessments.filter((item) => item.rules.some((rule) => rule.id === "overdue-follow-up")).length,
    ownerGaps: assessments.filter((item) => item.rules.some((rule) => rule.id === "missing-owner")).length,
    reviewConfidence: assessments.length ? Math.round(assessments.reduce((sum, item) => sum + (item.confidence === "high" ? 100 : item.confidence === "medium" ? 70 : 40), 0) / assessments.length) : 0,
  };
}

export function aggregateDeltas(previous: ReviewSnapshot, current: ReviewSnapshot) {
  const before = reviewMetrics(previous); const after = reviewMetrics(current);
  return Object.fromEntries(Object.keys(before).map((key) => [key, { previous: before[key as keyof ComparisonMetrics], current: after[key as keyof ComparisonMetrics], delta: after[key as keyof ComparisonMetrics] - before[key as keyof ComparisonMetrics] }])) as Record<keyof ComparisonMetrics, { previous: number; current: number; delta: number }>;
}
