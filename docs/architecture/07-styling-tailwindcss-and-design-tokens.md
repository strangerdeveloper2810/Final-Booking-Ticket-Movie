# 07. Styling: Tailwind CSS, Design Tokens & antd Theming

## Why Tailwind CSS at all — the utility-first trade-off

Tailwind CSS takes a different bet than the two more traditional alternatives:

| Approach | What it looks like | Trade-off |
|---|---|---|
| **Hand-written CSS/SCSS** (this project's own pre-refactor state) | `.wrap-movie { display: flex; ... }` in a separate stylesheet, referenced by class name | Full control, but naming things is real work, and unused rules silently accumulate as dead weight — verified in this exact repo's own history: an earlier SCSS-based version had partials with genuinely dead rules (e.g. a `.carousel-container` selector matching no actual className anywhere in the app) that nobody noticed until an explicit audit. |
| **CSS-in-JS** (styled-components, Emotion) | Styles co-located with the component, scoped automatically | Runtime cost (style injection happens in JS), and doesn't compose well with a component library that does its own runtime styling (antd v5's CSS-in-JS engine) — two CSS-in-JS runtimes in one app is a real anti-pattern to avoid. |
| **Utility-first (Tailwind)** — what this project uses | `className="flex justify-center mt-6"` directly in JSX | No naming problem (there's nothing to name), and genuinely dead utility classes are structurally rare (you'd have to leave an unused `className` string sitting in dead JSX, not an unused rule in a stylesheet nobody reads) — the trade-off is JSX readability: markup gets visually denser, and consistency depends entirely on discipline (nothing stops two engineers from expressing "8px padding" as `p-2` in one file and an arbitrary `p-[8px]` in another). |

This codebase's own migration history is a live example of the first two rows: it started with hand-rolled SCSS, and one specific finding from an internal review before the Tailwind-only migration was completed is worth repeating here as a cautionary tale — the SCSS system had accumulated a dead rule, a stale breakpoint duplicated in two places, and a component (`Loading`) that had been fully replaced (`LoadingNew`) while its old stylesheet partial kept shipping under the old name. None of that is a Tailwind-specific problem, but it's exactly the failure mode utility classes structurally avoid (there's no separate stylesheet to fall out of sync with the component that uses it).

## `tailwind.config.js`, in full

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        surface: "var(--surface-color)",
        "surface-hover": "var(--surface-hover-color)",
        border: "var(--border-color)",
        primary: "#F2545B",
        "primary-hover": "#FF6B72",
        secondary: "#FFC857",
        "text-primary": "var(--text-primary-color)",
        "text-secondary": "var(--text-secondary-color)",
      },
      borderRadius: { xl: "10px", lg: "8px" },
    },
  },
  plugins: [],
};
```
Two things worth understanding here specifically:

1. **`darkMode: "class"`** (not Tailwind's other option, `"media"`, which follows the OS-level `prefers-color-scheme`). This means dark/light mode is controlled by whether a `.dark` class is present on `<html>`, toggled explicitly by application code (see the theme section below) — not automatically inferred from the OS. This is the right choice whenever an app wants a user-controllable theme toggle rather than "always match your OS," which is the case here (`ThemeContext.tsx` reads/writes a cookie so the choice persists and can be set independent of the OS).
2. **Most colors are `var(--*)` indirections, not literal hex values** — `background`, `surface`, `border`, `text-primary`, `text-secondary` all resolve through CSS custom properties defined elsewhere (`src/index.css`). This is *how* dark/light theming actually works with Tailwind's utility classes: the Tailwind class name (`bg-background`) never changes between themes, only the underlying CSS variable's value does, swapped by the presence/absence of the `.dark` class. **But `primary`, `primary-hover`, and `secondary` are hardcoded hex literals right here**, not `var(--*)` — an inconsistency worth noticing (see "the token duplication problem" below).

`content: ["./src/**/*.{js,jsx,ts,tsx}"]` is Tailwind's content-scanning glob — it statically scans these files for class-name-shaped strings to decide which utilities to actually generate, which is how Tailwind avoids shipping every possible utility class (tens of thousands of them) in the final CSS — only classes that literally appear as text somewhere in a scanned file make it into the output. This has a well-known implication worth knowing: **dynamically constructed class name strings** (e.g. `` `text-${color}-500` ``) won't be detected by this scan and won't be generated — Tailwind can only see literal, complete class-name strings in your source.

## Design tokens: the plan vs. what actually shipped

`docs/refactor/design-plan.md` (an earlier planning document in this repo) stated an explicit intention: *"One token source. Colors, radii, and font scale are defined once and shared by both Tailwind and antd... pulling from the same constants object so they can never drift apart."*

**The implementation diverged from that plan.** As shipped, there are **three** independently-maintained copies of the same palette:

1. **`src/shared/theme/tokens.ts`** — a plain TS object (dark-mode-shaped values only):
   ```typescript
   export const tokens = {
     background: "#0B0D12", surface: "#151822", surfaceHover: "#1D2130", border: "#262B3A",
     primary: "#F2545B", primaryHover: "#FF6B72", secondary: "#FFC857",
     textPrimary: "#F5F6FA", textSecondary: "#9AA0B4",
     success: "#52c41a", danger: "#ff4d4f",
     borderRadiusCard: 10, borderRadiusButton: 8,
   };
   ```
2. **`src/index.css`'s CSS custom properties** — hand-copied hex values, defined separately for **both** light (`:root`) and dark (`.dark`) modes (light-mode values have no counterpart in `tokens.ts` at all, since that file only models the dark palette).
3. **Hardcoded hex literals directly in `tailwind.config.js`** (`primary: "#F2545B"`, `"primary-hover": "#FF6B72"`, `secondary: "#FFC857"`) and again in `src/index.css` (e.g. an `.ant-tabs-tab-active` override and a slick-carousel dots-active-color rule) — both matching `tokens.ts`'s values by manual copy-paste, not by import.

Nothing currently *generates* (2) or (3) from (1) — they can, and already partially do, drift apart (light mode simply isn't represented in `tokens.ts` at all). **This is presented here as a real, concrete example of a documented intention not fully surviving implementation** — useful precisely because it's the kind of drift that's easy to introduce with good intentions and easy to miss in review, not because anyone did anything unreasonable. If you touch the color palette, the honest todo is: pick one of these three as the actual source, generate or import the others from it, and delete the duplicates.

## antd theming: `ConfigProvider` + `ThemeContext`

antd v5 (unlike v4) styles itself primarily via a runtime CSS-in-JS engine driven by a `ConfigProvider theme` prop, not compiled Less variables — which is exactly what makes token-sharing with Tailwind possible in the first place (there's no separate Less build step to also keep in sync).

```tsx
// src/shared/theme/ThemeContext.tsx (relevant excerpt)
<ConfigProvider
  theme={{
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: tokens.primary,
      colorBgContainer: isDark ? tokens.surface : "#FFFFFF",
      colorText: isDark ? tokens.textPrimary : "#1F2937",
      colorTextDescription: isDark ? tokens.textSecondary : "#4B5563",
      colorBorder: isDark ? tokens.border : "#E5E7EB",
      borderRadius: tokens.borderRadiusButton,
    },
  }}
>
```
`algorithm: darkAlgorithm | defaultAlgorithm` is antd's own built-in mechanism for deriving an entire consistent color system (hover states, disabled states, shadows) from a small set of seed tokens — you don't hand-specify every antd component's dark-mode color, the algorithm derives sensible ones from `colorPrimary`/`colorBgContainer`/etc. Note the light-mode values here (`"#FFFFFF"`, `"#1F2937"`, `"#4B5563"`, `"#E5E7EB"`) are inline literals, not sourced from `tokens.ts` at all (reinforcing the point above — `tokens.ts` is really a dark-mode-only file today, despite its generic name).

### How the theme toggle avoids a flash of the wrong theme

`public/index.html` runs a small **synchronous, inline `<script>`** in `<head>`, before any CSS or the React bundle loads:
```html
<script>
  (function () {
    try {
      var c = document.cookie.match(/app_theme_mode=([^;]+)/);
      var t = c ? c[1] : "dark";
      if (t !== "light") document.documentElement.classList.add("dark");
    } catch (e) {}
  })();
</script>
```
This is a well-known technique for avoiding FOUC/CLS (flash of unstyled content / cumulative layout shift) from theme switching: if the `.dark` class were only added after React mounts and `ThemeContext` initializes, a returning dark-mode user would see a flash of the light theme's colors first. Reading a plain cookie synchronously in a blocking inline script, before the stylesheet that depends on `.dark` even has a chance to paint, closes that gap. This is also *why* the theme preference is stored in a **cookie** rather than `localStorage` here — a cookie is readable synchronously in this position exactly the same way either storage would be, but the specific mechanism (a plain string match, not JSON parsing) is simple enough to be trivially safe to run this early, wrapped in a `try`/`catch` in case cookies are disabled.

## Practical guidance for this codebase

- Prefer Tailwind utility classes for anything layout/spacing-related; reach for antd components (not raw HTML) for anything with real interactive behavior — see the project's own migration away from raw `<input>`/`<button>` elements in favor of antd `Form`/`Input`/`Button` (documented in [doc 08](./08-forms-react-hook-form-zod.md)).
- If you add a new color to the palette, treat `tokens.ts` as the intended source of truth per the original design plan, and manually propagate it to `index.css`'s CSS variables and `tailwind.config.js` until someone actually wires a real single-source mechanism (e.g. generating the CSS variables file and part of `tailwind.config.js`'s `theme.extend.colors` from `tokens.ts` at build time) — don't add a fourth independent copy.
- Remember Tailwind's content-scanning limitation: never build a class name via string concatenation/interpolation if you want Tailwind to actually generate it.
