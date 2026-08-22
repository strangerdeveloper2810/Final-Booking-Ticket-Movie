# 03. SSG Pre-rendering, SEO & Multilingual (i18n)

## Where this actually sits: CSR, not SSR, not real SSG

Say this plainly before anything else, because the filename says "SSG" and that's easy to over-read: **this is a Client-Side Rendered (CSR) React app.** There is no server that renders per-request (that would be SSR), and there is no per-route static generation with hydration (that would be real SSG, à la Next.js/Gatsby/Astro). What exists instead is one homemade Node script, `scripts/prerender.js`, that runs once after `webpack build` finishes and mutates `build/index.html` in place — a "SEO snapshot" for exactly one route (the homepage), in exactly one language (Vietnamese).

This matters pedagogically as much as technically: this section is a good worked example of *why* SSR/SSG frameworks treat hydration and per-route generation as first-class primitives, by showing concretely what you get when you approximate 10% of that by hand.

### The three real rendering strategies, for context

| Strategy | When HTML is generated | What this app does |
|---|---|---|
| **CSR** (Client-Side Rendering) | In the browser, after JS downloads and runs | ✅ This is what every route in this app actually does — `ReactDOM.createRoot(...).render(...)` in `src/index.tsx`, full stop. |
| **SSR** (Server-Side Rendering) | Per HTTP request, on a server, using the current request's data | ❌ Not present. `vercel.json` is a pure static-file host with an SPA rewrite rule — there is no server function rendering anything per-request. |
| **SSG** (Static Site Generation) | Once, at build time, typically per-route, with the client then *hydrating* (reconciling) against that pre-rendered markup | ⚠️ Partially and narrowly approximated — see below. Real SSG frameworks also hydrate; this app doesn't. |

## What `scripts/prerender.js` actually does

Runs as the second half of `pnpm build`:
```json
"build": "webpack --mode production && node scripts/prerender.js",
```
Sequential, not integrated as a webpack plugin — webpack finishes completely and writes `build/index.html`, then a separate `node` process opens that file and mutates it.

Step by step, the current (already-fixed) version:

1. **Fetches two live APIs in parallel** with a raw `https.get` wrapper — no axios, no fetch:
   ```javascript
   const [cybersoftMovies, tmdbMovies] = await Promise.all([
     fetchData("https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP01", { TokenCybersoft: CYBERSOFT_TOKEN }),
     fetchData("https://api.themoviedb.org/3/trending/movie/day?language=vi-VN", { Authorization: `Bearer ${TMDB_TOKEN}` }),
   ]);
   ```
2. **Defensively normalizes whatever shape comes back**, since Cybersoft and TMDB wrap their payloads differently (`{content: [...]}` vs `{results: [...]}`):
   ```javascript
   const raw = parsed.content ?? parsed.results ?? parsed ?? [];
   resolve(Array.isArray(raw) ? raw : []);
   ```
   `fetchData` never rejects — network errors and JSON-parse failures both resolve to `[]`, so a flaky third-party API can never crash the build.
3. **Builds two HTML fragments** (up to 8 movies each) as plain template-literal strings with inline styles, one section for Cybersoft ("Phim Đang Chiếu tại Rạp") and one for TMDB ("🔥 Phim Thịnh Hành TMDB").
4. **Injects the result using a balanced-tag scan, not a naive regex.** This is the fixed version of a real bug that shipped earlier — an older iteration used `/<div id="root">[\s\S]*?<\/div>/` (a *lazy* regex), which matches the *shortest* possible closing `</div>`, so as soon as the injected markup contained even one nested `<div>` of its own, re-running the build would only replace part of the previous content and leave stale markup trailing after it — a real, reproducible corruption that made it into a committed `public/index.html` at one point. The current implementation instead walks the string counting open/close `<div>` tags to find the *true* matching closer, and wraps its own injected block in `<!-- SSG_START -->`/`<!-- SSG_END -->` markers so a second run can find and cleanly replace exactly what it inserted last time (an idempotent re-injection path) rather than re-scanning for the root div at all:
   ```javascript
   function injectSSG(html) {
     if (html.includes("<!-- SSG_START -->")) {
       return html.replace(/<!-- SSG_START -->[\s\S]*?<!-- SSG_END -->/, prerenderedBlock);
     }
     const startTag = '<div id="root">';
     const startIdx = html.indexOf(startTag);
     if (startIdx === -1) return html;
     let depth = 0, i = startIdx;
     while (i < html.length) {
       if (html.startsWith("<div", i)) { depth++; i += 4; continue; }
       if (html.startsWith("</div>", i)) {
         depth--;
         if (depth === 0) {
           const endIdx = i + "</div>".length;
           return html.slice(0, startIdx) + prerenderedBlock + html.slice(endIdx);
         }
         i += 6; continue;
       }
       i++;
     }
     return html;
   }
   ```
5. **Only writes to `build/index.html`.** An earlier version also mutated the checked-in `public/index.html` template, which is exactly how that template got corrupted with repeated markup on successive builds — the fix explicitly documents this in a code comment: *"public/index.html is the Webpack TEMPLATE and must stay clean with an empty #root. Modifying the template causes SSG content to accumulate outside #root on repeat builds."*

## No hydration — this is a snapshot, not real SSG

`src/index.tsx` renders with:
```tsx
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<ErrorBoundary><Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider></ErrorBoundary>);
```
This is `createRoot(...).render(...)`, **not** `hydrateRoot(...)`. There is no hydration anywhere in this codebase. Practically: when a real browser loads the page, React does not try to reconcile against the pre-rendered DOM at all — it throws the whole pre-rendered subtree away and does a cold client-side render into the same `#root` node. There's no hydration-mismatch warning because React never attempts to diff against the snapshot in the first place. The pre-rendered HTML's entire value is: (a) something for a non-JS crawler to read, and (b) a flash of visible content before the JS bundle finishes loading for a human visitor — it contributes nothing to React's actual runtime rendering.

## What a crawler actually sees on other routes

Because `vercel.json`'s rewrite (`"/(.*)" → "/index.html"`) sends *every* path to the same static file, a crawler hitting `/detail/123` or `/booking/456` gets the exact same **home-page** snapshot (wrong movie list, wrong title/description in the static `<head>`, which was also written once for `/`). It is not "an empty shell" for those routes — it's actively the *wrong* content, which is a subtler and arguably worse SEO problem than a blank page would be. Only after JS executes does the SPA route to the real page and fetch the real data, which a non-JS crawler never sees. And since the snapshot is generated once per `pnpm build`, it can drift arbitrarily stale between deploys — there's no revalidation window (no ISR-style regeneration), just whatever was true the last time someone ran a build.

## SEO metadata: `SEO.tsx` + `react-helmet-async`

`HelmetProvider` wraps the app once, near the top of `src/App.tsx` (not in `index.tsx`), so every `<SEO>` instance rendered anywhere under the route tree can push into the shared Helmet context:
```tsx
<HelmetProvider>
  <CustomThemeProvider>
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  </CustomThemeProvider>
</HelmetProvider>
```
`src/shared/components/SEO/SEO.tsx` is opt-in per page — it emits `<title>`, description/keywords meta tags, full Open Graph (`og:type`/`og:url`/`og:title`/`og:description`/`og:image`/`og:locale`), a Twitter Card block, canonical + hreflang links, and (optionally) a JSON-LD `<script>` if a `jsonLd` prop is passed. Only `Home.tsx` and `Detail.tsx` currently render `<SEO>` — other routes fall back to whatever's baked into the static `<head>` of `public/index.html`.

Two different kinds of structured data exist, and they're not produced the same way:
- **`MovieTheater` JSON-LD is 100% static** — hand-written directly into `public/index.html`'s `<head>`, never touched by React/Helmet/the prerender script. It's present on every route because it's part of the one shared HTML shell.
- **`Movie`/`ItemList` JSON-LD is dynamic**, built inside `Home.tsx` and `Detail.tsx` from live API data and passed to `<SEO jsonLd={...}>`. On `Detail.tsx`, this JSON-LD is `undefined` until the film detail finishes fetching client-side — meaning it never exists at first paint and never exists at all in any static snapshot, since the prerender script doesn't touch `/detail/:id`. One fabricated value worth knowing about: the `Movie` schema's `aggregateRating.ratingCount` is a hardcoded literal `"100"`, not derived from any real API field — a placeholder that risks a real penalty if Google validates structured-data rating counts against reality.

## hreflang / canonical: looks right, isn't quite

```tsx
<link rel="canonical" href={cleanUrl} />
<link rel="alternate" hrefLang="vi" href={`${cleanUrl}?lng=vi`} />
<link rel="alternate" hrefLang="en" href={`${cleanUrl}?lng=en`} />
<link rel="alternate" hrefLang="x-default" href={cleanUrl} />
```
Two real, worth-knowing problems:
1. **Canonical doesn't vary by language** — `cleanUrl` (the current URL with any query string stripped) is the same for both the `vi` and `en` hreflang alternates. Google's guidance expects each language variant to canonicalize to *itself*; here both variants point at one canonical, which is a textbook hreflang/canonical disagreement.
2. **Language differentiation is a `?lng=` query parameter, not a distinct path or subdomain** — and there is no server-side logic that serves different HTML per query string (Vercel's rewrite serves the identical static file regardless of query string). A crawler that doesn't execute JS gets byte-for-byte identical HTML whether it requests `?lng=vi` or `?lng=en`; the actual language switch only happens client-side after `i18next-browser-languagedetector` reads the query param. The hreflang tags promise two distinct crawlable documents that don't actually exist as separate resources — query-parameter-based localization is explicitly discouraged by Google's own internationalization guidance for exactly this reason.

This is a good, honest example for training purposes: the *shape* of proper multilingual SEO is all there (hreflang, canonical, og:locale, per-page Helmet), but the underlying delivery mechanism (client-only language switching, no per-language static output) undermines the actual benefit in front of a real crawler.

## i18n: `i18next` + `react-i18next` + `i18next-browser-languagedetector`

`src/shared/i18n/index.ts` statically imports all locale JSON at build time (no lazy/backend loading — every translation ships in the JS bundle) and initializes:
```typescript
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });
```
Seven namespaces exist for each of two languages under `src/shared/locales/{en,vi}/`: `auth`, `booking`, `common`, `detail`, `footer`, `header`, `home` — all verified to have identical key sets and genuinely distinct (not copy-pasted) translated values, including interpolation placeholders (`{{movie}}`, `{{cinema}}`, `{{theater}}`) preserved in both languages.

No explicit `detection` options are passed to `LanguageDetector`, so it runs on its installed-package defaults: detection order `querystring → cookie → localStorage → sessionStorage → navigator → htmlTag`, with the result cached into `localStorage['i18nextLng']`. Because this isn't configured explicitly in this codebase, a minor version bump of `i18next-browser-languagedetector` could silently change this behavior — worth being aware of rather than assuming it's a deliberate, pinned choice.

## Routing recap (full detail in the codebase's own `src/app/routes.tsx`)

`react-router-dom` v7's object-based `useRoutes` API (not JSX `<Routes>`/`<Route>`), with all five page components still lazy-loaded via `React.lazy` under one shared `<Suspense>` boundary — the SSG discussion above is about server-delivered HTML only; client-side route-based code splitting is unaffected by any of it.
