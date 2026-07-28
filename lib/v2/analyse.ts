import type { VouchAction } from "./actions";
import { compareReviews, reviewMetrics, type Match } from "./comparison";
import type { PackId, ReviewSnapshot, VerticalPack } from "./domain";
import { founderPriorities, reviewRiskSummary } from "./intelligence";
import type { MappingSuggestion } from "./mapping";
import { buildReviewSnapshot } from "./reviews";

export interface AnalyseDatasetInput {
  pack: VerticalPack;
  rows: Record<string, string>[];
  mapping: MappingSuggestion[];
  workspaceId?: string;
  reviewDate: string;
  readiness?: ReviewSnapshot["readiness"];
  previousReview?: ReviewSnapshot;
  actions?: VouchAction[];
  reviewId?: string;
  createdAt?: string;
}

export interface AnalysisResult {
  schemaVersion: 1;
  pack: { id: PackId; name: string; version: string };
  review: ReviewSnapshot;
  metrics: ReturnType<typeof reviewMetrics>;
  risk: ReturnType<typeof reviewRiskSummary>;
  priorities: ReturnType<typeof founderPriorities>;
  comparison?: { previousReviewId: string; matches: Match[] };
  actionSummary: { total: number; open: number; measured: number };
}

export function analyseDataset(input: AnalyseDatasetInput): AnalysisResult {
  const review = buildReviewSnapshot({
    workspaceId: input.workspaceId ?? "headless-analysis",
    packId: input.pack.id,
    reviewDate: input.reviewDate,
    readiness: input.readiness ?? "reduced",
    rows: input.rows,
    mappings: input.mapping,
    id: input.reviewId,
    createdAt: input.createdAt,
  });
  const actions = input.actions ?? [];
  return {
    schemaVersion: 1,
    pack: { id: input.pack.id, name: input.pack.name, version: input.pack.version },
    review,
    metrics: reviewMetrics(review),
    risk: reviewRiskSummary(review.opportunities, review.assessments),
    priorities: founderPriorities(review.opportunities, review.assessments),
    comparison: input.previousReview ? { previousReviewId: input.previousReview.id, matches: compareReviews(input.previousReview, review, input.pack) } : undefined,
    actionSummary: {
      total: actions.length,
      open: actions.filter((action) => !["Completed", "Dismissed"].includes(action.status)).length,
      measured: actions.filter((action) => action.outcome !== "Not yet measured").length,
    },
  };
}
