# Architecture

Vouch Starter Kit separates local parsing, deterministic decision logic, persistence and presentation.

```text
CSV/XLSX parser → mapping → normalization → review snapshot
                                      ├→ priorities/risk
                                      ├→ comparison
                                      ├→ actions/outcomes
                                      └→ exports/sharing
```

## Boundaries

- `lib/v2/xlsx.ts` parses bounded ZIP/XML without an Excel dependency.
- `mapping.ts` detects and edits canonical field mappings.
- `normalize.ts` creates typed opportunities and identity keys.
- `packs.ts` owns validated declarative packs and registration.
- `analyse.ts` exposes the React-independent orchestration API.
- `intelligence.ts` evaluates versioned deterministic rules.
- `comparison.ts` compares immutable snapshots without rescoring history.
- `actions.ts` owns lifecycle, duplicate prevention and non-causal outcome measurement.
- `portable.ts` creates validated review and pack exports.
- `sharing.ts` creates aggregate-only result cards.
- `storage.ts` owns schema-versioned IndexedDB and backup import/export.
- `components/v2/` and `app/` are presentation and browser workflow layers.

## Invariants

Source binaries are not persisted. Historical snapshots are not mutated or rescored. Unavailable evidence is reported rather than inferred. Matching confidence is retained. Outcome wording never claims causation.

## Pack registry

`verticalPacks` contains built-in and example packs. `definePack` validates identifiers, schema/version metadata, duplicate fields/stages/rules, lifecycle coverage, sample presence and rule weights. Portable pack JSON cannot contain executable logic.

## Persistence

IndexedDB schema 3 contains `workspaces`, `reviews` and `actions`, with workspace indexes and migration logic. Upgrades preserve records and add a backup recommendation; destructive replacement requires explicit confirmation in the UI.

## Example routes

`lib/v2/examples.ts` produces deterministic in-memory workspaces. `/examples/[pack]` statically enumerates stable slugs and requires neither parsing nor persistence.
