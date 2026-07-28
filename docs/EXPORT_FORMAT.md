# Export format

## Browser backup

Schema version 3 includes workspaces, immutable reviews and actions. Mappings/preferences are workspace fields. Future schemas are rejected; merge detects id conflicts; replace requires confirmation.

## Review export

Schema version 1 contains safe workspace metadata, pack identity/version, one stored review, linked actions, optional comparison/deltas and explicit privacy metadata. It excludes the original binary and transient parsed rows, but normalized opportunities remain sensitive.

## Portable pack configuration

Schema version 1 contains metadata, fields, stages and declarative rule descriptions. Samples are excluded. `capabilities.executableRules` is false: imported JSON never executes code.

## Sanitized result card

The SVG contains only aggregate priority/opportunity counts, category counts, pack, review date, local-processing statement and repository attribution.

## Compatibility

Export validators reject unsupported/future schema versions, incomplete collections, pack mismatches and executable pack content. IndexedDB migrations are separate from portable export schemas.
