import { describe, expect, it } from "vitest";
import { analyseDataset } from "./analyse";
import { buildExampleWorkspace, EXAMPLE_SLUGS, packIdForExampleSlug } from "./examples";
import { suggestMappings } from "./mapping";
import { definePack, validatePack, verticalPacks } from "./packs";
import { createReviewExport, exportPackConfig, validatePackConfig, validateReviewExport } from "./portable";
import { assertSanitizedCard, createSanitizedResultCard, resultCardSvg } from "./sharing";
import { createDevelopmentTelemetry, telemetry } from "./telemetry";
import { migrateWorkspaceRecord } from "./storage";

describe("declarative pack architecture", () => {
  it("validates every registered pack and stable rule identifier", () => {
    for (const pack of Object.values(verticalPacks)) {
      expect(validatePack(pack)).toEqual([]);
      expect(pack.rules.every((rule) => /^[a-z][a-z0-9-]+$/.test(rule.id) && rule.version >= 1)).toBe(true);
    }
  });

  it("returns helpful validation errors", () => {
    expect(() => definePack({ ...verticalPacks.general, id: "Bad ID" as never })).toThrow(/lowercase slug/);
    expect(validatePack({ ...verticalPacks.general, rules: [...verticalPacks.general.rules, verticalPacks.general.rules[0]] })).toContain("Duplicate rules: missing-owner.");
  });

  it("runs recruitment evidence rules deterministically", () => {
    const pack = verticalPacks.recruitment;
    const result = analyseDataset({ pack, rows: pack.samples.current, mapping: suggestMappings(Object.keys(pack.samples.current[0]), pack.samples.current, pack), reviewDate: "2026-07-17", reviewId: "recruitment-review", createdAt: "2026-07-17T00:00:00Z" });
    expect(result.review.assessments.flatMap((assessment) => assessment.rules.map((rule) => rule.id))).toEqual(expect.arrayContaining(["client-feedback-wait", "offer-overdue"]));
  });
});

describe("stable example workspaces", () => {
  it("maps required public slugs", () => {
    expect(Object.keys(EXAMPLE_SLUGS)).toEqual(["interiors", "agency", "saas", "general-sales", "recruitment"]);
    expect(packIdForExampleSlug("general-sales")).toBe("general");
  });

  it("builds deterministic completed workspaces without persistence", () => {
    const first = buildExampleWorkspace("interiors");
    const second = buildExampleWorkspace("interiors");
    expect(first.current).toEqual(second.current);
    expect(first.reviews).toHaveLength(2);
    expect(first.actions.some((action) => action.outcome !== "Not yet measured")).toBe(true);
    expect(first.comparison.matches.length).toBeGreaterThan(0);
  });
});

describe("headless analysis and portable exports", () => {
  const pack = verticalPacks.general;
  const mapping = suggestMappings(Object.keys(pack.samples.current[0]), pack.samples.current, pack);
  const result = analyseDataset({ pack, rows: pack.samples.current, mapping, reviewDate: "2026-07-17", reviewId: "review", createdAt: "2026-07-17T00:00:00Z" });
  const workspace = { id: "workspace", name: "Example", packId: "general" as const, packVersion: pack.version, createdAt: "2026-07-17T00:00:00Z", updatedAt: "2026-07-17T00:00:00Z", mapping: {}, preferences: {} };

  it("returns a serializable framework-independent result", () => {
    expect(result.schemaVersion).toBe(1);
    expect(() => JSON.stringify(result)).not.toThrow();
    expect(result.pack.version).toBe(pack.version);
  });

  it("exports and validates a review without an original file", () => {
    const exported = createReviewExport({ workspace, pack, review: result.review, exportedAt: "2026-07-17T00:00:00Z" });
    expect(validateReviewExport(exported)).toEqual(exported);
    expect(JSON.stringify(exported)).not.toContain("uploadedFile");
    expect(exported.privacy).toEqual({ sourceFileIncluded: false, uploadedRowsIncluded: false });
  });

  it("exports safe declarative pack configuration without samples", () => {
    const portable = exportPackConfig(pack);
    expect(portable.pack).not.toHaveProperty("samples");
    expect(validatePackConfig(portable)).toEqual(portable);
    expect(() => validatePackConfig({ ...portable, injected: "<script>alert(1)</script>" })).toThrow(/Executable/);
  });
});

describe("privacy-safe sharing and telemetry", () => {
  it("creates a sanitized SVG that excludes record-level fields", () => {
    const example = buildExampleWorkspace("interiors");
    const card = createSanitizedResultCard(example.current, example.pack);
    const svg = resultCardSvg(card);
    expect(assertSanitizedCard(svg)).toBe(true);
    expect(svg).not.toContain(example.current.opportunities[0].name);
    expect(svg).not.toContain(example.current.opportunities[0].company);
    expect(svg).toContain("Processed locally");
  });

  it("keeps telemetry disabled and strips prohibited properties", () => {
    expect(telemetry.enabled).toBe(false);
    const development = createDevelopmentTelemetry(true);
    development.track("sample_opened", { packId: "interiors", filename: "private.csv", value: 1000 });
    expect(development.events).toEqual([{ event: "sample_opened", properties: { packId: "interiors" } }]);
  });
});

describe("storage migration protection", () => {
  it("migrates legacy workspaces without deleting identity or settings", () => {
    const migrated = migrateWorkspaceRecord({ id: "legacy", name: "Legacy", packId: "general", createdAt: "2026-01-01", updatedAt: "2026-01-01" }, 1);
    expect(migrated.id).toBe("legacy");
    expect(migrated.mapping).toEqual({});
    expect(migrated.preferences?.migrationNotice).toContain("preserves existing reviews");
  });

  it("preserves existing mappings and preferences", () => {
    const migrated = migrateWorkspaceRecord({ id: "current", mapping: { name: "Deal" }, preferences: { compact: true } }, 2);
    expect(migrated.mapping).toEqual({ name: "Deal" });
    expect(migrated.preferences?.compact).toBe(true);
  });
});
