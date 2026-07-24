# Changelog

This project follows Keep a Changelog and Semantic Versioning.

## [2.0.0-preview] - 2026-07-24

### Added

- Local-first engine/reference-app positioning and two-mode onboarding
- Stable completed example routes for four built-in packs plus Recruitment Agency
- Typed `definePack`, validation, schema/version metadata and community contribution path
- Headless `analyseDataset` API
- Progressive evidence and developer diagnostics
- Versioned review exports and safe portable pack configuration
- Sanitized local SVG result-card sharing
- Disabled-by-default privacy-respecting telemetry abstraction
- Versioned IndexedDB schema 3 with preservation migration
- Complete architecture, pack, embedding, data, rules, privacy, integration, export, deployment and telemetry docs
- GitHub issue/PR templates, CI, CodeQL, dependency review, Dependabot and good-first-issue proposals

### Preserved

- Dependency-free bounded XLSX parser
- Four existing vertical packs and editable mapping
- Immutable reviews, comparison, Action Centre, measured outcomes and backups
- Non-causal outcome wording and conservative value-at-risk logic

### Known limitations

- No accounts, cloud sync, scheduled ingestion, CRM write-back or team collaboration
- Local data is tied to a browser profile and origin
- Portable pack JSON describes supported declarative rules; it cannot carry executable custom code
- Review JSON may contain normalized business records and must be handled as sensitive

## [0.1.0] - 2026-05-01

- Initial CSV review, dashboard, deterministic insights and local sample workflow.

[2.0.0-preview]: https://github.com/yourvouch/vouch-starter-kit/releases/tag/v2.0.0-preview
