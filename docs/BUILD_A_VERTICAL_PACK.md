# Build a vertical pack

This is the supported fifth-pack journey. A competent TypeScript developer should be able to copy, edit and preview a pack in under 15 minutes.

## 1. Copy the example

Start from the `recruitment` definition in `lib/v2/packs.ts`. Give the pack a lowercase slug, human name, semantic version, schema version, category and maintainer.

## 2. Define fields

Each field has a stable canonical `key`, label, importance, mapping aliases and a plain-language description. Required fields block a review when unmapped; recommended fields reduce readiness; optional fields add evidence when present.

Aliases should describe real export headers. Avoid ambiguous fragments that could claim the same source column.

## 3. Define stages

Stages have a display name, deterministic order and lifecycle (`open`, `won`, `lost` or `unknown`). Comparison uses order for progression/regression and lifecycle for won/lost/reopened.

## 4. Normalization

Shared text, date, money, email and phone normalizers live in `lib/v2/normalize.ts`. `buildReviewSnapshot` retains mapped vertical fields under `opportunity.vertical`. Add a new normalizer only when deterministic, documented and tested.

## 5. Define rules and evidence

Rules require a stable lowercase id, positive version, label, description and bounded weight. Declare `evidenceFields` and a user-facing `missingEvidence` sentence. Implement deterministic evaluation in `lib/v2/intelligence.ts`; never fabricate unavailable evidence.

Version a rule when its meaning or scoring behavior changes. Do not reuse an id for a different concept.

## 6. Add sample data

Provide small `previous` and `current` arrays that exercise progression, risk, missing evidence and outcomes. Samples are public fixtures: never include customer data.

## 7. Register and preview

Add the pack to `verticalPacks`. Built-in product packs use `category: "built-in"`; instructional packs use `"example"`; future contributions under `packs/community/` use `"community"`.

Add a stable example slug in `lib/v2/examples.ts`, then open `/examples/<slug>`.

## 8. Test

Use `validatePack(pack)` and test rule ids, evidence, missing-evidence behavior, mappings, snapshots, stable example output and comparison compatibility.

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## 9. Contribute

Open the new-vertical-pack issue template, complete `packs/community/PACK_CHECKLIST.md`, document the maintainer and submit a PR. Community packs are not officially supported unless maintainers explicitly adopt them.
