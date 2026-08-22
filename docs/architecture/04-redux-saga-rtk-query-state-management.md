# 04. State Management: Redux Toolkit, Redux-Saga & RTK Query

This is a hybrid state-management architecture: **Redux Toolkit** provides the store/slice mechanics, **Redux-Saga** handles complex async flows with side effects, and **RTK Query** handles simple cache-friendly server reads. All three coexist in the same store. This doc explains each technology on its own, then — more importantly — documents the *real*, verified dividing line between them in this specific codebase, which turns out to be messier and more interesting than the idealized "old API vs new API" story.

## Part 1: Redux Toolkit (`createSlice`) — the state layer

Every single "reducer" file in this codebase, regardless of its filename (`BannerSaga.reducer.ts`, `UserSaga.reducer.ts`, `Loading.reducer.ts`, etc.), is a real RTK `createSlice` call. There is **zero** legacy hand-written switch-statement reducer code anywhere. A representative example, in full:

```typescript
// src/features/home/redux/banner/BannerSaga.reducer.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Banner } from "./BannerType";
import { initialBanner } from "./BannerConstants";

export type BannerState = { arrBanner: Banner[] };
const initialState: BannerState = { arrBanner: initialBanner };

const BannerSagaReducer = createSlice({
  name: "Banner",
  initialState,
  reducers: {
    getAllBanner(state: BannerState, action: PayloadAction<Banner[]>) {
      state.arrBanner = action.payload;
    },
  },
});

export const BannerSagaAction = BannerSagaReducer.actions;
export default BannerSagaReducer.reducer;
```
`createSlice` gives you Immer-powered "mutate the draft state directly" syntax (`state.arrBanner = action.payload` looks like a mutation but is safely translated into an immutable update under the hood) plus auto-generated action creators (`BannerSagaAction.getAllBanner(...)`) and a matching action-type string (`"Banner/getAllBanner"`), all from one declaration — this is the actual "toolkit" value proposition over hand-writing `switch (action.type) { case ... }` reducers and separate action-creator functions.

### `src/app/store.ts` — how everything is wired together

```typescript
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    Banner: BannerReducerSaga,
    FlimList: FilmListSagaReducer,
    Loading: LoadingReducer,
    ListCinema: ListCinemaSagaReducer,
    UserSaga: UserSagaReducer,
    Booking: BookingTicketReducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [tmdbApi.reducerPath]: tmdbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware, movieApi.middleware, tmdbApi.middleware),
});

sagaMiddleware.run(rootSaga);
```
Eight reducer keys total — six hand-registered slices plus RTK Query's two auto-generated reducer paths (`movieApi`/`tmdbApi`, added via computed-property syntax off each API's own `reducerPath`). One call to `.concat()` appends all three non-default middlewares (saga + both RTK Query APIs) in one pass. Note `getDefaultMiddleware()` is called with no options — RTK's default serializable-state/action checks are left fully active, which only works safely here because no saga ever `put()`s a non-serializable value (generator objects, class instances, Promises) into the store; every dispatched action carries a plain-object payload.

### `src/app/rootSaga.ts` — registering every feature's watchers

```typescript
export function* rootSaga() {
  yield all([
    banner.actionGetAllBanner(),
    user.actionRegisterSaga(),
    user.actionLoginSaga(),
    film.actionGetAllFilm(),
    cinema.actionGetAllCinema(),
    booking.actionGetTicketApi(),
  ]);
}
```
`all([...])` runs every listed generator concurrently, forever (each one is a `takeLatest`-based watcher that just waits for its action type). This is the single place in the whole app that knows about every feature's saga module — see [doc 06](./06-feature-based-architecture-and-index-barrels.md) for why that composition-root pattern matters.

## Part 2: Redux-Saga — side-effect orchestration

Redux-Saga uses generator functions and declarative "effects" (`call`, `put`, `takeLatest`, `all`, `delay`) to describe async flows in a way that's testable without mocking timers or promises — you can step through a generator in a unit test and assert on the plain-object effect descriptions it yields, without anything actually executing.

**The trigger mechanism in this codebase is classic, pre-RTK Redux**, not `createAsyncThunk`: every side-effect-triggering action is a plain string constant, dispatched as a raw `{ type, payload }` object from a component, and picked up by `takeLatest(STRING_CONSTANT, worker)`:

```typescript
// Component side (e.g. src/features/auth/pages/Login.tsx)
dispatch({ type: USER_LOGIN_API, payload: data });

// src/features/auth/redux/UserSaga.ts
export function* loginSaga(action: PayloadAction<UserLogin>) {
  try {
    const response = yield call(AuthServices.login, action.payload);
    if (response.status === 200) {
      yield put(UserSagaAction.setUserInfo(response.data.content));
      toast.success(i18n.t("auth:loginSuccess"));
      history.push(APP_ROUTES.HOME);
    }
  } catch (error) {
    toast.error(i18n.t("auth:loginFailed"));
  }
}

export function* actionLoginSaga() {
  yield takeLatest(USER_LOGIN_API, loginSaga);
}
```
So the real pattern is a **hybrid**: modern `createSlice` for the state shape and success-path reducers, but classic string-constant + raw-dispatch + `takeLatest` for triggering the saga worker in the first place — nobody's dispatching a slice-generated action to *start* a saga flow, only to record its *result*.

### The real, live saga flows in this app

Two feature areas genuinely need saga's side-effect machinery, and both are still fully wired and actually used:

- **Auth** (`features/auth/redux/UserSaga.ts`) — login/register need to: call the API, on success set cookies (`settings.setCookieJson`/`setCookie` — the project migrated off `localStorage` to cookies for auth storage), show a toast, and navigate (`history.push`). None of that is a simple "fetch and cache" read — it's a genuine multi-step flow with real side effects, which is exactly saga's sweet spot.
- **Booking** (`features/booking/redux/Booking.saga.ts`) — two watchers: `getTicketApi` (fetch the seat map for a showtime) and `bookTicketSaga` (submit selected seats). The submit flow, on success, shows a toast, clears the local selection, **and re-dispatches `GET_TICKET_API` to refetch the now-updated seat-occupancy state** — a hand-implemented "refetch after mutate" pattern. (This is precisely the kind of thing RTK Query's `invalidatesTags` automates for you — its presence here, done by hand, is a good real-world illustration of *why* that RTK Query feature exists.)

### A real quirk worth knowing about, not fixing silently

The `setUserInfo` reducer itself calls `history.push(APP_ROUTES.HOME)` as a side effect *inside a slice reducer* — which is already unusual (reducers are conventionally pure), and both `loginSaga` and `registerSaga` reuse this same reducer, then `registerSaga` immediately calls `history.push(APP_ROUTES.LOGIN)` right after. Net effect: on successful registration, the browser briefly navigates to `/` (from inside the reducer) and then immediately to `/login` (from the saga) in the same tick. This is exactly the kind of subtle, easy-to-miss bug that a straight code read reveals but that "the tests pass" won't catch — flagged here rather than fixed silently, since navigation-inside-a-reducer is itself worth a design conversation, not just a one-line patch.

## Part 3: RTK Query — declarative server-state caching

RTK Query (`@reduxjs/toolkit/query/react`) generates a reducer, middleware, and typed React hooks from a single `createApi` declaration — no manual loading/error state, no manual cache invalidation wiring, no manual re-fetch-on-mount logic. Two independent API slices exist in this codebase, and they're built differently on purpose:

### `tmdbApi.ts` — the "textbook" RTK Query case

```typescript
export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: tmdbBaseUrl, // normalized from API_CONFIG, trailing-slash-checked
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${API_CONFIG.TMDB_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<TMDBMovie[], string | void>({
      query: (lang) => `/trending/movie/day?language=${getTMDBLanguageCode(lang)}`,
      transformResponse: (response: TMDBResponse) => response.results || [],
    }),
    getPopularMovies: builder.query /* ...same shape... */,
    getTopRatedMovies: builder.query /* ...same shape... */,
    getUpcomingMovies: builder.query /* ...same shape... */,
  }),
});
export const { useGetTrendingMoviesQuery, useGetPopularMoviesQuery, useGetTopRatedMoviesQuery, useGetUpcomingMoviesQuery } = tmdbApi;
```
`fetchBaseQuery` (a thin `fetch` wrapper) is the standard choice for a genuinely external, read-only REST API with no existing client-side auth/interceptor infrastructure to reuse. `transformResponse` unwraps TMDB's `{results: [...]}` envelope so every consuming hook gets a plain `TMDBMovie[]` directly.

### `movieApi.ts` — RTK Query wrapping the *internal* Cybersoft API, via a custom `axiosBaseQuery`

```typescript
const axiosBaseQuery = () => async ({ url, method, data, params, headers }) => {
  try {
    const result = await http({ url, method: method || "GET", data, params, headers });
    return { data: result.data.content };
  } catch (axiosError) {
    return { error: { status: axiosError.response?.status, data: axiosError.response?.data || axiosError.message } };
  }
};

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Banners", "Films", "FilmDetail", "Cinemas", "Showtimes", "UserProfile", "UserList", "UserTypes"],
  endpoints: (builder) => ({
    getBanners: builder.query({ query: () => ({ url: "/QuanLyPhim/LayDanhSachBanner", method: "GET" }) }),
    getFilmList: builder.query({ query: () => ({ url: "/QuanLyPhim/LayDanhSachPhim", method: "GET" }) }),
    getCinemas: builder.query({ query: () => ({ url: "/QuanLyRap/LayThongTinLichChieuHeThongRap", method: "GET" }) }),
    // + getFilmDetail, getTicketBookingDetail, getProfile, updateProfile, getUserTypes, getUserList, deleteUser
  }),
});
export const { useGetBannersQuery, useGetFilmListQuery, useGetCinemasQuery /* ...+7 more... */ } = movieApi;
```
This is a genuinely useful pattern worth understanding on its own: **RTK Query doesn't require `fetch`.** `baseQuery` is a pluggable function — here it wraps the *same* shared `axios` instance (`http`, with its existing interceptors/base URL config) that the rest of the app already uses, so the internal API gets RTK Query's caching/loading-state ergonomics without needing a second, parallel HTTP client.

Ten endpoints are defined; only three are actually consumed by the live UI today (`useGetBannersQuery` in `CarouselHome.tsx`/`AuthShowcase.tsx`, `useGetFilmListQuery` in `Film.tsx`, `useGetCinemasQuery` in `ListCinema.tsx`). The other seven (`getFilmDetail`, `getTicketBookingDetail`, `getProfile`, `updateProfile`, `getUserTypes`, `getUserList`, `deleteUser`) have zero call sites anywhere else in the app — they read as forward-looking scaffolding for an admin/profile surface that doesn't exist in the UI yet, not dead code left over from something removed.

## Part 4: The real dividing line — and the honest state of an in-progress migration

The clean story you'd want to tell is: *"Redux-Saga for internal API + complex side effects; RTK Query for simple external reads."* **That story is only fully true for TMDB.** Tracing actual dispatch/selector wiring across the whole app reveals the Cybersoft-API side is **mid-migration**, not settled:

- **Dead saga pipelines**, still registered in `store.ts` and still forked in `rootSaga.ts`, but never dispatched by any component and never read by any `useSelector` anywhere in the app: the `Banner`, `FlimList`, and `ListCinema` slices, and the `Loading` slice that only those dead sagas ever wrote to. The home page's real banner/film-list/cinema-list UI is wired to `movieApi`'s RTK Query hooks instead, hitting the *same* Cybersoft endpoints the dead sagas would have hit.
- **A third pattern that's neither saga nor RTK Query**: `features/film-detail/pages/Detail.tsx` fetches its film-detail and showtime data via plain class-instance services called directly inside a component-local `useEffect`/`useState` — no Redux involvement at all.
- **Live saga pipelines**: auth (login/register) and booking (get seat map / submit booking) — both genuinely need saga's side-effect ergonomics (cookies, navigation, toasts, refetch-after-mutate) and are not candidates for a simple RTK Query swap without re-implementing those side effects some other way.

**The most accurate framing for training purposes**: this is a partially-completed migration toward "RTK Query for reads, Redux-Saga for mutations-with-side-effects," not a finished, deliberate architecture. The end-state boundary is real and defensible (and TMDB already fully embodies it) — but the repo currently contains a live implementation of that end state (`movieApi`) coexisting with un-deleted saga leftovers that no longer do anything, plus one more one-off pattern (`Detail.tsx`'s local state) that fits neither bucket. If you're extending this codebase: prefer `movieApi`/RTK Query for any new *read*, prefer saga for anything needing cookies/navigation/toast-on-completion/refetch-on-mutate, and treat the `Banner`/`FlimList`/`ListCinema`/`Loading` slices as candidates for deletion rather than a pattern to imitate.

## Booking feature: the one place with genuinely new business logic

`features/booking` is a fully built seat-selection-and-checkout flow, not a stub — worth calling out since an earlier planning document ([`docs/refactor/implementation-plan.md`](../refactor/implementation-plan.md)) flagged this page as needing real new work, and the shipped result went further than that plan's own hedge (it even wired the real submit-booking endpoint, not just a disabled placeholder button):

```typescript
// features/booking/redux/BookingTicket.reducer.ts
export type BookingState = {
  bookingDetail: BookingTicket | Record<string, never>;
  selectedSeats: DanhSachGhe[];
  isBooking: boolean;
};
```
Reducers: `getDetailBookingTicket`, `removeDetailBookingTicket`, `toggleSelectSeat` (a real toggle — pushes or splices by seat ID), `clearSelectedSeats`, `setBookingLoading`. Total price is **not** stored in Redux — it's derived on every render in the component (`selectedSeats.reduce((sum, seat) => sum + (seat.giaVe || 0), 0)`), which is the right call for a value that's always trivially computable from state already held elsewhere (storing it separately would just be a second source of truth to keep in sync).
