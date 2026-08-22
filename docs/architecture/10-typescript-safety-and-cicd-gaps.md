# 10. TypeScript Configuration & the Type-Safety/CI Gap

## `tsconfig.json`, in full, with what each option actually buys you

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src"
  },
  "include": ["src"]
}
```

| Option | What it does here |
|---|---|
| `strict: true` | Turns on the full strict-mode bundle (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc. all at once) — the single most impactful flag for catching real bugs (like forgetting a value can be `null`/`undefined`) at the type level. |
| `noEmit: true` | TypeScript's own compiler is used **only** for checking, never for emitting `.js` output — actual JS emission is Babel's job (`@babel/preset-typescript` in the webpack pipeline, see [doc 02](./02-webpack5-build-optimization.md)). This is the option that makes it correct to say "TypeScript here is a linter, not a compiler." |
| `isolatedModules: true` | Requires every file to be safely transpilable in isolation, one file at a time, with no cross-file type information needed to emit correct JS. This is a **direct consequence** of the Babel-strips-types architecture: Babel processes one file at a time and has zero knowledge of your other files' types, so a handful of TS features that need whole-program knowledge to erase correctly (e.g. re-exporting a type without `export type`, in older TS versions) are disallowed outright. If you ever hit an `isolatedModules`-related error, it's telling you the code you wrote assumes a type-checking compiler is doing the emit — it isn't, here. |
| `baseUrl: "src"` | Enables the `features/home/...`, `shared/components/...` absolute-import style used throughout the app. See [doc 06](./06-feature-based-architecture-and-index-barrels.md#how-the-absolute-imports-featureshome-sharedcomponentsheader-actually-resolve) for exactly how this coordinates (or rather, coincidentally agrees) with webpack's own separate resolution config — there's no `paths` map, and no shared mechanism enforcing the two stay in sync. |
| `module: "ESNext"` + `moduleResolution: "node"` | Emit/resolve using native ES module syntax and Node-style resolution — appropriate since webpack (not `tsc`) does the actual bundling and understands ESM natively. |
| `skipLibCheck: true` | Skip type-checking inside `.d.ts` files from `node_modules` — a near-universal pragmatic default; without it, a single poorly-typed dependency can produce unfixable-by-you type errors. |

## The core trade-off: type-checking is not part of the build

This is the single most important thing to understand about this project's relationship with TypeScript, and it's worth stating without hedging: **`pnpm build` does not check types.** `@babel/preset-typescript` — the thing actually responsible for turning your `.tsx` into JS the browser can run — works by *stripping* TypeScript syntax (annotations, interfaces, type-only imports) as a pure textual/syntactic transform. It does not, and architecturally *cannot*, verify that your types are internally consistent; it has no type-checker inside it at all. A file with a genuine type error (e.g. passing a `string` where a `number` is expected) will compile, bundle, and ship to production exactly as if it were correct.

Real type-checking only happens via:
```json
"typecheck": "tsc --noEmit"
```
— a separate script, invoked manually, that is **not** chained into `build`, `build:dev`, `dev`, or `analyze` anywhere in `package.json`. And there is no CI pipeline in this repository at all (no `.github/workflows` directory, no other CI config) that might otherwise run it automatically on every push or PR. Since `vercel.json`'s `buildCommand` is exactly `pnpm run build`, **Vercel deploys never type-check the code either.**

## Why this trade-off exists, and when it's the right call

This isn't an oversight to be embarrassed about — it's a deliberate, common trade-off for projects that value build speed: Babel's per-file, embarrassingly-parallel, cacheable transpilation model is significantly faster than running TypeScript's own type-checking compiler (`tsc`) as part of every build, especially incrementally. Many production React setups (this one included) accept "types are checked by the editor and by a separate manual/CI step, but never block a build" as the right speed/safety balance. **The problem here specifically is that the "separate CI step" half of that bargain doesn't exist yet** — there's a `typecheck` script, but nothing runs it automatically. That's the actual gap, not the Babel-strips-types architecture itself (which is fine, and used successfully by many large real-world codebases, e.g. this pattern is exactly what Next.js's SWC-based compiler and Vite's esbuild-based dev server both also do by default).

## A related, concrete piece of evidence: a stale CRA reference that `tsc` never complained about

```typescript
// src/react-app-env.d.ts
/// <reference types="react-scripts" />
```
`react-scripts` (the CRA package) is completely absent from `package.json` and `node_modules` — this file is a leftover from before the project ejected (see [doc 02](./02-webpack5-build-optimization.md#why-this-isnt-create-react-app-anymore)). Empirically, `tsc --noEmit` still exits cleanly with this reference in place (TypeScript treats an unresolvable triple-slash reference as a non-fatal issue in this configuration, rather than a hard error) — so it's not currently breaking anything, but it's a small, honest example of "the eject wasn't 100% swept for every leftover reference," and a reminder that a clean `tsc --noEmit` exit code doesn't mean *nothing* is stale, only that nothing type-level is currently broken.

## What running `pnpm typecheck` regularly would actually catch, concretely

Given the rest of this doc set, a few categories of real bug in this exact codebase that only a type-checker (not Babel, not ESLint's default rules, not the existing 7 tests) would reliably catch if introduced by a future change:
- A saga worker's `action.payload` shape drifting out of sync with what the dispatching component actually sends (the string-constant + raw-`dispatch({type, payload})` pattern documented in [doc 04](./04-redux-saga-rtk-query-state-management.md) has no compile-time link between the dispatch site and the saga's expected payload type unless both sides are annotated and that annotation is actually checked).
- A `zod`-inferred form type (`z.infer<typeof schema>`, [doc 08](./08-forms-react-hook-form-zod.md)) drifting from what a component actually reads off `formState.errors` if a field is renamed in the schema but not everywhere it's consumed.
- Props passed to a component after a refactor that no longer match that component's actual prop interface (a bug class React itself won't complain about at runtime unless the missing prop happens to be used in a way that throws).

## Recommendation for this codebase, stated plainly

If a CI pipeline is ever introduced (there is currently none), the single highest-leverage addition relative to effort is: run `pnpm typecheck` (and `pnpm test`) on every pull request before merge, and consider gating deploys on it. Until then, running `pnpm typecheck` manually before pushing is the only thing standing between a real type error and production.
