# Data model

## Pack

`VerticalPack` describes metadata, fields, stages, versioned rules and public samples. `definePack` validates registration.

## Opportunity

An `Opportunity` is a normalized record with identity, display name, lifecycle, common fields, vertical fields and source-row number. Source-row numbers support local diagnostics and are excluded from sanitized sharing.

## Review snapshot

`ReviewSnapshot` is immutable: id, workspace, pack, review date, readiness, normalized opportunities and stored assessments. Historical snapshots are compared as stored and never rescored.

## Assessment

An assessment stores score, band, confidence, triggered rules, unavailable checks, recommended next step and optional conservative value-at-risk evidence.

## Comparison

A match retains previous/current entities, matching confidence, unresolved state and movement classifications. Duplicate identities are unresolved and excluded from movement aggregates.

## Action and outcome

Actions retain source, links, lifecycle timestamps, due date, rationale, expected outcome, success measure and notes. Later reviews measure each linked opportunity separately and preserve previous/current evidence with confidence.

## Workspace and backup

Workspaces contain pack identity, mapping and preferences. Backups contain workspaces, reviews and actions but never uploaded binaries, credentials or tokens.
