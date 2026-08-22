# 05. Vercel SPA Deployment & Environment Setup

## The core SPA-hosting problem

A Webpack-built SPA renders every route (`/login`, `/detail/:id`, `/booking/:id`) client-side via `react-router-dom`. On a static host like Vercel, that creates two classic problems if not configured for it:

1. **Deep-link / refresh 404s.** A visitor hitting `https://site.com/detail/1234` directly, or refreshing on that URL, causes Vercel's static file server to look for a physical `detail/1234/index.html` — which doesn't exist, since the app only ever builds one `index.html`. Without a rewrite rule, that's an HTTP 404 before React Router ever gets a chance to run.
2. **No content-hash-aware caching by default.** Without explicit cache headers, browsers may re-fetch unchanged JS/CSS chunks on every visit.

## The fix: `vercel.json`

```json
{
  "version": 2,
  "outputDirectory": "build",
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```
- `rewrites` sends **every** path to `/index.html` (not a redirect — the URL bar keeps the original path), letting `react-router-dom` take over client-side once the SPA loads. This is also exactly why the SSG snapshot discussed in [doc 03](./03-ssg-prerendering-multilingual-seo.md) shows up identically on every route for a non-JS crawler — there's no server-side logic here to serve different content per path.
- `/static/*` gets a one-year `immutable` cache header, which is safe specifically because webpack's production output uses content-hashed filenames (`main.[contenthash:8].js`) — a new deploy produces new filenames for anything that changed, so there's no risk of serving stale content under an old, still-cached name.
- `installCommand: "pnpm install --no-frozen-lockfile"` — deliberately **not** frozen. A frozen-lockfile install (the default, and generally the safer choice for reproducible CI builds) fails if `package.json` and `pnpm-lock.yaml` have drifted out of sync even slightly. This project has needed the looser flag before (see the earlier "webpack-merge missing from package.json" bug in [doc 02](./02-webpack5-build-optimization.md) — a frozen-lockfile install would have caught that mismatch immediately and failed loudly, which arguably would have surfaced the bug sooner rather than later; the trade-off here is deploy resilience against minor drift versus an early, loud failure signal). `framework: null` tells Vercel not to try auto-detecting a framework preset (e.g. assuming this is CRA and overriding the build command) — Vercel should just run exactly what's specified.

## Environment variables checklist

Every variable referenced by the app's `DefinePlugin` config ([doc 02](./02-webpack5-build-optimization.md#environment-variables-no-automatic-react_app-scanning)) must be set in **Vercel Dashboard → Project Settings → Environment Variables**, or the build silently falls back to the hardcoded defaults baked into `config/webpack.common.js`:

| Key | Purpose |
|---|---|
| `REACT_APP_DOMAIN` | Cybersoft API base URL |
| `REACT_APP_TOKEN_CYBERSOFT` | Cybersoft auth token (required by most Cybersoft endpoints) |
| `REACT_APP_GROUP_ID` | Cybersoft data group/class code |
| `REACT_APP_TMDB_DOMAIN` | TMDB API base URL |
| `REACT_APP_TMDB_API_KEY` | TMDB API key |
| `REACT_APP_TMDB_TOKEN` | TMDB read-access bearer token |

Never commit real values for these — `.env` is git-ignored; `.env.example` is the checked-in template with placeholder values.

## Alternate deployment target: Firebase Hosting (legacy)

`firebase.json` + `.firebaserc` are also present in the repo, configured to serve the same `build/` output with the same SPA-rewrite idea (`"rewrites": [{"source": "**", "destination": "/index.html"}]`). This suggests the app was deployed to Firebase Hosting at some point before or alongside Vercel. It isn't wired into any `package.json` script (there's no `deploy` script invoking the Firebase CLI) — treat it as a legacy/manual deployment path, not part of the primary CI/CD story, unless you have a specific reason to use it.

## What Vercel does *not* do here

Worth stating plainly, cross-referencing [doc 10](./10-typescript-safety-and-cicd-gaps.md): Vercel's build is exactly `pnpm run build`, i.e. `webpack --mode production && node scripts/prerender.js`. It does not run `pnpm typecheck`, does not run `pnpm test`, and there is no separate CI pipeline (no `.github/workflows`) gating merges before they reach `maintain`. A type error or a broken test will not stop a deploy — only a build-time failure (a syntax error, a missing module, ESLint-as-error behavior if that's ever reintroduced) will.
