/**
 * EN: Seat category codes used across the booking flow (seat map, pricing,
 * seat legend). Values are Vietnamese strings ("Vip" / "Thuong") because they
 * are matched directly against the Cybersoft API's seat-type field — do not
 * "clean up" the casing/spelling, it must match the API contract exactly.
 * VI: Mã loại ghế dùng xuyên suốt luồng đặt vé (sơ đồ ghế, tính giá, chú
 * thích ghế). Giá trị là chuỗi tiếng Việt ("Vip" / "Thuong") vì được so khớp
 * trực tiếp với trường loại ghế của API Cybersoft — không được "sửa" chính
 * tả/viết hoa vì phải khớp đúng hợp đồng API.
 */
export enum SeatType {
  VIP = "Vip",
  STANDARD = "Thuong",
}

/**
 * EN: HTTP status codes referenced explicitly in the codebase (e.g. the
 * axios response interceptor in `setting.ts` checks for 401/403 to trigger
 * an auto-logout). Kept as a named enum instead of magic numbers so intent
 * is clear at call sites.
 * VI: Các mã trạng thái HTTP được tham chiếu trực tiếp trong code (ví dụ
 * interceptor response của axios trong `setting.ts` kiểm tra 401/403 để tự
 * động đăng xuất). Dùng enum có tên thay vì số "ma thuật" để ý nghĩa rõ ràng
 * tại nơi sử dụng.
 */
export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

/**
 * EN: Centralized keys for browser storage (cookies) so the access token and
 * logged-in user payload are always read/written under the same string
 * literal — avoids typo bugs from hardcoding "accessToken" in multiple files.
 * VI: Tập trung các khóa lưu trữ trình duyệt (cookie) để access token và dữ
 * liệu người dùng đã đăng nhập luôn được đọc/ghi dưới cùng một chuỗi — tránh
 * lỗi gõ nhầm do hardcode "accessToken" ở nhiều nơi.
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER_LOGIN: "userLogin",
} as const;

// How long a seat stays "held" for the current user after they select the
// first seat, before the selection auto-releases — mirrors the hold-timer
// pattern used by most real ticketing platforms (CGV/Ticketbox-style),
// since there's no server-side reservation/lock on the Cybersoft API itself.
export const SEAT_HOLD_DURATION_MS = 5 * 60 * 1000; // 5 minutes

/**
 * EN: Environment-driven configuration for the two external APIs this app
 * talks to — the Cybersoft movie-booking API (domain, auth token, group id)
 * and TMDB (domain, api key, bearer token). Falls back to public
 * Cybersoft training defaults when env vars are not set, so local dev works
 * out of the box.
 * VI: Cấu hình lấy từ biến môi trường cho hai API bên ngoài mà ứng dụng gọi
 * tới — API đặt vé của Cybersoft (domain, token xác thực, mã nhóm) và TMDB
 * (domain, api key, bearer token). Nếu không có biến môi trường thì dùng giá
 * trị mặc định công khai của Cybersoft để môi trường dev chạy được ngay.
 */
export const API_CONFIG = {
  DOMAIN: process.env.REACT_APP_DOMAIN || "https://movienew.cybersoft.edu.vn/api",
  TOKEN_CYBERSOFT: process.env.REACT_APP_TOKEN_CYBERSOFT || "",
  GROUP_ID: process.env.REACT_APP_GROUP_ID || "GP01",
  TMDB_DOMAIN: process.env.REACT_APP_TMDB_DOMAIN || "https://api.themoviedb.org/3",
  TMDB_API_KEY: process.env.REACT_APP_TMDB_API_KEY || "",
  TMDB_TOKEN: process.env.REACT_APP_TMDB_TOKEN || "",
} as const;
