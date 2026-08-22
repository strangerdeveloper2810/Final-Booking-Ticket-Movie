# 09. Error Boundaries & Crash Resilience

## The problem this solves

By default, an uncaught JavaScript error thrown during React's render phase unmounts the **entire** component tree — a bug in one small widget can take down the whole page, leaving the user staring at a blank screen with no indication anything went wrong. React's answer is the "error boundary" pattern: a component that implements `componentDidCatch`/`static getDerivedStateFromError` (this is one of the few remaining class-component-only APIs — there is still no hooks equivalent for error boundaries in React as of this writing) to catch errors thrown by its descendants and render a fallback UI instead of letting the crash propagate further up.

## This app uses two layers, not one

```tsx
// src/index.tsx — the outer, global boundary
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
);
```
```tsx
// src/App.tsx — the inner, route-level boundary
const App: FC = (): JSX.Element => (
  <HelmetProvider>
    <CustomThemeProvider>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </CustomThemeProvider>
  </HelmetProvider>
);
```
**Why two, not one**: the outer boundary in `index.tsx` wraps the Redux `Provider` and `BrowserRouter` themselves — if either of *those* ever failed to initialize (vanishingly rare, but not impossible), the outer boundary is the only thing that could still catch it, since nothing below it in the tree would even exist yet to catch anything. The inner boundary in `App.tsx` wraps just `AppRoutes` — this is the one that actually matters day-to-day: if a bug in, say, the `Detail` page's render throws, this boundary catches it *without* also unmounting `HelmetProvider`/`CustomThemeProvider`, meaning the app's theme and SEO context survive and a properly-styled fallback UI can still render, rather than falling all the way back to whatever the outermost boundary's fallback looks like. This two-layer shape is a reasonable, deliberate defense-in-depth pattern: catch as close to the failure as you usefully can, with a coarser backstop above it for anything that escapes.

## Where this component actually lives, and why

`ErrorBoundary` sits in `src/shared/components/ErrorBoundary/` — see [doc 06](./06-feature-based-architecture-and-index-barrels.md#shared-vs-features-the-rule-tested-against-real-files) for a fuller discussion of the `shared/` vs `features/` boundary in general, but the honest note specific to this component: both of its current usages are in `app`-composition-root files (`index.tsx`, `App.tsx`), not inside any individual feature. No feature today wraps one of its own risky sub-trees (e.g. isolating just the seat-selection grid in `BookingTicket.tsx` so a rendering bug there doesn't take out the whole booking page) in its own `ErrorBoundary` instance. It living in `shared/` rather than `app/` is defensible either way — `shared/` keeps the door open for a feature to reach for it directly in the future — but it's worth naming that its actual observed usage today is exclusively at the composition-root level, not genuinely cross-feature yet.

## This component's `index.ts` is the one that actually earns its keep

Worth cross-referencing directly from [doc 06](./06-feature-based-architecture-and-index-barrels.md#why-errorboundary-is-the-one-that-works--proof-from-git-history): of the 11 barrel (`index.ts`) files under `src/`, `ErrorBoundary`'s is the **only** one any real code actually imports through. Its own git history shows why — the component was originally implemented directly inside a file named `index.tsx`, then renamed to `ErrorBoundary.tsx` with a new one-line `index.ts` barrel added to preserve the import path. Both consumers (`index.tsx`, `App.tsx`) needed zero changes across that rename specifically *because* they'd always imported the folder, not a hardcoded filename — the single clearest, real (not hypothetical) demonstration in this codebase of what a barrel file is actually for.

## Practical guidance

- If you're adding a genuinely risky, isolated piece of UI inside a feature (something that renders based on unpredictable third-party or deeply-nested API data, for instance), consider wrapping just that sub-tree in its own `<ErrorBoundary>` rather than relying solely on the route-level one in `App.tsx` — that way a failure there degrades gracefully in place instead of blanking the entire page the user was on.
- Don't expect an error boundary to catch everything: React error boundaries do **not** catch errors in event handlers, async code (e.g. inside a `.then()` or an `async` function not awaited during render), server-side rendering (not applicable here — see [doc 03](./03-ssg-prerendering-multilingual-seo.md)), or errors thrown in the boundary component itself. Those need their own handling (a `try`/`catch`, a `.catch()`, or — for the sagas in this codebase — the existing `catch` blocks and `toast.error(...)` calls documented in [doc 04](./04-redux-saga-rtk-query-state-management.md)).
