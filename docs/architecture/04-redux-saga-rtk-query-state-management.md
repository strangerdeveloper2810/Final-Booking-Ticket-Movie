# 04. Quản lý trạng thái (State Management): Redux Toolkit, Redux-Saga & RTK Query

Đây là một kiến trúc quản lý trạng thái lai (hybrid): **Redux Toolkit** cung cấp cơ chế store/slice, **Redux-Saga** xử lý các luồng bất đồng bộ (async) phức tạp có side effect, còn **RTK Query** xử lý các thao tác đọc dữ liệu từ server đơn giản, thân thiện với cache. Cả ba cùng tồn tại trong cùng một store. Tài liệu này giải thích từng công nghệ riêng lẻ, sau đó — quan trọng hơn — ghi lại ranh giới *thực tế*, đã được xác minh giữa chúng trong codebase cụ thể này, và hóa ra ranh giới đó lộn xộn và thú vị hơn nhiều so với câu chuyện lý tưởng hóa "API cũ so với API mới".

## Phần 1: Redux Toolkit (`createSlice`) — tầng trạng thái (state layer)

Mọi tệp "reducer" trong codebase này, bất kể tên tệp là gì (`BannerSaga.reducer.ts`, `UserSaga.reducer.ts`, `Loading.reducer.ts`, v.v.), đều là một lệnh gọi `createSlice` thực sự của RTK. Không có **bất kỳ** đoạn mã reducer kiểu switch-statement viết tay kiểu cũ nào tồn tại ở bất cứ đâu. Dưới đây là một ví dụ tiêu biểu, đầy đủ:

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
`createSlice` cung cấp cú pháp "mutate trực tiếp draft state" được hỗ trợ bởi Immer (`state.arrBanner = action.payload` trông giống như một phép mutate nhưng thực chất được chuyển đổi an toàn thành một cập nhật bất biến (immutable) ở bên dưới), cùng với các action creator được tự động sinh ra (`BannerSagaAction.getAllBanner(...)`) và một chuỗi action-type tương ứng (`"Banner/getAllBanner"`), tất cả chỉ từ một khai báo duy nhất — đây chính là giá trị thực sự của "toolkit" so với việc tự viết tay các reducer kiểu `switch (action.type) { case ... }` và các hàm action-creator riêng biệt.

### `src/app/store.ts` — mọi thứ được kết nối với nhau như thế nào

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
Tổng cộng có tám key reducer — sáu slice được đăng ký thủ công cộng với hai reducer path được RTK Query tự động sinh ra (`movieApi`/`tmdbApi`, được thêm vào thông qua cú pháp computed-property lấy từ `reducerPath` riêng của mỗi API). Một lệnh gọi `.concat()` duy nhất nối thêm cả ba middleware không mặc định (saga cùng cả hai API của RTK Query) trong một lần. Lưu ý `getDefaultMiddleware()` được gọi mà không có tùy chọn nào — các kiểm tra serializable-state/action mặc định của RTK vẫn được giữ nguyên hoạt động đầy đủ, điều này chỉ an toàn ở đây vì không có saga nào từng `put()` một giá trị không thể serialize (generator object, class instance, Promise) vào store; mọi action được dispatch đều mang theo một payload dạng plain object.

### `src/app/rootSaga.ts` — đăng ký watcher của từng feature

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
`all([...])` chạy đồng thời mọi generator được liệt kê, mãi mãi (mỗi generator là một watcher dựa trên `takeLatest` chỉ đơn giản chờ action type của nó). Đây là nơi duy nhất trong toàn bộ ứng dụng biết về saga module của từng feature — xem [tài liệu 06](./06-feature-based-architecture-and-index-barrels.md) để hiểu tại sao mẫu composition-root này lại quan trọng.

## Phần 2: Redux-Saga — điều phối side effect

Redux-Saga sử dụng các generator function và các "effect" khai báo (`call`, `put`, `takeLatest`, `all`, `delay`) để mô tả các luồng bất đồng bộ theo cách có thể kiểm thử (testable) mà không cần mock timer hay promise — bạn có thể bước qua từng bước của một generator trong unit test và assert trên các mô tả effect dạng plain object mà nó yield ra, mà không có gì thực sự được thực thi.

**Cơ chế kích hoạt (trigger) trong codebase này mang tính cổ điển, kiểu Redux tiền-RTK**, không phải `createAsyncThunk`: mọi action kích hoạt side effect đều là một hằng số chuỗi (string constant) thuần túy, được dispatch dưới dạng một object `{ type, payload }` thô từ component, và được `takeLatest(STRING_CONSTANT, worker)` bắt lấy:

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
Vì vậy mẫu thực tế là một **hình thức lai (hybrid)**: `createSlice` hiện đại cho hình dạng state và các reducer xử lý success-path, nhưng lại dùng string-constant cổ điển + raw-dispatch + `takeLatest` để kích hoạt saga worker ngay từ đầu — không ai dispatch một action do slice sinh ra để *bắt đầu* một luồng saga, mà chỉ để ghi lại *kết quả* của nó.

### Các luồng saga thực sự, đang hoạt động trong ứng dụng này

Có hai khu vực tính năng thực sự cần đến cơ chế side-effect của saga, và cả hai vẫn được kết nối đầy đủ và đang thực sự được sử dụng:

- **Auth** (`features/auth/redux/UserSaga.ts`) — login/register cần phải: gọi API, khi thành công thì set cookie (`settings.setCookieJson`/`setCookie` — dự án đã di chuyển từ `localStorage` sang cookie để lưu trữ thông tin xác thực), hiển thị toast, và điều hướng (`history.push`). Không có điều nào trong số đó là một thao tác đọc "fetch and cache" đơn giản — đó là một luồng nhiều bước thực sự với các side effect thật sự, chính xác là điểm mạnh sở trường (sweet spot) của saga.
- **Booking** (`features/booking/redux/Booking.saga.ts`) — hai watcher: `getTicketApi` (lấy sơ đồ ghế cho một suất chiếu) và `bookTicketSaga` (gửi các ghế đã chọn). Luồng submit, khi thành công, hiển thị toast, xóa lựa chọn cục bộ, **và dispatch lại `GET_TICKET_API` để refetch trạng thái occupancy (tình trạng ghế đã đặt) vừa được cập nhật** — một mẫu "refetch sau khi mutate" được cài đặt thủ công. (Đây chính xác là kiểu việc mà `invalidatesTags` của RTK Query tự động hóa cho bạn — sự hiện diện của nó ở đây, được làm thủ công, là một minh họa thực tế tốt cho lý do *tại sao* tính năng đó của RTK Query tồn tại.)

### Một điểm kỳ quặc thực sự đáng biết đến, không nên âm thầm sửa

Bản thân reducer `setUserInfo` gọi `history.push(APP_ROUTES.HOME)` như một side effect *bên trong một slice reducer* — điều này vốn đã bất thường (theo quy ước, reducer phải thuần khiết/pure), và cả `loginSaga` lẫn `registerSaga` đều tái sử dụng cùng reducer này, sau đó `registerSaga` lập tức gọi `history.push(APP_ROUTES.LOGIN)` ngay sau đó. Kết quả cuối cùng: khi đăng ký thành công, trình duyệt sẽ điều hướng trong chốc lát đến `/` (từ bên trong reducer) rồi ngay lập tức đến `/login` (từ saga) trong cùng một tick. Đây chính xác là kiểu lỗi tinh vi, dễ bị bỏ sót mà việc đọc thẳng mã nguồn sẽ phát hiện ra nhưng việc "test pass" sẽ không bắt được — được nêu ra ở đây thay vì âm thầm sửa, vì bản thân việc điều hướng bên trong một reducer đã đáng để có một cuộc trao đổi về thiết kế, chứ không chỉ là một bản vá một dòng.

## Phần 3: RTK Query — caching trạng thái server theo kiểu khai báo

RTK Query (`@reduxjs/toolkit/query/react`) sinh ra một reducer, middleware, và các React hook có kiểu (typed) từ một khai báo `createApi` duy nhất — không cần tự quản lý loading/error state, không cần tự nối dây cache invalidation, không cần tự viết logic re-fetch-on-mount. Có hai API slice độc lập tồn tại trong codebase này, và chúng được xây dựng khác nhau một cách có chủ đích:

### `tmdbApi.ts` — trường hợp RTK Query "kiểu sách giáo khoa"

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
`fetchBaseQuery` (một lớp bọc mỏng quanh `fetch`) là lựa chọn tiêu chuẩn cho một REST API thực sự bên ngoài (external), chỉ đọc (read-only), không có sẵn hạ tầng auth/interceptor phía client nào để tái sử dụng. `transformResponse` bóc lớp bọc `{results: [...]}` của TMDB để mỗi hook sử dụng nhận trực tiếp một `TMDBMovie[]` thuần túy.

### `movieApi.ts` — RTK Query bọc API *nội bộ* của Cybersoft, thông qua một `axiosBaseQuery` tùy chỉnh

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
Đây là một mẫu thực sự hữu ích, đáng để hiểu riêng: **RTK Query không bắt buộc phải dùng `fetch`.** `baseQuery` là một hàm có thể cắm thay thế (pluggable) — ở đây nó bọc *cùng* một instance `axios` dùng chung (`http`, với các interceptor/cấu hình base URL sẵn có) mà phần còn lại của ứng dụng đã đang sử dụng, nhờ đó API nội bộ có được sự tiện lợi về caching/loading-state của RTK Query mà không cần một HTTP client song song thứ hai.

Có mười endpoint được định nghĩa; chỉ ba trong số đó thực sự được sử dụng bởi UI đang chạy hiện nay (`useGetBannersQuery` trong `CarouselHome.tsx`/`AuthShowcase.tsx`, `useGetFilmListQuery` trong `Film.tsx`, `useGetCinemasQuery` trong `ListCinema.tsx`). Bảy endpoint còn lại (`getFilmDetail`, `getTicketBookingDetail`, `getProfile`, `updateProfile`, `getUserTypes`, `getUserList`, `deleteUser`) không có bất kỳ điểm gọi (call site) nào khác trong toàn bộ ứng dụng — chúng đọc giống như phần khung dựng sẵn (scaffolding) mang tính đón đầu cho một bề mặt admin/profile chưa tồn tại trong UI, chứ không phải mã chết (dead code) còn sót lại từ thứ gì đó đã bị gỡ bỏ.

## Phần 4: Ranh giới thực sự — và tình trạng thực tế của một cuộc di trú (migration) đang dang dở

Câu chuyện gọn gàng mà bạn muốn kể là: *"Redux-Saga cho API nội bộ + các side effect phức tạp; RTK Query cho các thao tác đọc đơn giản từ bên ngoài."* **Câu chuyện đó chỉ hoàn toàn đúng với TMDB.** Việc truy vết cách nối dây dispatch/selector thực tế trên toàn bộ ứng dụng cho thấy phía API Cybersoft đang **di trú dở dang**, chưa ổn định:

- **Các pipeline saga đã chết (dead)**, vẫn được đăng ký trong `store.ts` và vẫn được fork trong `rootSaga.ts`, nhưng chưa bao giờ được component nào dispatch và chưa bao giờ được `useSelector` nào đọc ở bất cứ đâu trong ứng dụng: các slice `Banner`, `FlimList`, và `ListCinema`, cùng slice `Loading` mà chỉ những saga đã chết đó từng ghi vào. UI banner/danh-sách-phim/danh-sách-rạp thực tế trên trang chủ lại được nối với các hook RTK Query của `movieApi` thay vào đó, gọi đến *cùng* các endpoint Cybersoft mà các saga đã chết lẽ ra sẽ gọi tới.
- **Một mẫu thứ ba không phải saga cũng không phải RTK Query**: `features/film-detail/pages/Detail.tsx` lấy dữ liệu chi tiết phim và suất chiếu thông qua các service dạng class-instance thuần túy được gọi trực tiếp bên trong `useEffect`/`useState` cục bộ của component — hoàn toàn không có sự tham gia của Redux.
- **Các pipeline saga đang hoạt động**: auth (login/register) và booking (lấy sơ đồ ghế / gửi đặt vé) — cả hai đều thực sự cần đến sự tiện lợi về side-effect của saga (cookie, điều hướng, toast, refetch-after-mutate) và không phải là ứng viên để chuyển đổi đơn giản sang RTK Query nếu không triển khai lại các side effect đó theo cách khác.

**Cách diễn giải chính xác nhất cho mục đích huấn luyện (training)**: đây là một cuộc di trú hoàn thành một phần theo hướng "RTK Query cho các thao tác đọc, Redux-Saga cho các mutation có side effect," chứ không phải một kiến trúc đã hoàn chỉnh, có chủ đích. Ranh giới trạng thái cuối (end-state) là có thật và hợp lý (và TMDB đã hoàn toàn thể hiện điều đó) — nhưng repo hiện tại chứa một triển khai đang sống của trạng thái cuối đó (`movieApi`) cùng tồn tại với những tàn dư saga chưa bị xóa không còn làm gì cả, cộng thêm một mẫu đơn lẻ khác (`Detail.tsx`'s local state) mà mẫu này không thuộc về nhóm nào cả. Nếu bạn đang mở rộng codebase này: hãy ưu tiên `movieApi`/RTK Query cho bất kỳ thao tác *đọc* mới nào, ưu tiên saga cho bất cứ điều gì cần đến cookie/điều hướng/toast-khi-hoàn-tất/refetch-on-mutate, và xem các slice `Banner`/`FlimList`/`ListCinema`/`Loading` là ứng viên để xóa bỏ chứ không phải một mẫu để noi theo.

## Tính năng Booking: nơi duy nhất có logic nghiệp vụ thực sự mới

`features/booking` là một luồng chọn-ghế-và-thanh-toán được xây dựng đầy đủ, không phải một bản stub — đáng được nêu ra vì một tài liệu lập kế hoạch trước đó ([`docs/refactor/implementation-plan.md`](../refactor/implementation-plan.md)) đã đánh dấu trang này là cần công việc mới thực sự, và kết quả được triển khai còn vượt xa cả dự phòng (hedge) của chính kế hoạch đó (nó thậm chí còn nối dây endpoint submit-booking thực sự, chứ không chỉ là một nút placeholder bị vô hiệu hóa):

```typescript
// features/booking/redux/BookingTicket.reducer.ts
export type BookingState = {
  bookingDetail: BookingTicket | Record<string, never>;
  selectedSeats: DanhSachGhe[];
  isBooking: boolean;
};
```
Các reducer: `getDetailBookingTicket`, `removeDetailBookingTicket`, `toggleSelectSeat` (một toggle thực sự — push hoặc splice theo seat ID), `clearSelectedSeats`, `setBookingLoading`. Tổng giá tiền **không** được lưu trong Redux — nó được tính lại (derive) trên mỗi lần render trong component (`selectedSeats.reduce((sum, seat) => sum + (seat.giaVe || 0), 0)`), đây là quyết định đúng đắn cho một giá trị luôn có thể tính toán một cách tầm thường từ state đã được lưu giữ ở nơi khác (lưu nó riêng biệt sẽ chỉ tạo ra một nguồn sự thật thứ hai (second source of truth) cần phải đồng bộ).
