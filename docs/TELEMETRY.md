# Telemetry

Telemetry is disabled by default. `lib/v2/telemetry.ts` exports a no-op adapter and a development collector.

Allowed event names cover aggregate funnel actions such as sample opened, mapping completed, review saved, action created and export used. Properties resembling filenames, rows, fields, contacts or business values are removed.

A fork enabling telemetry must:

1. Obtain meaningful user consent.
2. Document provider, destination, retention and deletion.
3. Send no source values, contacts, filenames, row-level data or fingerprints.
4. Keep core analysis usable when telemetry is blocked.
5. Test the disabled default and sanitization.
