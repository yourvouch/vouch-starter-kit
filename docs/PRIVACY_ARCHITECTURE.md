# Privacy architecture

## Data lifecycle

| Stage | Location | Lifetime |
|---|---|---|
| Uploaded CSV/XLSX binary | Browser memory | Discarded after parsing |
| Parsed rows during setup | React/browser memory | Current workflow/session |
| Saved review | IndexedDB | Until workspace/all-data deletion |
| Mapping/preferences/actions | IndexedDB | Until deletion |
| Backup/review export | User-selected local file | User controlled |
| Sanitized result card | User-selected local SVG | Aggregate-only |

The core workflow has no Vouch backend. Browser persistence is origin/profile specific and survives refresh.

## Exports

Backups and review JSON may contain normalized business records and must be handled as sensitive. Portable pack configuration excludes samples. Sanitized cards include only pack/date and aggregate counts.

## Telemetry

`telemetry` is disabled by default. The interface rejects row/field/contact/value-like property names. Fork maintainers must obtain consent, disclose destination/retention and avoid fingerprinting before enabling a provider.

## Deletion

Workspace settings cascade-delete one workspace, its reviews and actions. Local Data clears every Vouch object after confirmation. Schema upgrades preserve data and recommend backup before destructive changes.

## Threat boundaries

XLSX parsing validates ZIP signatures/bounds, encryption, relationship paths, expanded sizes, sheet/row limits and traversal. Imported JSON is schema checked. Portable packs reject executable content.
