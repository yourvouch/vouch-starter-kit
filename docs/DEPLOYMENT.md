# Deployment

## Requirements

- Node.js 20+
- `npm ci`
- `npm run build`
- No environment variables for core use

## Netlify

Build command: `npm run build`. Publish directory: `.next`. Install the official Next.js runtime adapter through Netlify’s framework detection. Connect the intended repository/branch and enable deploy previews; no deployment secret belongs in this repository.

## Vercel

Import the repository as Next.js, keep default build/output settings and Node 20+. No environment variables are required.

## Self-hosted

Run `npm run build && npm start` behind HTTPS. Static HTML-only export is not declared because the application uses dynamic workspace routes and the Next.js runtime; use a Node-compatible adapter.

## Verification

Open `/`, every `/examples/*` route and `/review` directly, then refresh. Test IndexedDB save/reload and JSON backup/import on the final production origin.

## Origin migration

IndexedDB does not move across domains. Export a backup on the old origin and import it on the new origin. Never silently migrate or delete local workspaces.
