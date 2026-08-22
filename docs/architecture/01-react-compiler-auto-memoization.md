# 01. React 19 & React Compiler Auto-Memoization

## Theory: the problem this solves

Before React 19, avoiding wasteful re-renders in a component tree meant manually telling React what *not* to recompute:

- `React.memo(Component)` — skip re-rendering a component if its props are shallow-equal to last time.
- `useCallback(fn, deps)` — keep the same function reference across renders unless `deps` changed, so children wrapped in `React.memo` don't see a "new" prop every render.
- `useMemo(fn, deps)` — cache an expensive computed value across renders unless `deps` changed.

This works, but has three well-known failure modes:
1. **Overhead.** Every performance-sensitive component needs 2-3 extra hooks and a dependency array, which is pure ceremony relative to the actual business logic.
2. **Stale-closure bugs.** If you forget a value in a `useCallback`/`useMemo` dependency array, the memoized function/value silently keeps referencing an old value — a bug class specific to manual memoization that doesn't exist if you never memoize at all.
3. **Memory/GC pressure from over-memoization.** Wrapping everything "just in case" creates more retained objects than the re-renders it was meant to prevent were actually costing.

**React Compiler** (shipped as `babel-plugin-react-compiler`, still in beta as of this codebase's dependency pin — `^19.0.0-beta-e552027-20250112` in `package.json`) moves this decision out of the developer's hands entirely. It's a Babel AST transform that runs at build time, not a runtime library: for every component/hook function, it performs a dataflow analysis to determine which values can change between renders and which are derived from which inputs, then **rewrites the function body** to insert the equivalent of manual memoization automatically. If it can't prove a given expression is safe to memoize (e.g. it can't establish the "Rules of React" hold — no mutating props/state outside the render itself, no untracked side effects during render), it simply leaves that expression unmemoized rather than risk incorrect behavior. It never makes your code *less* correct; worst case it just doesn't help in a spot it can't prove is safe.

## Why this codebase uses it

Verified by exhaustive grep across every `.tsx`/`.ts` file under `src/`: **there are zero occurrences of `useCallback`, `useMemo`, or `React.memo` anywhere in the codebase.** This is a deliberate, consistently-applied convention, not an oversight — the team writes plain functions and plain object/array literals directly in component bodies and lets the compiler handle memoization. A few real examples of code that would, in a pre-Compiler React 18 codebase, almost certainly have been wrapped in a memoization hook, and today just... isn't:

- **`src/shared/components/Header/Header.tsx`** — `handleNavClick`, `handleLogOut`, and `changeLanguage` are plain functions redefined on every render and passed straight into `onClick` props of `NavLink`/`Button`/`Dropdown` menu items. `languageMenuItems` and `navLinks` are array-of-object literals (each containing an inline `onClick` closure) rebuilt every render — these feed into antd's `Dropdown menu` prop, whose identity churning would normally justify a `useMemo`.
- **`src/features/home/components/TMDBMovieSection.tsx`** — `sliderSettings`, a fairly large object literal with a nested `responsive` array, is rebuilt every render and spread directly into `<Slider {...sliderSettings}>`. Classic `useMemo` bait, left as a bare literal.
- **`src/features/home/components/CarouselHome.tsx`** and **`ListMovie.tsx`** — render-helper functions and inline event handlers are defined fresh every render with no `useCallback`.

## How it's wired into the build

There is no `babel.config.js`/`.babelrc` in this repo — the entire Babel configuration lives inline inside the webpack loader options, in `config/webpack.common.js`:

```javascript
// config/webpack.common.js
{
  test: /\.(ts|tsx|js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      cacheCompression: false,
      presets: [
        "@babel/preset-env",
        ["@babel/preset-react", { runtime: "automatic" }],
        "@babel/preset-typescript",
      ],
      plugins: [
        ["babel-plugin-react-compiler", { target: "19" }],
      ],
    },
  },
},
```

`target: "19"` tells the compiler which React runtime APIs it can assume are available when it emits its memoization helpers. `@babel/preset-typescript` in the same pipeline is doing something unrelated but worth flagging here since it's adjacent: it strips TypeScript syntax so Babel can process `.tsx`, but it does **not** type-check anything — see [doc 10](./10-typescript-safety-and-cicd-gaps.md) for why that matters.

## Engineering trade-offs, honestly

**Real benefits realized here:**
- Every component in `src/features/*/components` and `src/features/*/pages` is measurably simpler to read — no dependency-array bookkeeping competing for attention with the actual UI logic.
- Zero stale-closure bugs from manual memoization are possible, because there is no manual memoization to get wrong.

**Real costs/risks worth knowing about:**
- **This dependency is a beta release.** `^19.0.0-beta-e552027-20250112` is a prerelease tag, not a GA version of the compiler. A caret range on a prerelease effectively pins to that exact prerelease train — upgrading requires deliberately bumping to a newer beta or the eventual stable release, and beta compiler behavior/bug surface is inherently less battle-tested than the hooks it replaces.
- **The compiler is a black box relative to manual memoization.** When a hand-written `useMemo` doesn't behave as expected, you can read the dependency array and reason about it directly. When the compiler doesn't memoize something you expected it to, the only way to know is to inspect the compiled output or profile — there's no dependency array to eyeball in the source.
- **This is an all-or-nothing team convention, not enforced by tooling.** Nothing in this repo (no lint rule, no CI check) actually prevents someone from adding a manual `useCallback` back in — it would just be redundant with what the compiler already does, not broken. The "no manual memoization" rule is presently a matter of team discipline, not a guardrail.
