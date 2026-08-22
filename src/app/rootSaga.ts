import { all } from "redux-saga/effects";
import * as banner from "features/home/redux/banner/BannerSaga";
import * as cinema from "features/home/redux/cinema/CinemaSaga";
import * as film from "features/home/redux/filmList/FilmSaga";
import * as user from "features/auth/redux/UserSaga";
import * as booking from "features/booking/redux/Booking.saga";
import { watchSeatRoom } from "features/booking/redux/BookingHub.saga";

// EN: This is a "composition root" file: its whole job is to import every
// feature's saga watchers and fork them all under one root saga so
// `app/store.ts` only has to run a single saga. Unlike feature files (which
// never import from other features or from `app/`), a composition root is
// explicitly allowed — and expected — to reach across every feature,
// because gathering everything in one place is the entire point of it.
// VI: Đây là một file "composition root" (gốc kết hợp): nhiệm vụ duy nhất
// là import toàn bộ saga watcher của từng feature rồi fork tất cả dưới một
// root saga, để `app/store.ts` chỉ cần chạy một saga duy nhất. Khác với các
// file feature (không bao giờ import lẫn nhau hay import từ `app/`), một
// composition root được phép — và bắt buộc — chạm tới mọi feature, vì gom
// mọi thứ về một chỗ chính là mục đích tồn tại của nó.
/**
 * EN: Root saga run once at app startup (see `app/store.ts`). Forks every
 * feature's watcher sagas in parallel via `all([...])` so they all run for
 * the lifetime of the app. Note: `banner`/`film`/`cinema` here drive the
 * legacy Redux-Saga slices registered in `store.ts` (`Banner`/`FlimList`/
 * `ListCinema`) — see `store.ts` for why those slices currently have no
 * real UI consumers.
 * VI: Root saga được chạy một lần khi ứng dụng khởi động (xem `app/store.ts`).
 * Fork song song mọi watcher saga của từng feature bằng `all([...])` để
 * chúng chạy suốt vòng đời ứng dụng. Lưu ý: `banner`/`film`/`cinema` ở đây
 * điều khiển các slice Redux-Saga cũ đã đăng ký trong `store.ts`
 * (`Banner`/`FlimList`/`ListCinema`) — xem `store.ts` để biết vì sao các
 * slice đó hiện không còn UI nào thực sự tiêu thụ dữ liệu.
 */
export function* rootSaga() {
  yield all([
    banner.actionGetAllBanner(),
    user.actionRegisterSaga(),
    user.actionLoginSaga(),
    film.actionGetAllFilm(),
    cinema.actionGetAllCinema(),
    booking.actionGetTicketApi(),
    watchSeatRoom(),
  ]);
}
