# Design Plan — Cinefix UI Redesign

Scope: redesign the visual layout/content of every page and shared component, using **only Tailwind CSS + Ant Design (antd)** as styling technology. The custom SCSS system (`src/assets/scss/**`) is retired entirely — no new `.scss`/`.css` files, no hand-rolled selectors. This document defines the design direction and content structure; see `implementation-plan.md` for the execution steps.

## 1. Design principles

1. **One token source.** Colors, radii, and font scale are defined once and shared by both Tailwind (`tailwind.config.js`) and antd (`ConfigProvider theme.token`). No component should hardcode a hex value.
2. **antd for structure & interaction, Tailwind for layout & spacing.** Use antd components (`Card`, `Tabs`, `Form`, `Button`, `Drawer`, `Skeleton`, `Carousel`, `Tag`, `Modal`, `Empty`) for anything with behavior/state. Use Tailwind utility classes for flex/grid layout, spacing, and responsive breakpoints around them.
3. **Consistency over novelty.** Login/Register currently hand-roll raw `<input>`/`<button>` with ad-hoc gradients; Header does the same for its mobile toggle. All of that becomes antd `Form`/`Input`/`Button`/`Drawer` so the whole app looks like one product, not four different tutorials stitched together.
4. **No visual regression in data — only in presentation.** Every field, action, and piece of data currently shown must still be shown (nothing removed), just re-laid-out and re-skinned.

## 2. Design tokens

Cinema/streaming-style dark theme with a warm accent (reads as "cinematic" without becoming a literal red/gold cliché).

| Token | Value | Used as |
|---|---|---|
| `background` (base) | `#0B0D12` | page background |
| `surface` | `#151822` | cards, header, footer, antd `Card`/`Modal` bg |
| `surface-hover` | `#1D2130` | hover state on surface elements |
| `border` | `#262B3A` | dividers, card borders |
| `primary` (accent) | `#F2545B` (warm coral-red) | primary buttons, active tab indicator, links, price highlight |
| `primary-hover` | `#FF6B72` | hover/active |
| `secondary` (accent 2) | `#FFC857` (amber) | ratings, "hot"/"new" badges, star icon |
| `text-primary` | `#F5F6FA` | headings, primary text |
| `text-secondary` | `#9AA0B4` | secondary text, meta info |
| `success` | antd default green | booking confirmed |
| `danger` | antd default red (distinct from `primary`) | errors, sold-out seat |
| radius | `10px` (cards), `8px` (buttons/inputs) | `rounded-xl` / `rounded-lg` in Tailwind, matching antd `borderRadius` token |
| font | `Inter` (or keep current `Roboto` if already loaded) for UI text; no separate display font | headings + body, weight 600/700 for headings |
| spacing scale | Tailwind default (4px base) | all layout spacing |
| container | `max-w-screen-xl mx-auto px-4 md:px-6` | consistent page gutter, replaces one-off `max-w-*` per page |

Implementation note: set these once in `tailwind.config.js` (`theme.extend.colors`) **and** in an antd `ConfigProvider theme={{ token: {...} }}` wrapper at the app root (`src/index.tsx` or `App.tsx`), pulling from the same constants object so they can never drift apart.

## 3. Global layout

### Header (sticky)
- Sticky top bar, `surface` background, subtle bottom border, backdrop-blur on scroll.
- Left: logo/wordmark ("Cinefix"). Center/right: nav links (Home, currently-fake "Contact"/"New" links should either get real destinations or be dropped — flag as an open question, don't invent fake pages).
- Right-aligned auth area: if logged in, avatar + name + `Button` (text/danger) "Đăng xuất"; if not, `Button` (default) "Đăng nhập" + `Button` (primary) "Đăng ký".
- Mobile: replace the hand-rolled hamburger + conditional `block/hidden` div with antd `Drawer` (right-side slide-in) triggered by a `MenuOutlined` icon button. Same nav content, stacked vertically.

### Footer
- Currently a single centered line. Expand slightly for a more finished feel while staying simple: 3-column layout on `md+` (brand blurb / quick links / copyright), collapsing to stacked centered text on mobile. Still no real social/contact data exists in the codebase — don't fabricate links, keep it minimal (brand + copyright + the existing nav links reused).

### Page shell
- Every route renders inside `max-w-screen-xl mx-auto px-4 md:px-6` content width except the Home hero/carousel, which can go full-bleed (`w-full`) above that constraint.
- Loading: keep `LoadingNew` for route-level Suspense fallback, but re-skin it as a centered antd `Spin` (size large) with the brand accent color instead of the current custom CSS animation — removes the last consumer of hand-rolled loading CSS.
- Empty/error states: introduce antd `Empty` for "no data" cases (e.g. film list empty, cinema list empty) — today these just silently render nothing.

## 4. Per-page redesign

### 4.1 Home (`/`, `/home`)
Current: 3 independently-lazy-loaded sections stacked with no visual separation (Carousel → Film list → Cinema list).

Redesign as three clearly delineated sections inside the page shell:

1. **Hero banner** — keep `antd Carousel` (autoplay) but make it full-bleed with a gradient overlay (`bg-gradient-to-t from-background/90 to-transparent`) at the bottom so future banner text/CTA is legible if content team adds it later. Dots restyled to `primary` color instead of default. Skeleton state: full-width shimmer block (`SkeletonCarousel`, re-skinned with Tailwind + antd `Skeleton.Image`, no custom CSS).
2. **"Phim đang chiếu" (Now showing)** — section header (`h2` + optional "Xem tất cả" link, even if it doesn't navigate anywhere useful yet — flag as open question), then the existing `react-slick` film carousel restyled: each `FilmItem` becomes an antd `Card` (`hoverable`, cover image, meta) instead of a raw `<img>` inside a slick slide, laid out via Tailwind grid gap. Loading: antd `Skeleton` cards matching the film-card shape (already exists as `SkeletonCard`, just restyle).
3. **"Hệ thống rạp chiếu" (Cinemas)** — the current nested `Tabs` (chain → cluster → showtimes as `Tag`s) is functionally fine; restyle: outer `Tabs` `type="card"`, cluster sub-tabs as pill buttons, showtime `Tag`s become small antd `Button` (`type="dashed"`) chips grouped by date so users can scan by day instead of a flat tag wall.

### 4.2 Film Detail (`/detail/:id`)
Current: a single narrow `antd Card` (poster + name + play-trailer icon) floated left with an empty `<div>` next to it, then showtimes tabs below.

Redesign:
- **Hero section**: full-width backdrop using the film's own poster (blurred/darkened, `bg-cover` + overlay) as background, with the sharp poster (antd `Image`, supports zoom-on-click, replacing the current plain `<img>`) on the left and film info on the right — title, a "▶ Xem trailer" `Button` (primary) that opens the trailer in an antd `Modal`/embedded iframe instead of `window.open`, and any available metadata (currently only `tenPhim`/`hinhAnh`/`trailer` are used — don't invent fields that aren't in `FilmDetail`, but do surface all fields it actually has, e.g. rating/description if present in the type).
- **Showtimes section** below the hero, same chain→cluster→showtime `Tabs` pattern as Home's cinema section for visual consistency, grouped by date.
- Remove the current stray empty `<div></div>` next to the poster card — it's dead layout filler.

### 4.3 Booking (`/booking/:maLichChieu`)
Current state: **this page has no real UI** — it only dispatches a fetch and renders the literal text `BookingTicket`. This is net-new design, not a re-skin. The saga already fetches a "danh sách phòng vé" (seat map) via `GET_TICKET_API`.

Proposed layout (two-column on desktop, stacked on mobile):
- **Left/main column**: showtime summary bar (film name, cinema, room, date/time — from the fetched booking detail) as a `Card`, then the seat map: a `Card` containing a CSS-grid (Tailwind `grid`) of seat buttons, color-coded by state (available = `surface`, selected = `primary`, sold = `text-secondary`/disabled, VIP tier = `secondary` border) with a small legend row above the grid.
- **Right column (sticky on desktop, bottom sheet on mobile)**: booking summary `Card` — selected seats list, per-seat price, total price, and a primary `Button` "Xác nhận đặt vé" (disabled until ≥1 seat selected).
- Since seat-type/price/sold-state fields aren't modeled yet in `Redux/types/BookingTicketType.ts`, the implementation plan must extend that type and the reducer to hold `selectedSeats` — this is a real feature addition, not just styling, and should be scoped/estimated separately from the pure re-skin work.

### 4.4 Auth — Login (`/login`) & Register (`/register`)
Current: two different one-off layouts (split-screen with a random Unsplash image vs. a centered violet card), both with raw `<input>`.

Redesign: **unify into one shared auth layout** (`AuthLayout`) used by both — split-screen on `lg+` (branding/art panel left using a real static asset instead of `source.unsplash.com/random`, which is non-deterministic and shouldn't ship to prod; use a poster collage or solid brand-gradient panel instead), centered card-only on mobile. Inside the card:
- Migrate every field to antd `Form` + `Form.Item` + `Input`/`Input.Password` + `Button` (primary, block). This also means validation moves from `formik` + `yup` to antd `Form`'s built-in `rules` — see the recommendation in `implementation-plan.md` (optional but recommended for full antd consistency).
- Login fields: `taiKhoan`, `matKhau` (unchanged). Register fields: `taiKhoan`, `matKhau`, `email`, `soDt`, `hoTen` (unchanged; `maNhom` stays a hidden constant, not a visible field, as it is today).
- Footer link ("Need an account?" / "Already have an account?") styled the same way in both, using antd `Typography.Link`.

## 5. Responsive breakpoints
Use Tailwind's default breakpoints (`sm`/`md`/`lg`/`xl`) exclusively — retire the custom `450px` (`$bp-mobile`) SCSS breakpoint. Anywhere the old SCSS used a bespoke breakpoint, round to the nearest Tailwind default (`sm: 640px` is the closest match for the current mobile carousel behavior).

## 6. Component inventory (antd replacing hand-rolled HTML)

| Old | New |
|---|---|
| raw `<input>`/`<button>` (Login/Register) | antd `Form.Item` + `Input`/`Input.Password` + `Button` |
| hand-rolled hamburger + `block/hidden` div (Header) | antd `Drawer` + `MenuOutlined` |
| custom `_loadingNew.scss` spinner | antd `Spin` |
| plain `<img>` for poster (Detail) | antd `Image` |
| `window.open` for trailer | antd `Modal` with embedded video |
| nothing (Booking page) | antd `Card`, `Button`, `Empty`, `Skeleton` for the new seat-map UI |

## 7. Open questions for the product owner (don't guess these — ask before the executing agent invents content)
- Header's "Contact" / "New" links currently point nowhere (`to="/"`) — real destinations, or remove them?
- Should the Home "Xem tất cả" (see all) link on the film section go anywhere (e.g. a future `/films` listing page), or omit it for now?
- Is there a real logo asset to replace `./img/Movie.png` / the Unsplash placeholder on the auth screen, or should this plan ship with a generated placeholder?
- Seat pricing/tier rules for the Booking page — is this data already returned by `LayDanhSachPhongVe`, or does it need a separate lookup? (implementation plan assumes it's in the existing response; confirm against the real API shape before building the seat grid.)
