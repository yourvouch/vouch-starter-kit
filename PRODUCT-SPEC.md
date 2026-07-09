# Product Specification — Vouch Starter Kit v0.1

**Version:** 0.1 Community Edition
**Status:** Pre-development
**Last Updated:** 2026-07-09

---

## Product Vision

Vouch helps people and businesses make better decisions from the data they already have.

Most business data sits unused in spreadsheets and CSV exports. It contains real signals — stalled deals, lapsed customers, missing follow-ups, revenue at risk — but extracting those signals requires time, skill, or expensive tools that most small teams don't have.

Version 0.1 solves one problem well: **upload a CSV, get useful business insights within one minute, with no setup required**.

---

## Target Users

| User | Context |
|------|---------|
| **Founders** | Reviewing pipeline health, understanding revenue gaps, spotting churn risk |
| **Small businesses** | Making sense of customer or sales exports from any tool |
| **Agencies** | Auditing client data quickly before or during engagements |
| **Consultants** | Running fast diagnostic analyses to identify where to focus |
| **Sales teams** | Finding leads that need follow-up and deals going cold |

**Common thread:** These users have data but no analyst. They need answers in minutes, not dashboards that take days to configure.

---

## Success Metric

> A first-time user uploads a CSV and says: **"I immediately found something useful."**

Secondary signals:
- Time from upload to first insight: under 60 seconds
- User scrolls through the full dashboard without confusion
- User downloads the export report

---

## User Journey

```
Landing Page
    │
    │  Clear value proposition, sample CSV available
    ▼
Upload CSV
    │
    │  Drag & drop or file browse
    │  Instant client-side parsing via PapaParse
    ▼
Column Detection
    │
    │  Auto-map headers to known field types
    │  User can confirm or adjust mappings
    ▼
Dashboard
    │
    │  Key metrics: records, revenue, deal size, pipeline, stage distribution
    ▼
Insights
    │
    │  Plain-language findings ranked by business impact
    ▼
Recommended Next Actions
    │
    │  Concrete steps the user can take immediately
    ▼
Export Summary
    │
    │  Download a report of findings and actions
    ▼
Done
```

---

## MVP Features

### 1. Landing Page

- Headline: clear value proposition
- Single primary CTA: Upload your CSV
- Sample CSV download
- No account required

### 2. CSV Upload

- Drag and drop or click to browse
- Client-side parsing via PapaParse (no data sent to a server)
- Error handling for invalid or empty files
- Target: up to 10,000 rows

### 3. Column Detection

Auto-detects: Name, Email, Phone, Revenue, Stage, Lead Source, Owner, Date — with a user-editable mapping confirmation step before proceeding.

### 4. Dashboard

Stat tiles for Total Records, Total Revenue, Average Deal Size, Pipeline Value — plus a Recharts stage distribution chart.

### 5. Insights

Cards for: leads needing follow-up, revenue at risk, conversion bottlenecks, high-value inactive customers, missing data, slow-moving deals — sorted by business impact.

### 6. Recommended Next Actions

Numbered, specific actions generated from actual findings — not generic advice.

### 7. Export Summary

One-click CSV download (`vouch-summary-YYYY-MM-DD.csv`) generated entirely in the browser.

---

## Out of Scope for v0.1

Login, authentication, database, payments, CRM integrations, cloud hosting, AI chat, saved sessions, multi-file upload.

---

## Technology

Next.js · TypeScript · Tailwind CSS · Recharts · PapaParse

All data processing is client-side. No CSV content is ever transmitted to a server.
