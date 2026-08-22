import axios from "axios";
import { API_CONFIG, STORAGE_KEYS, HTTP_STATUS } from "shared/constants/appConstants";
import { APP_ROUTES } from "shared/constants/routes";
import { navigateTo } from "./navigation";

// EN: Cybersoft's Swagger docs sometimes list the domain with a trailing
// "/api" and sometimes without — normalize here once so every caller of
// `http` can assume `DOMAIN` always ends in "/api".
// VI: Tài liệu Swagger của Cybersoft đôi khi ghi domain có hậu tố "/api",
// đôi khi không — chuẩn hóa một lần ở đây để mọi nơi dùng `http` đều có thể
// giả định `DOMAIN` luôn kết thúc bằng "/api".
export const DOMAIN: string = API_CONFIG.DOMAIN.endsWith("/api")
  ? API_CONFIG.DOMAIN
  : `${API_CONFIG.DOMAIN}/api`;
export const TokenCybersoft: string = API_CONFIG.TOKEN_CYBERSOFT;
export const ACCESS_TOKEN: string = STORAGE_KEYS.ACCESS_TOKEN;
export const USER_LOGIN: string = STORAGE_KEYS.USER_LOGIN;
export const GROUP_ID: string = API_CONFIG.GROUP_ID;

/**
 * EN: Small cookie helpers used to persist the access token and logged-in
 * user info across page reloads (this app does not use localStorage for
 * auth state). JSON variants JSON.stringify/parse + URI-encode the value so
 * objects can round-trip safely through a cookie string.
 * VI: Các hàm tiện ích thao tác cookie, dùng để lưu access token và thông
 * tin người dùng đã đăng nhập qua các lần tải lại trang (ứng dụng này không
 * dùng localStorage cho trạng thái xác thực). Các biến thể JSON sẽ
 * JSON.stringify/parse + mã hóa URI giá trị để object có thể lưu/đọc an
 * toàn qua chuỗi cookie.
 */
export const settings = {
  setCookie: (name: string, value: string, days: number = 30): void => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
  },

  // EN: Deliberately left as a manual loop rather than swapped to lodash's
  // `find` — the loop both trims leading spaces AND slices out the matched
  // cookie's value in one pass; splitting that into map+find+substring would
  // change the trimming implementation (character-by-character space strip
  // vs a regex trim) and risks a subtle behavior difference, so it's kept
  // as-is per the "preserve behavior exactly" rule for this pass.
  // VI: Cố tình giữ nguyên vòng lặp thủ công thay vì đổi sang `find` của
  // lodash — vòng lặp này vừa cắt khoảng trắng đầu chuỗi vừa lấy ra giá trị
  // cookie khớp trong cùng một lượt; nếu tách thành map+find+substring sẽ
  // đổi cách cắt khoảng trắng (cắt từng ký tự vs dùng regex trim) và có thể
  // gây khác biệt hành vi nhỏ, nên giữ nguyên theo nguyên tắc "giữ đúng hành
  // vi" của đợt refactor này.
  getCookie: (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  setCookieJson: (name: string, value: any, days: number = 30): void => {
    try {
      const jsonString = JSON.stringify(value);
      settings.setCookie(name, encodeURIComponent(jsonString), days);
    } catch (error) {
      console.error("Error setting cookie JSON:", error);
    }
  },

  getCookieJson: (name: string): any => {
    try {
      const cookieValue = settings.getCookie(name);
      if (cookieValue) {
        return JSON.parse(decodeURIComponent(cookieValue));
      }
    } catch (error) {
      console.error("Error getting cookie JSON:", error);
    }
    return null;
  },

  eraseCookie: (name: string): void => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  },
};

/**
 * EN: Shared axios instance for every call to the Cybersoft movie-booking
 * API. All Redux-Saga services (`*.services.ts`) AND `movieApi.ts`'s RTK
 * Query `axiosBaseQuery` funnel through this single instance, so the auth
 * interceptor below applies uniformly regardless of which data-fetching
 * layer initiated the request.
 * VI: Instance axios dùng chung cho mọi lời gọi tới API đặt vé phim của
 * Cybersoft. Tất cả service của Redux-Saga (`*.services.ts`) VÀ
 * `axiosBaseQuery` của `movieApi.ts` (RTK Query) đều đi qua instance duy
 * nhất này, nên interceptor xác thực bên dưới áp dụng đồng nhất bất kể lớp
 * fetch dữ liệu nào khởi tạo request.
 */
export const http = axios.create({
  baseURL: DOMAIN,
  timeout: 20000,
});

// EN: IMPORTANT — this interceptor unconditionally attaches `TokenCybersoft`
// and `Authorization` to every single request made through `http`, including
// public/no-auth endpoints (e.g. LayDanhSachBanner, LayDanhSachPhim). There
// is no per-request opt-out here: if a caller doesn't have an access-token
// cookie yet, `Authorization` is simply sent as an empty-bearer string
// rather than omitted. This is a blunt but simple approach — fine for this
// app since the backend tolerates the extra header, but worth knowing before
// assuming any endpoint hit through `http` is unauthenticated.
// VI: QUAN TRỌNG — interceptor này gắn `TokenCybersoft` và `Authorization`
// vào MỌI request đi qua `http`, kể cả các endpoint công khai/không cần đăng
// nhập (vd. LayDanhSachBanner, LayDanhSachPhim). Không có cơ chế "bỏ qua"
// theo từng request: nếu chưa có cookie access-token, `Authorization` vẫn
// được gửi dưới dạng chuỗi bearer rỗng thay vì bị lược bỏ. Đây là cách làm
// đơn giản nhưng "thô" — chấp nhận được vì backend không phản đối header
// thừa, nhưng cần biết trước khi cho rằng một endpoint gọi qua `http` là
// không cần xác thực.
http.interceptors.request.use(
  (config: any) => {
    const token = settings.getCookie(ACCESS_TOKEN);
    config.headers = {
      ...config.headers,
      TokenCybersoft: TokenCybersoft,
      Authorization: token ? `Bearer ${token}` : "",
    };
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// EN: Global 401/403 handling — any response with an unauthorized/forbidden
// status clears the auth cookies and hard-redirects to `/login`, regardless
// of which screen triggered the request. This is a blunt, app-wide "kick to
// login" rather than a per-feature decision.
// VI: Xử lý 401/403 toàn cục — bất kỳ response nào trả về trạng thái không
// được phép/bị cấm đều xóa cookie xác thực và điều hướng cứng về `/login`,
// bất kể màn hình nào gây ra request. Đây là hành vi "đá về trang đăng nhập"
// áp dụng toàn ứng dụng chứ không phải quyết định riêng theo từng feature.
http.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    const status = error.response?.status;
    if (status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN) {
      settings.eraseCookie(ACCESS_TOKEN);
      settings.eraseCookie(USER_LOGIN);
      navigateTo(APP_ROUTES.LOGIN);
    }
    return Promise.reject(error);
  }
);
