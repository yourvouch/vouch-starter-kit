# Example integrations

These are architecture examples, not bundled connectors.

## Google Sheets export

Download a Sheet as CSV, then use the local upload flow. A fork may fetch a published/user-authorized export and pass parsed rows to `analyseDataset`; do not publish confidential sheets.

## HubSpot CSV export

Export deals, retain stable deal ids, map deal name/stage/owner/activity/close date, and run locally. Vouch does not write back to HubSpot.

## Supabase, SQLite and Postgres

Query only required columns in a trusted server/CLI, convert values to strings and call the headless API. Store the returned versioned review JSON using your own access controls. Never send database credentials to the browser.

## Static self-hosting

Next.js routes can be hosted behind a normal Node/Netlify/Vercel adapter. Core local behavior needs no server secret. IndexedDB stays bound to the deployed origin.
