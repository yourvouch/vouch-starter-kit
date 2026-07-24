# Vouch Starter Kit 2.0 Preview

> A local-first, open-source decision intelligence engine and reference app that turns CSV/XLSX business data into explainable priorities, actions, comparisons and outcomes.

[![Vouch Starter Kit 2.0 Preview](public/badges/built-with-vouch.svg)](https://vouchstarterkit.netlify.app/)
[![CI](https://github.com/yourvouch/vouch-starter-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/yourvouch/vouch-starter-kit/actions/workflows/ci.yml)
[![MIT licensed](https://img.shields.io/badge/license-MIT-075b3a.svg)](LICENSE)

[Explore the live Starter Kit](https://vouchstarterkit.netlify.app/) · [Star the repository](https://github.com/yourvouch/vouch-starter-kit/stargazers) · [Build your first pack](docs/BUILD_A_VERTICAL_PACK.md)

![Founder Decision Review](docs/images/v2/founder-decision-review.png)

Source files are parsed locally and discarded after parsing. No signup or backend is required for the core workflow. Deterministic rules remain inspectable, saved reviews are immutable and optional aggregate telemetry is disabled by default.

## Explore examples

- [Interior design & architecture](https://vouchstarterkit.netlify.app/examples/interiors)
- [Agency & consulting](https://vouchstarterkit.netlify.app/examples/agency)
- [SaaS](https://vouchstarterkit.netlify.app/examples/saas)
- [General sales](https://vouchstarterkit.netlify.app/examples/general-sales)
- [Recruitment Agency developer example](https://vouchstarterkit.netlify.app/examples/recruitment)

Each stable route opens a completed, prebuilt workspace with two review periods, comparison, actions and outcomes. It renders without upload or IndexedDB onboarding.

## What it is

- A browser-local CSV/XLSX analysis engine
- A typed, validated vertical-pack system
- A headless TypeScript analysis API
- A reference Founder Decision Review workflow
- A foundation for consultants, agencies, operators and vertical SaaS builders

## What it is not

- Not a hosted CRM or cloud synchronization service
- Not a black-box AI predictor
- Not a system that uploads source files by default
- Not the complete commercial Vouch product

## What developers can build

Fork it to create a branded decision review, a consultant assessment, an embedded analysis workflow, a local operations tool or a new vertical decision product. Built-in packs cover general sales, interiors, agency/consulting and SaaS. Recruitment Agency demonstrates the fifth-pack contribution path.

## Reference product loop

```text
Choose pack → parse CSV/XLSX locally → confirm mapping → generate review
→ save immutable baseline → create actions → add later review
→ compare movements → observe associated outcomes
```

## Quick start

Requires Node.js 20+.

```bash
git clone https://github.com/yourvouch/vouch-starter-kit.git
cd vouch-starter-kit
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables are required.

## Build your first pack

Packs use a validated declarative contract:

```ts
export const recruitmentPack = definePack({
  id: "recruitment",
  name: "Recruitment Agency",
  version: "1.0.0",
  schemaVersion: 1,
  category: "example",
  maintainer: "Your name",
  fields: [],
  stages: [],
  rules: [],
  samples: { previous: [], current: [] },
});
```

Follow [Build a vertical pack](docs/BUILD_A_VERTICAL_PACK.md) for metadata, aliases, stages, normalizers, evidence, missing-evidence handling, samples, registration and tests.

## Headless API

```ts
import { analyseDataset } from "./lib/v2/analyse";
import { suggestMappings } from "./lib/v2/mapping";
import { verticalPacks } from "./lib/v2/packs";

const pack = verticalPacks.recruitment;
const result = analyseDataset({
  pack,
  rows,
  mapping: suggestMappings(Object.keys(rows[0]), rows, pack),
  reviewDate: "2026-07-24",
});
```

`result` is JSON serializable and contains the immutable review, metrics, conservative risk summary, priorities, optional comparison and action summary. Parsing, persistence and React are outside the core API. See [Embedding](docs/EMBEDDING.md).

## Export formats

- Versioned full-browser backup with workspaces, mappings, preferences, reviews and actions
- Versioned review JSON with pack identity, evidence, unavailable checks, actions and optional comparison
- Portable non-executable pack configuration without samples
- Sanitized local SVG result card without names, contacts, filenames, company names or record-level values
- Action Centre CSV and print review

Schemas and trust boundaries are documented in [Export format](docs/EXPORT_FORMAT.md).

## Included packs

| Pack | Category | Purpose |
|---|---|---|
| General sales | Built-in | Flexible opportunity pipelines |
| Interior design & architecture | Built-in | Enquiry through handover |
| Agency & consulting | Built-in | Proposals, projects and retainers |
| SaaS | Built-in | Trials, subscriptions and renewals |
| Recruitment Agency | Example | Roles, candidates, interviews and offers |

Future community packs live under `packs/community/` and are community-maintained unless explicitly adopted.

## Architecture

Core logic is under `lib/v2/`: pack validation, mapping, normalization, analysis, comparison, actions/outcomes, portable exports, sharing, telemetry and versioned IndexedDB storage. UI routes and components consume those modules but do not own the decision logic.

Read [Architecture](ARCHITECTURE.md), [Data model](docs/DATA_MODEL.md) and [Rules engine](docs/RULES_ENGINE.md).

## Privacy

- CSV/XLSX binaries are held in memory for parsing and never stored.
- Parsed snapshots, mappings, preferences and actions are stored only after the user saves a workspace.
- Local data survives refresh in the current browser profile and origin.
- JSON exports contain parsed review data; review sharing is a separate sanitized aggregate.
- Telemetry is a no-op unless a fork explicitly enables an adapter.
- Users can delete one workspace or clear all local data.

Read [Privacy architecture](docs/PRIVACY_ARCHITECTURE.md) before embedding or adding telemetry.

## Open source and commercial Vouch

Open source includes local ingestion, normalization, packs, deterministic rules, workspaces, comparisons, actions, outcomes and local exports.

[Commercial Vouch](https://yourvouch.com) adds managed deployment, cloud sync, scheduled ingestion, connectors, collaboration, permissions, notifications, workflow automation, audit logs, managed custom packs, rule tuning, assisted implementation, operating cadence and support. [The full demo](https://demo.yourvouch.com) shows the richer operational experience.

**Starter Kit proves the intelligence locally. Commercial Vouch operationalizes it continuously.**

## Testing

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

Coverage includes XLSX safety, pack schemas, mapping, scoring, IndexedDB migrations/CRUD, immutable snapshots, comparison, actions, outcomes, backups, exports, example determinism, headless analysis, sanitization and telemetry defaults.

## Deployment

See [Deployment](docs/DEPLOYMENT.md) for tested Netlify and Vercel settings and self-hosting constraints. Browser-local persistence is origin-specific; moving domains requires an explicit JSON backup/import.

## Contributing

Read [Contributing](CONTRIBUTING.md), the [Code of Conduct](CODE_OF_CONDUCT.md), [Security](SECURITY.md), [Good first issues](.github/GOOD_FIRST_ISSUES.md) and the [Roadmap](ROADMAP.md). Bugs, mapping requests, integrations and vertical packs have dedicated issue templates.

## License

MIT © Vouch.
