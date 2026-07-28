# Embedding

## Headless engine

Import `analyseDataset` from `lib/v2/analyse.ts` in a TypeScript application. Supply a validated pack, string-valued rows, confirmed mapping and review date. The result is JSON serializable and has no React, IndexedDB or browser parsing dependency.

Parsing is intentionally separate. A server or CLI must enforce its own file limits and should reuse the local CSV/XLSX safety boundaries where appropriate.

## React experience

This repository does not publish a component package. A fork can reuse `components/v2/` and App Router routes directly. Keep decision logic in `lib/v2/` so branded UI changes do not fork scoring behavior unnecessarily.

## Reuse results

Use `createReviewExport` for a documented portable result, or consume the `AnalysisResult` type directly. Do not expose normalized record data to client logs, telemetry or public sharing.

## Branded fork

Change metadata, theme and product copy; retain the privacy notices, deletion controls, evidence disclosure and non-causal outcome language. Document the fork’s own data flows.

## Data leakage checklist

- Never send rows, filenames, contacts or business values through telemetry.
- Use `createSanitizedResultCard` for public result sharing.
- Treat review/backup JSON as sensitive.
- Keep uploaded binaries in memory only.
- Validate imported JSON before persistence.
