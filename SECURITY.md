# Security policy

The latest preview release and current development branch receive security fixes.

## Private reporting

Do not open a public issue for a vulnerability. Email `shivacharan.s@gmail.com` with impact, reproduction, affected version and a synthetic proof of concept. Do not send real customer files or credentials.

## In scope

- local file parsing and ZIP/XML boundary bypasses
- unsafe import/export handling
- source-data leakage through UI, exports or telemetry
- XSS or executable portable-pack injection
- migration behavior that destroys local workspaces
- insecure self-hosting defaults in committed configuration

Third-party dependency issues should also be reported upstream, but a Vouch-specific exploit path is in scope.

## Design defenses

The XLSX reader validates signatures, bounds, encryption, relationships, traversal and expanded sizes. Portable packs reject executable content. Telemetry is disabled. Uploaded binaries are not persisted. Sanitized cards exclude record-level data.
