# 04. Redux Saga & RTK Query Dual State Architecture

## 🧠 Lý Thuyết (Theoretical Background)

Trong quản lý trạng thái (State Management) của ứng dụng React quy mô vừa và lớn, dữ liệu thường chia làm 2 loại:
1. **Complex Business Logic & Global App State (Redux Saga):** Các luồng nghiệp vụ phức tạp có nhiều tác dụng phụ (side-effects), gọi nhiều API nối tiếp nhau, quản lý phiên đăng nhập (Authentication Token, User State) và Banners.
2. **Declarative REST Data Fetching & Caching (RTK Query):** Truy vấn danh mục phim từ các dịch vụ bên thứ ba như The Movie Database (TMDB). RTK Query cung cấp cơ chế tự động cache, polling, invalidation và quản lý loading state (`isLoading`, `isError`) tự động.

Dự án kết hợp 2 giải pháp này để tận dụng điểm mạnh tốt nhất của cả hai công nghệ.

---

## 🎯 Lý Do Áp Dụng (Engineering Rationale)

- **Redux Saga:** Xử lý luồng Đăng nhập / Đăng ký người dùng và quản lý Token an toàn, dễ kiểm thử bằng Generator Functions (`call`, `put`, `takeLatest`).
- **RTK Query:** Giúp viết ít code boilerplate hơn khi tương tác với TMDB API (`getTrendingMovies`, `getPopularMovies`, `getTopRatedMovies`, `getUpcomingMovies`).

---

## 💻 Mã Nguồn Cấu Hình (Full Code Implementation)

### 1. RTK Query TMDB Service ([`src/shared/services/tmdbApi.ts`](file:///Users/mdm/Desktop/Final-Booking-Ticket-Movie/src/shared/services/tmdbApi.ts))

```typescript
// src/shared/services/tmdbApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_TMDB_DOMAIN || "https://api.themoviedb.org/3",
    prepareHeaders: (headers) => {
      const token = process.env.REACT_APP_TMDB_TOKEN;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<TMDBResponse<TMDBMovie>, string | void>({
      query: (lang) => `/trending/movie/day?language=${lang === "vi" ? "vi-VN" : "en-US"}`,
    }),
    getPopularMovies: builder.query<TMDBResponse<TMDBMovie>, string | void>({
      query: (lang) => `/movie/popular?language=${lang === "vi" ? "vi-VN" : "en-US"}&page=1`,
    }),
  }),
});

export const { useGetTrendingMoviesQuery, useGetPopularMoviesQuery } = tmdbApi;
```

### 2. Redux Saga User Auth Handler ([`src/features/auth/redux/UserSaga.ts`](file:///Users/mdm/Desktop/Final-Booking-Ticket-Movie/src/features/auth/redux/UserSaga.ts))

```typescript
// src/features/auth/redux/UserSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import authServiceInstance from "../services/AuthService";
import { userActions } from "./UserSlice";
import { LoginPayload } from "./types/UserType";

function* handleLogin(action: PayloadAction<LoginPayload>) {
  try {
    const response = yield call(authServiceInstance.login, action.payload);
    if (response.status === 200) {
      localStorage.setItem("USER_LOGIN", JSON.stringify(response.data.content));
      yield put(userActions.loginSuccess(response.data.content));
    }
  } catch (error: any) {
    yield put(userActions.loginFailed(error.message));
  }
}

export default function* userSaga() {
  yield takeLatest(userActions.login.type, handleLogin);
}
```
