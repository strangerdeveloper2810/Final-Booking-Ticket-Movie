import * as signalR from "@microsoft/signalr";
import { API_CONFIG } from "@cinefix/utils";

// EN: The seat-booking SignalR hub lives at the API host root, NOT under the
// EN: `/api` prefix that every REST call in this app goes through (that prefix
// EN: is specific to the MVC/WebAPI routes, not the SignalR hub mapping) —
// EN: so it's derived by stripping a trailing `/api` off API_CONFIG.DOMAIN
// EN: rather than reusing the REST `http`/`DOMAIN` constant directly.
// VI: Hub SignalR đặt vé nằm ở gốc host của API, KHÔNG nằm dưới tiền tố
// VI: `/api` mà mọi lời gọi REST trong app này đều đi qua (tiền tố đó chỉ
// VI: dành riêng cho các route MVC/WebAPI, không áp dụng cho việc mapping
// VI: SignalR hub) — vì vậy URL này được suy ra bằng cách bỏ hậu tố `/api`
// VI: khỏi API_CONFIG.DOMAIN, thay vì tái sử dụng trực tiếp hằng số
// VI: `http`/`DOMAIN` của REST.
/**
 * EN: Base URL of the DatVeHub SignalR hub endpoint.
 * VI: URL gốc của endpoint hub SignalR DatVeHub.
 */
const HUB_URL = `${API_CONFIG.DOMAIN.replace(/\/api\/?$/, "")}/DatVeHub`;

/**
 * EN: Method names exposed by the DatVeHub SignalR hub — one to invoke
 * (client -> server) and one to listen for (server -> client broadcast).
 * VI: Tên các phương thức mà hub SignalR DatVeHub cung cấp — một phương thức
 * để gọi (client -> server) và một để lắng nghe (server phát tin -> client).
 */
export const HUB_METHOD = {
  LOAD_DANH_SACH_GHE: "loadDanhSachGhe",
  LOAD_DANH_SACH_GHE_DA_DAT: "loadDanhSachGheDaDat",
  DAT_GHE: "datGhe",
} as const;

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<void> | null = null;

/**
 * EN: Lazily creates (and memoizes) the single shared SignalR connection used
 * by the whole app, so every caller talks to the same hub connection instead
 * of opening a new socket per component.
 * VI: Tạo (và ghi nhớ/memoize) một cách lười (lazy) kết nối SignalR dùng
 * chung duy nhất cho toàn bộ app, để mọi nơi gọi đều dùng chung một kết nối
 * hub thay vì mở một socket mới cho mỗi component.
 * @returns EN: the shared, possibly not-yet-started, hub connection instance. VI: instance kết nối hub dùng chung, có thể chưa được khởi động.
 */
function getConnection(): signalR.HubConnection {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }
  return connection;
}

// EN: Lazily starts (or awaits an in-flight start of) the shared hub connection.
// EN: Only ever called once the user actually opens a booking page — unlike the
// EN: legacy course pattern of connecting before the app even renders, a failed
// EN: or slow hub connection here can never block the rest of the app.
// VI: Khởi động (hoặc chờ một lượt khởi động đang diễn ra) kết nối hub dùng
// VI: chung một cách lười (lazy). Chỉ được gọi khi người dùng thực sự mở
// VI: trang đặt vé — khác với cách làm cũ (theo pattern của khóa học) là kết
// VI: nối ngay khi app vừa render, ở đây một kết nối hub bị lỗi hoặc chậm sẽ
// VI: không bao giờ làm chặn phần còn lại của app.
/**
 * @returns EN: the hub connection once it has successfully started (or was already started). VI: kết nối hub sau khi đã khởi động thành công (hoặc đã được khởi động từ trước).
 */
async function ensureStarted(): Promise<signalR.HubConnection> {
  const conn = getConnection();
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    startPromise = conn.start();
  }
  if (startPromise) {
    await startPromise;
  }
  return conn;
}

/**
 * EN: Public API for the DatVeHub SignalR integration used by the booking
 * sagas — join/leave a showtime's realtime seat room and subscribe to
 * seat-map broadcasts.
 * VI: API công khai cho tích hợp SignalR DatVeHub, được các saga đặt vé sử
 * dụng — tham gia/rời phòng ghế theo thời gian thực của một lịch chiếu và
 * đăng ký nhận các tin phát (broadcast) cập nhật sơ đồ ghế.
 */
const BookingHubService = {
  // EN: Joins the realtime "room" for a showtime by invoking loadDanhSachGhe — the server responds by broadcasting loadDanhSachGheDaDat to every client in that room whenever the seat map changes.
  // VI: Tham gia "phòng" theo thời gian thực của một lịch chiếu bằng cách gọi loadDanhSachGhe — server sẽ phản hồi bằng cách phát (broadcast) loadDanhSachGheDaDat tới mọi client trong phòng đó mỗi khi sơ đồ ghế thay đổi.
  /**
   * EN: Joins (or re-joins, to trigger a rebroadcast) the SignalR room for a showtime.
   * VI: Tham gia (hoặc tham gia lại, để kích hoạt phát lại dữ liệu) phòng SignalR của một lịch chiếu.
   * @param maLichChieu - EN: the showtime id whose room to join. VI: mã lịch chiếu cần tham gia phòng.
   * @returns EN: a promise that resolves once the hub invocation completes. VI: một promise hoàn tất khi lệnh gọi hub kết thúc.
   */
  joinShowtimeRoom: async (maLichChieu: string | number): Promise<void> => {
    const conn = await ensureStarted();
    await conn.invoke(HUB_METHOD.LOAD_DANH_SACH_GHE, String(maLichChieu));
  },

  /**
   * EN: Emits the current user's held/selected seats to the DatVeHub room in real time.
   * VI: Gửi danh sách ghế đang chọn/giữ của người dùng hiện tại tới phòng DatVeHub theo thời gian thực.
   * @param taiKhoan - EN: the user's account name. VI: tên tài khoản người dùng.
   * @param selectedSeats - EN: array of seats currently selected. VI: mảng các ghế đang được chọn.
   * @param maLichChieu - EN: the showtime id. VI: mã lịch chiếu.
   */
  sendSelectedSeats: async (
    taiKhoan: string,
    selectedSeats: any[],
    maLichChieu: string | number
  ): Promise<void> => {
    try {
      const conn = await ensureStarted();
      const seatsPayload = JSON.stringify(selectedSeats);
      await conn.invoke(HUB_METHOD.DAT_GHE, taiKhoan, seatsPayload, String(maLichChieu));
    } catch (error) {
      console.error("Failed to send selected seats via SignalR DatVeHub", error);
    }
  },

  // EN: Registers a listener for realtime seat-map broadcasts. Returns an unsubscribe function.
  // VI: Đăng ký một listener để nhận các tin phát cập nhật sơ đồ ghế theo thời gian thực. Trả về một hàm để hủy đăng ký.
  /**
   * EN: Subscribes to `loadDanhSachGheDaDat` broadcasts from the hub.
   * VI: Đăng ký lắng nghe các tin phát `loadDanhSachGheDaDat` từ hub.
   * @param callback - EN: invoked with the broadcast payload each time the server pushes an update. VI: được gọi với dữ liệu phát mỗi khi server đẩy một cập nhật mới.
   * @returns EN: an unsubscribe function that removes this listener. VI: một hàm hủy đăng ký để gỡ bỏ listener này.
   */
  onSeatMapUpdated: <T = unknown>(callback: (payload: T) => void): (() => void) => {
    const conn = getConnection();
    conn.on(HUB_METHOD.LOAD_DANH_SACH_GHE_DA_DAT, callback);
    return () => conn.off(HUB_METHOD.LOAD_DANH_SACH_GHE_DA_DAT, callback);
  },
};

export default BookingHubService;
