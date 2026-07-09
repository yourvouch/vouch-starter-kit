# Changelog

All notable changes to this project will be documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/). Nothing has been tagged as a release yet, so everything below is grouped under `[Unreleased]`.

---

## [Unreleased]

### Added

**Project foundation**
- Next.js 16 (App Router, Turbopack), TypeScript (strict), Tailwind CSS v4, ESLint, and Vitest scaffolding
- `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `ROADMAP.md`, `SECURITY.md`, `CHANGELOG.md`, and `PRODUCT-SPEC.md`

**Landing page**
- Hero, Why Vouch, How It Works, Open Source, and footer sections describing the product and linking into the upload flow

**CSV upload**
- Drag-and-drop and click-to-browse upload, parsed entirely client-side with PapaParse (no data ever sent to a server)
- Automatic detection of 8 common fields (Name, Email, Phone, Revenue, Stage, Owner, Lead Source, Date) with an editable column-mapping confirmation screen

**Dashboard and insights engine**
- `lib/insights/` — pure, individually testable functions for every dashboard metric (totals, missing/duplicate contact counts, pipeline and revenue by stage, top lead sources, top owners)
- Dashboard UI — stat cards, Pipeline by Stage and Revenue by Stage charts (Recharts), Top Lead Sources and Top Owners tables
- Every metric and chart falls back to a clear, specific message (e.g. "Email column was not mapped") instead of failing when a column isn't mapped

**Executive Summary**
- A deterministic, plain-English summary sentence, "What's Going Well" / "Needs Attention" observations, a single prioritized "Today's Priority" action, and additional recommendations — generated from dashboard metrics with no AI calls
- A Business Health strip with five status cards (Pipeline Value, Contact Quality, Data Completeness, Owner Coverage, Revenue Visibility)

**Localization**
- India-first currency formatting throughout the dashboard — ₹ symbol, Indian digit grouping (e.g. `₹15,31,50,000`), and compact lakh/crore notation on chart axes

**Export and demo readiness**
- A sticky dashboard action bar to download the summary as a `.txt` file, copy it to the clipboard, or print a clean report
- Print-friendly styles that hide navigation and action buttons and avoid awkward page breaks
- A bundled sample dataset and a "Try with sample data" action, plus a "Download sample CSV" link, so the dashboard can be explored without a real file
- An onboarding mini-guide on the upload page, per-field descriptions on the mapping screen, real row-count progress while parsing, and contextual tooltips throughout the dashboard

---

<!-- Releases will be added below as they ship -->

[Unreleased]: https://github.com/yourvouch/vouch-starter-kit/compare/HEAD...HEAD
