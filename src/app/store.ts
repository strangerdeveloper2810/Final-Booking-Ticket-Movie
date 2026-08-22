import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./rootSaga";
import BannerReducerSaga from "features/home/redux/banner/BannerSaga.reducer";
import FilmListSagaReducer from "features/home/redux/filmList/FilmListSaga.reducer";
import ListCinemaSagaReducer from "features/home/redux/cinema/ListCinemaSaga.reducer";
import UserSagaReducer from "features/auth/redux/UserSaga.reducer";
import BookingTicketReducer from "features/booking/redux/BookingTicket.reducer";
import LoadingReducer from "shared/redux/loading/Loading.reducer";
import { movieApi } from "shared/services/movieApi";
import { tmdbApi } from "shared/services/tmdbApi";

// EN: `app/store.ts` is a "composition root", like `app/routes.tsx` and
// `app/rootSaga.ts`: it is the one place allowed to import reducers from
// every feature plus both RTK Query API slices, so the whole app can be
// wired into a single store. Feature files never do this (no
// feature-to-feature or feature-to-`app/` imports) — only this file does.
// VI: `app/store.ts` là một "composition root", giống `app/routes.tsx` và
// `app/rootSaga.ts`: đây là nơi duy nhất được phép import reducer từ mọi
// feature cùng cả hai API slice của RTK Query, để toàn bộ ứng dụng được ráp
// vào một store duy nhất. File feature không bao giờ làm vậy (không import
// feature-tới-feature hay feature-tới-`app/`) — chỉ file này mới được phép.
const sagaMiddleware = createSagaMiddleware();

// EN: HONEST ARCHITECTURE NOTE — `Banner`, `FlimList`, and `ListCinema` are
// the original Redux-Saga-driven slices for banners/films/cinemas. As of
// this audit (grepped the whole repo for `state.Banner`, `state.FlimList`,
// `state.ListCinema`, and any `useSelector` call under `features/home`),
// NOTHING reads their state — no component selects from them. The actual
// banner/film/cinema data shown on the home page today comes from
// `movieApi`'s RTK Query hooks (`useGetBannersQuery`, `useGetFilmListQuery`,
// `useGetCinemasQuery`) instead. These three saga slices (and the sagas in
// `rootSaga.ts` that populate them: `banner`/`film`/`cinema`) are effectively
// dead/legacy code left over from an earlier architecture — kept registered
// here rather than presented as "actively used" just because they're wired
// into the store. `UserSaga` and `Booking` (bookings/seat-hold flow) ARE
// still real, actively-read saga slices — this note applies only to the
// three home-feature ones above.
// VI: GHI CHÚ KIẾN TRÚC TRUNG THỰC — `Banner`, `FlimList`, `ListCinema` là
// các slice gốc dùng Redux-Saga cho banner/phim/rạp. Tính đến lần rà soát
// này (đã grep toàn bộ repo tìm `state.Banner`, `state.FlimList`,
// `state.ListCinema`, và mọi `useSelector` trong `features/home`), KHÔNG có
// nơi nào đọc state của chúng — không component nào select dữ liệu từ đó.
// Dữ liệu banner/phim/rạp hiển thị thực tế trên trang chủ hiện nay đến từ các
// hook RTK Query của `movieApi` (`useGetBannersQuery`, `useGetFilmListQuery`,
// `useGetCinemasQuery`). Ba slice saga này (và các saga trong `rootSaga.ts`
// nạp dữ liệu cho chúng: `banner`/`film`/`cinema`) thực chất là code
// cũ/không còn dùng còn sót lại từ kiến trúc trước — vẫn đăng ký ở đây chứ
// không nên trình bày như thể "đang được dùng thực sự" chỉ vì chúng có mặt
// trong store. `UserSaga` và `Booking` (luồng đặt vé/giữ ghế) VẪN là các
// slice saga đang thực sự được đọc — ghi chú này chỉ áp dụng cho ba slice
// thuộc home feature nêu trên.
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
  // EN: No explicit `serializableCheck`/`immutableCheck` overrides are
  // passed to `getDefaultMiddleware()` — this works (rather than merely
  // "not yet tuned") because none of the Redux-Saga action creators in this
  // app ever put non-serializable values (functions, class instances,
  // Promises, etc.) into an action payload or into state; RTK Query's own
  // actions are also serializable. If a future saga/action starts carrying
  // non-serializable data, these default checks will start failing loudly
  // in development — that's a signal to fix the action shape, not to
  // silence the check.
  // VI: Không truyền override `serializableCheck`/`immutableCheck` nào cho
  // `getDefaultMiddleware()` — điều này chạy được (chứ không phải "chưa kịp
  // cấu hình") vì không có action creator Redux-Saga nào trong ứng dụng này
  // đưa giá trị không serialize được (hàm, instance class, Promise, v.v.)
  // vào payload action hay vào state; action của RTK Query cũng vốn đã
  // serialize được. Nếu sau này có saga/action nào mang dữ liệu không
  // serialize được, các kiểm tra mặc định này sẽ báo lỗi rõ ràng khi chạy ở
  // môi trường development — đó là tín hiệu để sửa lại cấu trúc action, chứ
  // không phải để tắt kiểm tra đi.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      sagaMiddleware,
      movieApi.middleware,
      tmdbApi.middleware
    ),
});

sagaMiddleware.run(rootSaga);

/**
 * EN: The root state shape, inferred directly from the store so it always
 * stays in sync with the `reducer` map above — use this instead of
 * hand-writing a state interface that could drift out of date.
 * VI: Cấu trúc root state, được suy ra trực tiếp từ store để luôn đồng bộ
 * với danh sách `reducer` ở trên — dùng type này thay vì tự viết tay một
 * interface state có thể bị lệch theo thời gian.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * EN: The store's dispatch type, including thunk/saga-aware overloads —
 * use this to type `useDispatch<AppDispatch>()` in components.
 * VI: Kiểu dispatch của store, bao gồm cả các overload nhận biết
 * thunk/saga — dùng để định kiểu cho `useDispatch<AppDispatch>()` trong
 * component.
 */
export type AppDispatch = typeof store.dispatch;
