import type { VouchAction } from "./actions";
import { aggregateDeltas, compareReviews } from "./comparison";
import type { PackId, ReviewSnapshot, VerticalPack } from "./domain";
import { validatePack } from "./packs";
import type { Workspace } from "./storage";

export const REVIEW_EXPORT_SCHEMA_VERSION = 1 as const;
export const PACK_CONFIG_SCHEMA_VERSION = 1 as const;

export interface ReviewExport {
  schemaVersion: typeof REVIEW_EXPORT_SCHEMA_VERSION;
  exportedAt: string;
  workspace: Pick<Workspace, "id" | "name" | "packId" | "createdAt" | "updatedAt">;
  pack: { id: PackId; name: string; version: string };
  review: ReviewSnapshot;
  actions: VouchAction[];
  comparison?: {
    previousReviewId: string;
    currentReviewId: string;
    deltas: ReturnType<typeof aggregateDeltas>;
    matches: ReturnType<typeof compareReviews>;
  };
  privacy: { sourceFileIncluded: false; uploadedRowsIncluded: false };
}

export function createReviewExport(input: {
  workspace: Workspace;
  pack: VerticalPack;
  review: ReviewSnapshot;
  actions?: VouchAction[];
  previousReview?: ReviewSnapshot;
  exportedAt?: string;
}): ReviewExport {
  return {
    schemaVersion: REVIEW_EXPORT_SCHEMA_VERSION,
    exportedAt: input.exportedAt ?? new Date().toISOString(),
    workspace: {
      id: input.workspace.id,
      name: input.workspace.name,
      packId: input.workspace.packId,
      createdAt: input.workspace.createdAt,
      updatedAt: input.workspace.updatedAt,
    },
    pack: { id: input.pack.id, name: input.pack.name, version: input.pack.version },
    review: structuredClone(input.review),
    actions: structuredClone(input.actions ?? []),
    comparison: input.previousReview ? {
      previousReviewId: input.previousReview.id,
      currentReviewId: input.review.id,
      deltas: aggregateDeltas(input.previousReview, input.review),
      matches: compareReviews(input.previousReview, input.review, input.pack),
    } : undefined,
    privacy: { sourceFileIncluded: false, uploadedRowsIncluded: false },
  };
}

export function validateReviewExport(input: unknown): ReviewExport {
  if (!input || typeof input !== "object") throw new Error("Review export must be a JSON object.");
  const value = input as Partial<ReviewExport>;
  if (value.schemaVersion !== REVIEW_EXPORT_SCHEMA_VERSION) throw new Error("Unsupported review export schema.");
  if (!value.workspace || !value.review || !value.pack || !Array.isArray(value.actions)) throw new Error("Review export is incomplete.");
  if (value.workspace.packId !== value.review.packId || value.pack.id !== value.review.packId) throw new Error("Pack identity does not match the review.");
  if (value.privacy?.sourceFileIncluded !== false || value.privacy.uploadedRowsIncluded !== false) throw new Error("Unsafe review export privacy metadata.");
  return structuredClone(value as ReviewExport);
}

export interface PortablePackConfig {
  schemaVersion: typeof PACK_CONFIG_SCHEMA_VERSION;
  kind: "vouch-portable-pack";
  pack: Omit<VerticalPack, "samples">;
  capabilities: { executableRules: false; samplesIncluded: false };
}

export function exportPackConfig(pack: VerticalPack): PortablePackConfig {
  const definition = Object.fromEntries(Object.entries(pack).filter(([key]) => key !== "samples")) as Omit<VerticalPack, "samples">;
  return {
    schemaVersion: PACK_CONFIG_SCHEMA_VERSION,
    kind: "vouch-portable-pack",
    pack: structuredClone(definition),
    capabilities: { executableRules: false, samplesIncluded: false },
  };
}

export function validatePackConfig(input: unknown): PortablePackConfig {
  if (!input || typeof input !== "object") throw new Error("Pack configuration must be a JSON object.");
  const value = input as Partial<PortablePackConfig>;
  if (value.schemaVersion !== PACK_CONFIG_SCHEMA_VERSION || value.kind !== "vouch-portable-pack" || !value.pack) throw new Error("Unsupported portable pack configuration.");
  if (JSON.stringify(value).match(/(?:eval|function|javascript:|<script)/i)) throw new Error("Executable content is not permitted in portable packs.");
  const candidate = { ...value.pack, samples: { previous: [], current: [{}] } } as VerticalPack;
  const errors = validatePack(candidate).filter((error) => error !== "A current sample is required.");
  if (errors.length) throw new Error(`Invalid portable pack: ${errors.join(" ")}`);
  return structuredClone(value as PortablePackConfig);
}
