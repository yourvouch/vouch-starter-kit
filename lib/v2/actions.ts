import type { Assessment, Opportunity, PriorityBand, ReviewSnapshot, VerticalPack } from "./domain";
import { compareReviews, type Match, type Movement } from "./comparison";

export type ActionStatus = "Recommended" | "Accepted" | "In progress" | "Completed" | "Dismissed" | "Carried forward";
export type OutcomeState = "Not yet measured" | "Improved" | "No meaningful change" | "Worsened" | "Opportunity won" | "Opportunity lost" | "Unable to measure";
export type ActionSource = "founder-priority" | "assessment" | "comparison-priority" | "movement" | "manual";

export interface OutcomeMeasurement {
  opportunityId: string;
  opportunityName: string;
  state: OutcomeState;
  matchingConfidence: "high" | "medium" | "low";
  previousReviewId: string;
  currentReviewId: string;
  previousEvidence: { score?: number; stage?: string; owner?: string; hasContact: boolean };
  currentEvidence: { score?: number; stage?: string; owner?: string; hasContact: boolean };
  movements: Movement[];
  measuredAt: string;
}

export interface VouchAction {
  schemaVersion: 1;
  id: string;
  workspaceId: string;
  reviewId: string;
  comparisonId?: string;
  findingId?: string;
  source: ActionSource;
  opportunityIds: string[];
  title: string;
  rationale: string;
  recommendedNextStep: string;
  expectedOutcome: string;
  successMeasure: string;
  owner?: string;
  priority: PriorityBand;
  status: ActionStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  dismissedAt?: string;
  notes: string;
  outcome: OutcomeState;
  outcomeEvidence?: string;
  measurements: OutcomeMeasurement[];
  carriedForward: boolean;
  affectedValue?: number;
}

export const addDays = (iso: string, days: number, business = false) => {
  const date = new Date(`${iso}T12:00:00Z`);
  let remaining = days;
  while (remaining) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (!business || ![0, 6].includes(date.getUTCDay())) remaining--;
  }
  return date.toISOString().slice(0, 10);
};

export const suggestedDueDate = (reviewDate: string, priority: PriorityBand) => priority === "critical" ? addDays(reviewDate, 1, true) : priority === "high" ? addDays(reviewDate, 3, true) : priority === "medium" ? addDays(reviewDate, 7) : addDays(reviewDate, 14);
const closed = new Set<ActionStatus>(["Completed", "Dismissed"]);
export const duplicateAction = (actions: VouchAction[], candidate: Pick<VouchAction, "workspaceId" | "title" | "opportunityIds" | "status">) => actions.some((item) => item.workspaceId === candidate.workspaceId && item.title.trim().toLowerCase() === candidate.title.trim().toLowerCase() && !closed.has(item.status) && item.opportunityIds.some((id) => candidate.opportunityIds.includes(id)));

export function createAction(input: { workspaceId: string; reviewId: string; source: ActionSource; title: string; reviewDate: string; opportunityIds?: string[]; comparisonId?: string; findingId?: string; rationale?: string; recommendedNextStep?: string; expectedOutcome?: string; successMeasure?: string; owner?: string; priority?: PriorityBand; affectedValue?: number }) {
  const now = new Date().toISOString(); const priority = input.priority ?? "medium";
  return { schemaVersion: 1, id: crypto.randomUUID(), workspaceId: input.workspaceId, reviewId: input.reviewId, comparisonId: input.comparisonId, findingId: input.findingId, source: input.source, opportunityIds: input.opportunityIds ?? [], title: input.title.trim(), rationale: input.rationale ?? "", recommendedNextStep: input.recommendedNextStep ?? "", expectedOutcome: input.expectedOutcome ?? "", successMeasure: input.successMeasure ?? "", owner: input.owner, priority, status: "Recommended", dueDate: suggestedDueDate(input.reviewDate, priority), createdAt: now, updatedAt: now, notes: "", outcome: "Not yet measured", measurements: [], carriedForward: false, affectedValue: input.affectedValue } satisfies VouchAction;
}

export function transitionAction(action: VouchAction, status: ActionStatus, now = new Date().toISOString()) {
  const timestamps: Partial<VouchAction> = {};
  if (status === "Accepted") timestamps.acceptedAt = now;
  if (status === "In progress") timestamps.startedAt = now;
  if (status === "Completed") timestamps.completedAt = now;
  if (status === "Dismissed") timestamps.dismissedAt = now;
  return { ...action, ...timestamps, status, updatedAt: now, carriedForward: status === "Carried forward" || action.carriedForward };
}

const assessmentFor = (review: ReviewSnapshot, id: string) => review.assessments.find((item) => item.opportunityId === id);
const evidence = (opportunity: Opportunity | undefined, assessment: Assessment | undefined) => ({ score: assessment?.score, stage: opportunity?.stage, owner: opportunity?.owner, hasContact: Boolean(opportunity?.email || opportunity?.phone) });
function stateFor(match: Match, previousScore?: number, currentScore?: number): OutcomeState {
  if (!match.previous || !match.current || match.unresolved) return "Unable to measure";
  if (match.movements.includes("Won")) return "Opportunity won";
  if (match.movements.includes("Lost")) return "Opportunity lost";
  if (match.movements.some((item) => ["Progressed", "Risk decreased", "Recovered"].includes(item))) return "Improved";
  if (match.movements.some((item) => ["Regressed", "Risk increased", "Newly High", "Newly Critical"].includes(item))) return "Worsened";
  if (previousScore != null && currentScore != null && currentScore < previousScore) return "Improved";
  if (previousScore != null && currentScore != null && currentScore > previousScore) return "Worsened";
  return "No meaningful change";
}

export function measureAction(action: VouchAction, previous: ReviewSnapshot, current: ReviewSnapshot, pack: VerticalPack, now = new Date().toISOString()) {
  const matches = compareReviews(previous, current, pack);
  const measurements = action.opportunityIds.map((id) => {
    const match = matches.find((item) => item.previous?.id === id || item.current?.id === id);
    if (!match) return { opportunityId: id, opportunityName: "Unknown opportunity", state: "Unable to measure", matchingConfidence: "low", previousReviewId: previous.id, currentReviewId: current.id, previousEvidence: { score: undefined, stage: undefined, owner: undefined, hasContact: false }, currentEvidence: { score: undefined, stage: undefined, owner: undefined, hasContact: false }, movements: [], measuredAt: now } satisfies OutcomeMeasurement;
    const previousAssessment = match.previous ? assessmentFor(previous, match.previous.id) : undefined; const currentAssessment = match.current ? assessmentFor(current, match.current.id) : undefined;
    return { opportunityId: id, opportunityName: match.current?.name ?? match.previous?.name ?? "Unknown opportunity", state: stateFor(match, previousAssessment?.score, currentAssessment?.score), matchingConfidence: match.confidence, previousReviewId: previous.id, currentReviewId: current.id, previousEvidence: evidence(match.previous, previousAssessment), currentEvidence: evidence(match.current, currentAssessment), movements: match.movements, measuredAt: now } satisfies OutcomeMeasurement;
  });
  const measurable = measurements.filter((item) => item.state !== "Unable to measure");
  const outcome: OutcomeState = !measurements.length || !measurable.length ? "Unable to measure" : measurable.some((item) => ["Improved", "Opportunity won"].includes(item.state)) ? "Improved" : measurable.some((item) => ["Worsened", "Opportunity lost"].includes(item.state)) ? "Worsened" : "No meaningful change";
  return { ...action, measurements, outcome, outcomeEvidence: outcomeLanguage(outcome), updatedAt: now };
}

export const dueState = (action: VouchAction, today: string) => closed.has(action.status) ? "closed" : action.dueDate < today ? "overdue" : action.dueDate === today ? "due-today" : "upcoming";
export const outcomeLanguage = (state: OutcomeState) => {
  if (state === "Not yet measured") return "This action has not yet been measured.";
  if (state === "Unable to measure") return "This outcome could not be measured from the stored reviews. Vouch cannot establish that the action caused any result.";
  const observation: Record<Exclude<OutcomeState, "Not yet measured" | "Unable to measure">, string> = { Improved: "improvement", "No meaningful change": "lack of meaningful change", Worsened: "worsening", "Opportunity won": "opportunity win", "Opportunity lost": "opportunity loss" };
  return `An associated ${observation[state]} was observed. Vouch cannot establish that the action caused this result.`;
};

const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
export function actionsToCsv(actions: VouchAction[]) {
  const headers = ["Title", "Workspace ID", "Source", "Priority", "Status", "Owner", "Due date", "Due state", "Expected outcome", "Success measure", "Outcome", "Opportunity IDs", "Notes"];
  const today = new Date().toISOString().slice(0, 10);
  return [headers.map(csvCell).join(","), ...actions.map((item) => [item.title, item.workspaceId, item.source, item.priority, item.status, item.owner, item.dueDate, dueState(item, today), item.expectedOutcome, item.successMeasure, item.outcome, item.opportunityIds.join(";"), item.notes].map(csvCell).join(","))].join("\n");
}
