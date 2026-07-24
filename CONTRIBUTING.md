# Contributing

Vouch welcomes focused improvements to local analysis, accessibility, documentation, integrations and vertical packs.

## Before starting

Search issues/PRs for duplicates. Open an issue for architectural or data-model changes. Never attach customer files, credentials or private business data; use synthetic fixtures generated in tests.

## Setup

```bash
npm install
npm run dev
```

Before a pull request:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

## Standards

- Keep decision functions deterministic, typed and small.
- Explain missing evidence rather than guessing.
- Do not introduce network transmission or telemetry without explicit consent and documentation.
- Preserve immutable reviews, non-causal outcome wording and migration compatibility.
- Add behavioral tests, not only snapshots.
- Avoid heavy dependencies; XLSX parsing intentionally has no workbook dependency.

## Packs

Follow [Build a vertical pack](docs/BUILD_A_VERTICAL_PACK.md) and `packs/community/PACK_CHECKLIST.md`. Include synthetic samples, stable rule ids/versions, evidence requirements, unavailable-state copy and comparison tests. Community packs remain community-maintained unless adopted.

## Pull requests

Complete the template: summary, screenshots/browser evidence, tests, privacy impact, pack compatibility, docs and breaking changes. Maintainers may request a migration note for storage/export changes.

Security reports belong in [SECURITY.md](SECURITY.md), not public issues. Participation follows the [Code of Conduct](CODE_OF_CONDUCT.md).
