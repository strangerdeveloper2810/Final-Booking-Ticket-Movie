# 02. Webpack 5 Build System: Ejection, Pipeline, and Performance

## Why this isn't Create React App anymore

This project's git history is a complete, traceable record of an incremental ejection:

1. **Started as plain CRA** (`react-scripts`) — the earliest commits use the standard `start`/`build`/`test`/`eject` scripts.
2. **Moved to CRACO** (`@craco/craco`) to get partial webpack customization without a full eject — a common intermediate step for teams that need *some* control (a custom loader, an extra alias) but don't want to own the whole config yet.
3. **Hit real friction with CRA/craco's baked-in behavior.** A commit on this repo (`df0c8b1`) documents exactly this: *"CRA/craco treats ESLint warnings as build errors when CI=true, which Vercel sets by default, causing the deploy to fail."* That's not a hypothetical — it broke a real deploy.
4. **Hit a structural wall in craco itself.** The pre-eject `craco.config.js` (recoverable from git history) needed to swap CRA's internal `babel-loader` for `swc-loader`, and had to do it like this:
   ```javascript
   const oneOfRule = webpackConfig.module.rules.find((rule) =>
     Array.isArray(rule.oneOf)
   ).oneOf;
   for (let rule of oneOfRule) {
     if (rule.loader && rule.loader.includes("babel-loader")) {
       rule.loader = require.resolve("swc-loader");
       rule.options = { /* ... */ };
     }
   }
   ```
   That's reaching into CRA's internal, undocumented webpack config shape and mutating it by structural guesswork — a fragile pattern that breaks the moment CRA changes its internal rule structure. This is concrete evidence of exactly the kind of ceiling that motivates a full eject.
5. **Full eject to a hand-rolled Webpack 5 config** using `swc-loader` directly, with complete control over `output`, `optimization`, `HtmlWebpackPlugin`, etc.
6. **Split the single config file into `config/webpack.{common,dev,prod}.js` + a small `webpack.config.js` entry point**, composed with `webpack-merge` — standard practice once a team owns its config outright, though no commit message states a specific reason craco blocked this (this step's motivation is *inferred* from common practice, not confirmed by commit history).
7. **Swapped `swc-loader` for `babel-loader`** in the same commit that introduced `babel-plugin-react-compiler` — at the time this landed, the React Compiler's actively-supported integration path was the Babel plugin, with no equivalently mature SWC integration in general use. The commit message doesn't state this causal link explicitly, so treat it as a reasonable inference, not a documented fact.

## The four config files and how they compose

| File | Role |
|---|---|
| `webpack.config.js` (root) | Entry point read by `webpack`/`webpack-cli`/`webpack-dev-server`. Picks `development` or `production` and merges `common` with the matching mode file. |
| `config/webpack.common.js` | Shared across both modes: entry point, filesystem cache, module resolution, the Babel/React-Compiler loader rule, static-asset rules, `CopyWebpackPlugin`, and the `DefinePlugin` call that injects every `REACT_APP_*` env var. |
| `config/webpack.dev.js` | Dev-only: `mode`, `devtool` (readable source maps), unhashed `output` filenames, `style-loader`-based CSS injection (fast HMR), `HtmlWebpackPlugin` (no minification), and `devServer`. |
| `config/webpack.prod.js` | Prod-only: `devtool: false` (no source maps — saves real bundle weight), content-hashed `output`, `MiniCssExtractPlugin`-based CSS extraction, `HtmlWebpackPlugin` **with** minification, `TerserPlugin`/`CssMinimizerPlugin`, `BundleAnalyzerPlugin`, and the full `splitChunks`/`runtimeChunk` optimization block. |

```javascript
// webpack.config.js
const { merge } = require("webpack-merge");
const commonConfig = require("./config/webpack.common.js");
const devConfig = require("./config/webpack.dev.js");
const prodConfig = require("./config/webpack.prod.js");

module.exports = (env = {}, argv = {}) => {
  const mode = argv.mode || process.env.NODE_ENV || "development";
  switch (mode) {
    case "development":
      return merge(commonConfig, typeof devConfig === "function" ? devConfig(env, argv) : devConfig);
    case "production":
      return merge(commonConfig, typeof prodConfig === "function" ? prodConfig(env, argv) : prodConfig);
    default:
      throw new Error(`No matching Webpack configuration found for mode: ${mode}`);
  }
};
```

`webpack-merge`'s plain `merge()` **concatenates** array-valued keys (`module.rules`, `plugins`) and deep-merges object-valued keys. One consequence worth knowing: `common.js` and each mode file each register their *own* `DefinePlugin` call (common for `REACT_APP_*` vars, dev/prod for `NODE_ENV` only) — the merged config ends up with two separate `DefinePlugin` instances rather than one consolidated call. Both apply correctly; it's just not visually obvious from reading either file in isolation.

> **A real bug that shipped and was fixed as part of this documentation pass:** `webpack.config.js` requires `webpack-merge`, but it was never added to `package.json` — it only existed as a *transitive* dependency of `webpack-cli` inside pnpm's content-addressable store, which pnpm's strict linking does not expose at the project root. Every webpack-driven script (`dev`, `start`, `build`, `build:dev`, `analyze`) failed immediately with `Cannot find module 'webpack-merge'`, and since Vercel's `buildCommand` is `pnpm run build`, **every Vercel deploy was broken** until this was caught and fixed by adding the dependency explicitly. Lesson: a working `pnpm install` on a machine that happens to already have the package resolved transitively will hide this class of bug — it only surfaces on a clean install/lockfile regeneration, which is exactly what CI/CD does.

## Filesystem caching

```javascript
// config/webpack.common.js
cache: {
  type: "filesystem",
  buildDependencies: {
    config: [__filename],
  },
},
```
Webpack 5's built-in persistent cache serializes the compiled module graph to disk between runs. `buildDependencies.config: [__filename]` tells webpack to invalidate the entire cache if the config file itself changes — without this, editing the webpack config wouldn't reliably bust stale cached output. Combined with `babel-loader`'s own `cacheDirectory: true`, this is what gives repeat builds their speed win (a real, measured improvement per the project's own benchmarking, though treat any specific "X seconds → Y seconds" number as a point-in-time measurement, not a permanent guarantee — it depends on machine, cache state, and how much source has changed).

## Production optimization: minification, splitting, chunking

```javascript
// config/webpack.prod.js — optimization block, in full
optimization: {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
        output: { comments: false },
      },
      extractComments: false,
    }),
    new CssMinimizerPlugin(),
  ],
  splitChunks: {
    chunks: "all",
    maxInitialRequests: 25,
    maxAsyncRequests: 30,
    cacheGroups: {
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
        name: "react-core", priority: 30, chunks: "all",
      },
      antdIcons: {
        test: /[\\/]node_modules[\\/]@ant-design[\\/]icons[\\/]/,
        name: "antd-icons", priority: 25, chunks: "all",
      },
      antd: {
        test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
        name: "antd", priority: 20, chunks: "all",
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors", priority: 10, chunks: "all",
      },
      commons: {
        name: "commons", minChunks: 2, priority: -10, chunks: "initial", reuseExistingChunk: true,
      },
    },
  },
  runtimeChunk: {
    name: (entrypoint) => `runtime-${entrypoint.name}`,
  },
  usedExports: true,
  sideEffects: true,
  concatenateModules: true,
},
```

Why split `react-core`/`antd-icons`/`antd`/`vendors` into separate named cache groups instead of one big `vendors` bundle: **HTTP caching.** When the app's own code changes, users' browsers still have `react-core.js`/`antd.js` cached from their last visit (identical content hash, since neither library changed) — they only re-download the small `main.js` chunk. A single combined vendor bundle would force a full re-download of every third-party dependency on every app deploy, even ones that didn't change.

`drop_console`/`drop_debugger` in Terser's compress options strip `console.*`/`debugger` statements from production output — standard practice, worth knowing about if you're ever confused why a `console.log` you added isn't showing up in a production build.

## CSS pipeline: Tailwind, PostCSS, antd

Loader chain differs by mode, same `.css` test:

```javascript
// config/webpack.dev.js — style-loader for fast HMR, no extraction
{ test: /\.css$/, use: ["style-loader", { loader: "css-loader", options: { sourceMap: true } }, "postcss-loader"] }

// config/webpack.prod.js — MiniCssExtractPlugin for real, cacheable .css files
{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"] }
```
Loaders apply right-to-left: `postcss-loader` runs Tailwind + Autoprefixer first, then `css-loader` resolves `@import`/`url()`, then the mode-specific delivery mechanism (inject a `<style>` tag at runtime in dev, or extract to a real hashed `.css` file in prod). `postcss.config.js` is just:
```javascript
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```
antd v5 ships styled primarily via runtime CSS-in-JS, but its base reset (`antd/dist/reset.css`) plus `react-toastify`/`slick-carousel`'s own stylesheets are imported directly in `src/index.tsx` and flow through this same `.css` rule — there's no separate "vendor CSS" path.

## HTML generation and minification

`HtmlWebpackPlugin` renders `public/index.html` as a template and injects the built `<script>`/`<link>` tags. This project **previously had a regression here** (also fixed as part of this documentation pass): when the config was split into common/dev/prod modules, `HtmlWebpackPlugin` stayed in `common.js` with no `minify` option — meaning every production build shipped an unminified `index.html` (uncompressed whitespace, comments, etc.). The fix moves the plugin into each mode-specific file, so only the production instance sets:
```javascript
minify: {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  removeStyleLinkTypeAttributes: true,
  keepClosingSlash: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
},
```
This runs *before* `scripts/prerender.js` touches `build/index.html` afterward (see [doc 03](./03-ssg-prerendering-multilingual-seo.md)) — the prerender script's own balanced-`<div>`-matching logic works fine against minified HTML since minification only removes whitespace/comments, not the tag structure it depends on.

## Environment variables: no automatic `REACT_APP_` scanning

Unlike CRA, this hand-rolled setup does **not** automatically expose every `REACT_APP_*` variable to the client bundle — each one is manually enumerated in a `DefinePlugin` call:

```javascript
// config/webpack.common.js
new webpack.DefinePlugin({
  "process.env.PUBLIC_URL": JSON.stringify(""),
  "process.env.REACT_APP_DOMAIN": JSON.stringify(process.env.REACT_APP_DOMAIN || "https://movienew.cybersoft.edu.vn/api"),
  "process.env.REACT_APP_TOKEN_CYBERSOFT": JSON.stringify(process.env.REACT_APP_TOKEN_CYBERSOFT || ""),
  "process.env.REACT_APP_GROUP_ID": JSON.stringify(process.env.REACT_APP_GROUP_ID || "GP01"),
  "process.env.REACT_APP_TMDB_DOMAIN": JSON.stringify(process.env.REACT_APP_TMDB_DOMAIN || "https://api.themoviedb.org/3"),
  "process.env.REACT_APP_TMDB_API_KEY": JSON.stringify(process.env.REACT_APP_TMDB_API_KEY || ""),
  "process.env.REACT_APP_TMDB_TOKEN": JSON.stringify(process.env.REACT_APP_TMDB_TOKEN || ""),
}),
```
Each entry is a literal text substitution wherever `process.env.REACT_APP_X` appears in application source — this is why every consumer (`src/shared/constants/appConstants.ts`) writes `process.env.REACT_APP_DOMAIN || "..."` as a plain textual expression. **Every new env var needs a matching addition in three places**: `.env`/`.env.example`, this `DefinePlugin` block, and the Vercel dashboard — CRA used to do this for free by regex-matching any `REACT_APP_` key at build time; this setup trades that convenience for explicit control.

Note also that `scripts/prerender.js` calls `dotenv.config()` independently, in its own separate Node process, since it runs *after* webpack finishes as a plain `node scripts/prerender.js` invocation — it never goes through webpack/Babel/`DefinePlugin` at all.

## Type-checking is not part of this pipeline

Worth flagging here even though it gets its own full treatment in [doc 10](./10-typescript-safety-and-cicd-gaps.md): `@babel/preset-typescript` only **strips** TypeScript syntax, it does not check types. `pnpm typecheck` (`tsc --noEmit`) is a separate, manually-invoked script, not chained into `build`. A type error will not fail your build or block a Vercel deploy.

## Bundle analysis

`pnpm analyze` runs `webpack --mode production --env ANALYZE=true`. One detail easy to miss: `BundleAnalyzerPlugin` is present on **every** production build, not just `analyze` runs — `env.ANALYZE` only toggles its `analyzerMode` between `"server"` (interactive, auto-opens a browser, used by `pnpm analyze`) and `"static"` (silently writes `build/bundle-report.html`, the default for a plain `pnpm build`). If you ever wonder why `build/bundle-report.html` exists after a normal build, that's why.

## Dev server

```javascript
// config/webpack.dev.js
devServer: {
  port: process.env.PORT || 3000,
  historyApiFallback: true, // client-side routing survives a refresh in dev, mirroring vercel.json's rewrite in prod
  hot: true,
  open: false,
  static: { directory: path.join(__dirname, "../public") },
  client: { overlay: true },
},
```
There is **no `devServer.proxy` configuration** — the app calls both the Cybersoft API and TMDB directly, cross-origin, via absolute URLs (`axios.create({ baseURL: DOMAIN })` and RTK Query's `fetchBaseQuery({ baseUrl: tmdbBaseUrl })`). This only works because both third-party APIs already send permissive CORS headers; if you're used to seeing a dev-server proxy used specifically to dodge CORS, this project doesn't use that pattern.
