import { type FC, useEffect, useState } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import some from "lodash/some";
import sumBy from "lodash/sumBy";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Tag, Divider, App } from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "app/store";
import {
  GET_TICKET_API,
  BOOK_TICKET_API,
  JOIN_SEAT_ROOM,
  LEAVE_SEAT_ROOM,
} from "../redux/BookingTicketActionTypes";
import { BookingTicketAction } from "../redux/BookingTicket.reducer";
import { DanhSachGhe, ThongTinPhim } from "@cinefix/types";
import { BookingHubService } from "@cinefix/realtime";
import { LoadingNew, SEO } from "@cinefix/ui";
import { APP_ROUTES, SeatType } from "@cinefix/utils";

/**
 * EN: Formats a millisecond duration as an "M:SS" countdown string (e.g.
 * 90000ms -> "1:30"), used to render the seat-hold countdown next to the
 * selected seats.
 * VI: Định dạng một khoảng thời gian tính bằng mili-giây thành chuỗi đếm
 * ngược dạng "M:SS" (ví dụ: 90000ms -> "1:30"), dùng để hiển thị bộ đếm ngược
 * giữ ghế bên cạnh danh sách ghế đã chọn.
 * @param ms - EN: remaining time in milliseconds. VI: thời gian còn lại tính bằng mili-giây.
 * @returns EN: a "minutes:seconds" formatted string. VI: chuỗi được định dạng theo "phút:giây".
 */
function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * EN: Seat-booking page for a single showtime — renders the seat map, keeps
 * it in sync with realtime DatVeHub seat updates, tracks the client-side
 * seat-hold countdown, and submits the final booking request.
 * VI: Trang đặt vé chọn ghế cho một lịch chiếu — hiển thị sơ đồ ghế, đồng bộ
 * với các cập nhật ghế theo thời gian thực từ DatVeHub, theo dõi bộ đếm
 * ngược giữ ghế phía client, và gửi yêu cầu đặt vé cuối cùng.
 * @returns EN: the rendered booking page. VI: trang đặt vé đã được render.
 */
const BookingTicket: FC = () => {
  const { maLichChieu } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["booking", "common"]);
  // EN: `App.useApp()` (AntD v5's context-aware app API) is used here instead
  // EN: of the static `Modal.confirm`/`message.warning` imports — the static
  // EN: APIs render outside AntD's ConfigProvider/theme context, so they miss
  // EN: the app's theme tokens (e.g. dark mode) and any App-level static
  // EN: function config. Using the hook keeps modals/toasts visually
  // EN: consistent with the rest of the themed UI.
  // VI: `App.useApp()` (API app nhận biết context của AntD v5) được dùng ở
  // VI: đây thay vì import tĩnh `Modal.confirm`/`message.warning` — các API
  // VI: tĩnh render bên ngoài context ConfigProvider/theme của AntD, nên sẽ
  // VI: bị thiếu các token theme của app (ví dụ: dark mode) cũng như mọi cấu
  // VI: hình static function ở cấp App. Dùng hook này giúp modal/thông báo
  // VI: hiển thị nhất quán về mặt giao diện với phần còn lại của UI đã theme.
  const { modal, message } = App.useApp();

  const bookingDetail = useSelector((state: RootState) =>
    get(state, "Booking.bookingDetail", {})
  );
  const selectedSeats: DanhSachGhe[] = useSelector(
    (state: RootState) => state.Booking.selectedSeats || []
  );
  const danhSachGheDangDat = useSelector(
    (state: RootState) => state.Booking.danhSachGheDangDat || []
  );
  const isBooking = useSelector((state: RootState) =>
    get(state, "Booking.isBooking", false)
  );
  const selectionExpiresAt = useSelector(
    (state: RootState) => state.Booking.selectionExpiresAt
  );
  const { userLogin } = useSelector((state: RootState) => state.UserSaga);

  // Map of seat IDs being held in real-time by OTHER users (maGhe -> taiKhoan)
  const otherUsersHoldingSeats = new Map<number, string>();
  danhSachGheDangDat.forEach((item) => {
    if (item.taiKhoan !== userLogin?.taiKhoan) {
      (item.danhSachGhe || []).forEach((seat) => {
        otherUsersHoldingSeats.set(seat.maGhe, item.taiKhoan);
      });
    }
  });

  // EN: Seat-hold countdown: ticks every second while a selection is held, and
  // EN: auto-releases the seats (with a toast) once the deadline passes — there's
  // EN: no server-side reservation lock on the Cybersoft API, so this is enforced
  // EN: purely client-side, same spirit as the countdown on most real booking
  // EN: platforms.
  // VI: Bộ đếm ngược giữ ghế: chạy mỗi giây trong khi một lượt chọn ghế đang
  // VI: được giữ, và tự động giải phóng ghế (kèm thông báo) khi hết thời hạn —
  // VI: vì API Cybersoft không có cơ chế khóa giữ chỗ ở phía server, nên việc
  // VI: này được xử lý hoàn toàn ở phía client, cùng tinh thần với bộ đếm
  // VI: ngược trên hầu hết các nền tảng đặt vé thực tế.
  const [remainingMs, setRemainingMs] = useState(0);

  const [combos, setCombos] = useState([
    { id: "c1", name: "Combo Solo", desc: "1 Bỏng Phô Mai Vừa + 1 Pepsi", price: 75000, quantity: 0, icon: "🍿" },
    { id: "c2", name: "Combo Couple", desc: "1 Bỏng Lớn + 2 Pepsi 500ml", price: 120000, quantity: 0, icon: "🥤" },
    { id: "c3", name: "Combo Party", desc: "2 Bỏng Lớn + 4 Pepsi + Snack", price: 190000, quantity: 0, icon: "🎉" },
  ]);

  const handleComboChange = (id: string, delta: number) => {
    setCombos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c))
    );
  };

  const comboTotal = sumBy(combos, (c) => c.price * c.quantity);

  useEffect(() => {
    if (!selectionExpiresAt) {
      setRemainingMs(0);
      return;
    }

    const tick = () => {
      const remaining = selectionExpiresAt - Date.now();
      if (remaining <= 0) {
        setRemainingMs(0);
        dispatch(BookingTicketAction.clearSelectedSeats());
        if (maLichChieu) {
          BookingHubService.sendSelectedSeats(
            userLogin?.taiKhoan || "guest",
            [],
            maLichChieu
          );
        }
        message.warning(t("booking:seatHoldExpired"));
        return;
      }
      setRemainingMs(remaining);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [selectionExpiresAt, dispatch, message, t, maLichChieu, userLogin]);

  useEffect(() => {
    if (maLichChieu) {
      dispatch({
        type: GET_TICKET_API,
        payload: maLichChieu,
      });
      // EN: Join the DatVeHub SignalR room for this showtime — the server
      // EN: pushes a fresh seat map to everyone in the room whenever anyone
      // EN: books a seat, so occupancy updates live without polling.
      // VI: Tham gia phòng SignalR của DatVeHub cho lịch chiếu này — server
      // VI: sẽ đẩy sơ đồ ghế mới nhất tới mọi người trong phòng mỗi khi có ai
      // VI: đó đặt ghế, nhờ vậy tình trạng ghế được cập nhật theo thời gian
      // VI: thực mà không cần polling.
      dispatch({
        type: JOIN_SEAT_ROOM,
        payload: maLichChieu,
      });
    }

    return () => {
      if (maLichChieu) {
        BookingHubService.sendSelectedSeats(
          userLogin?.taiKhoan || "guest",
          [],
          maLichChieu
        );
      }
      dispatch({ type: LEAVE_SEAT_ROOM });
      dispatch(BookingTicketAction.removeDetailBookingTicket());
    };
  }, [maLichChieu, dispatch, userLogin]);

  const thongTinPhim: ThongTinPhim | undefined = get(bookingDetail, "thongTinPhim");
  const danhSachGhe: DanhSachGhe[] = get(bookingDetail, "danhSachGhe", []);

  const totalPrice = sumBy(selectedSeats, (seat: DanhSachGhe) => seat.giaVe || 0);

  /**
   * EN: Toggles a seat's selection state and emits the updated selection to SignalR DatVeHub.
   * VI: Bật/tắt trạng thái chọn của một ghế và gửi danh sách chọn mới tới SignalR DatVeHub theo thời gian thực.
   * @param seat - EN: the seat clicked. VI: ghế vừa bấm chọn.
   */
  const handleSelectSeat = (seat: DanhSachGhe) => {
    if (seat.daDat || otherUsersHoldingSeats.has(seat.maGhe)) return;

    const isCurrentlySelected = selectedSeats.some((s) => s.maGhe === seat.maGhe);
    const updatedSelectedSeats = isCurrentlySelected
      ? selectedSeats.filter((s) => s.maGhe !== seat.maGhe)
      : [...selectedSeats, seat];

    dispatch(BookingTicketAction.toggleSelectSeat(seat));

    if (maLichChieu) {
      BookingHubService.sendSelectedSeats(
        userLogin?.taiKhoan || "guest",
        updatedSelectedSeats,
        maLichChieu
      );
    }
  };

  /**
   * EN: Validates preconditions (logged in, at least one seat selected) and,
   * if they pass, dispatches the booking submission action.
   * VI: Kiểm tra các điều kiện tiên quyết (đã đăng nhập, đã chọn ít nhất một
   * ghế) và, nếu hợp lệ, dispatch action gửi yêu cầu đặt vé.
   */
  const handleBookTicket = () => {
    if (isEmpty(userLogin)) {
      modal.confirm({
        title: t("booking:loginRequired"),
        content: t("booking:loginRequiredMessage"),
        okText: t("auth:login"),
        cancelText: t("common:backToHome"),
        onOk: () => navigate(APP_ROUTES.LOGIN),
      });
      return;
    }

    if (isEmpty(selectedSeats)) {
      modal.warning({
        title: t("booking:selectSeatsFirst"),
      });
      return;
    }

    const payload = {
      maLichChieu: Number(maLichChieu),
      danhSachVe: map(selectedSeats, (seat) => ({
        maGhe: seat.maGhe,
        giaVe: seat.giaVe,
      })),
    };

    dispatch({
      type: BOOK_TICKET_API,
      payload,
    });
  };

  if (isEmpty(thongTinPhim)) {
    return <LoadingNew />;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <SEO
        title={t("booking:bookTicketFor", { movie: thongTinPhim.tenPhim })}
        description={t("booking:bookTicketDesc", {
          movie: thongTinPhim.tenPhim,
          cinema: thongTinPhim.tenCumRap,
          theater: thongTinPhim.tenRap,
        })}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Screen & Seat Map Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Showtime Info Bar */}
          <Card className="bg-surface border-border text-text-primary transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  {thongTinPhim.tenPhim}
                </h1>
                <p className="text-sm text-text-secondary flex items-center gap-2 mt-1">
                  <EnvironmentOutlined className="text-primary" />
                  {thongTinPhim.tenCumRap} - {thongTinPhim.tenRap}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20">
                <ClockCircleOutlined />
                <span>
                  {thongTinPhim.ngayChieu} - {thongTinPhim.gioChieu}
                </span>
              </div>
            </div>
          </Card>

          {/* Curved Cinema Screen Header */}
          <div className="relative py-4 text-center">
            <div className="w-4/5 h-3 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-lg shadow-primary/50 mb-2" />
            <span className="text-xs uppercase font-semibold text-text-secondary tracking-widest">
              {t("booking:screen")}
            </span>
            <div
              className="absolute right-0 top-4 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-text-secondary"
              title={t("booking:liveSeatSyncHint")}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52c41a] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52c41a]" />
              </span>
              {t("booking:liveSeatSync")}
            </div>
          </div>

          {/* Seat Grid */}
          <div className="bg-surface border border-border rounded-xl p-4 sm:p-6 overflow-x-auto transition-colors">
            <div className="grid grid-cols-10 sm:grid-cols-16 gap-2 min-w-[500px]">
              {/* EN: Kept as native `.map()` (not lodash) since it returns JSX per
                  iteration — the idiomatic React list-rendering pattern; only the
                  boolean `isSelected` lookup below is a genuine data-transform swap. */}
              {/* VI: Vẫn dùng `.map()` gốc (không dùng lodash) vì nó trả về JSX cho
                  mỗi lượt lặp — đây là cách render danh sách chuẩn (idiomatic) của
                  React; chỉ có phép tra cứu boolean `isSelected` bên dưới mới thực
                  sự là một phép chuyển đổi dữ liệu đáng để thay bằng lodash. */}
              {danhSachGhe.map((seat) => {
                const isSelected = some(
                  selectedSeats,
                  (s) => s.maGhe === seat.maGhe
                );
                const isOccupied = seat.daDat;
                const isHeldByOther = otherUsersHoldingSeats.has(seat.maGhe);
                const otherUserAccount = otherUsersHoldingSeats.get(seat.maGhe);
                const isVip = seat.loaiGhe === SeatType.VIP;

                let seatClasses =
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-semibold text-xs flex items-center justify-center transition-all duration-200 shadow-sm ";

                if (isOccupied) {
                  seatClasses += "bg-gray-500 text-white cursor-not-allowed opacity-60";
                } else if (isHeldByOther) {
                  seatClasses +=
                    "bg-orange-500 text-white cursor-not-allowed animate-pulse shadow-md shadow-orange-500/40 font-bold";
                } else if (isSelected) {
                  seatClasses +=
                    "bg-[#52c41a] text-white scale-110 shadow-lg shadow-green-500/40 font-bold ring-2 ring-white";
                } else if (isVip) {
                  seatClasses +=
                    "bg-[#FFC857] text-black hover:bg-[#ffd67a] hover:scale-105 cursor-pointer font-bold";
                } else {
                  seatClasses +=
                    "bg-border text-text-primary hover:bg-primary hover:text-white hover:scale-105 cursor-pointer";
                }

                const seatTitle = isHeldByOther
                  ? t("booking:beingSelectedBy", { user: otherUserAccount })
                  : `${seat.tenGhe} (${seat.loaiGhe}) - ${seat.giaVe?.toLocaleString()} VNĐ`;

                return (
                  <button
                    key={seat.maGhe}
                    disabled={isOccupied || isHeldByOther}
                    onClick={() => handleSelectSeat(seat)}
                    className={seatClasses}
                    title={seatTitle}
                  >
                    {seat.tenGhe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seat Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 bg-surface border border-border rounded-xl p-4 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-border border border-border" />
              <span className="text-xs text-text-secondary">{t("booking:standardSeat")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#FFC857]" />
              <span className="text-xs text-text-secondary">{t("booking:vipSeat")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#52c41a]" />
              <span className="text-xs text-text-secondary">{t("booking:selectedSeat")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-orange-500 animate-pulse" />
              <span className="text-xs text-text-secondary">{t("booking:beingSelectedSeat")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gray-500" />
              <span className="text-xs text-text-secondary">{t("booking:occupiedSeat")}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Summary Card */}
        <div className="lg:col-span-1">
          <Card className="bg-surface border-border text-text-primary sticky top-24 shadow-xl transition-colors">
            <h2 className="text-lg font-bold text-text-primary mb-4 pb-3 border-b border-border">
              {t("booking:bookingInfo")}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t("booking:movie")}</span>
                <span className="font-semibold text-text-primary text-right">
                  {thongTinPhim.tenPhim}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t("booking:cinemaComplex")}</span>
                <span className="font-semibold text-text-primary text-right">
                  {thongTinPhim.tenCumRap}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t("booking:theater")}</span>
                <span className="font-semibold text-text-primary">{thongTinPhim.tenRap}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t("booking:showtime")}</span>
                <span className="font-semibold text-secondary">
                  {thongTinPhim.ngayChieu} - {thongTinPhim.gioChieu}
                </span>
              </div>

              <Divider className="my-3 border-border" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">{t("booking:selectedSeats")}</span>
                  {remainingMs > 0 && (
                    <span
                      className="flex items-center gap-1 text-xs font-semibold text-primary"
                      title={t("booking:seatHoldHint")}
                    >
                      <HourglassOutlined />
                      {formatCountdown(remainingMs)}
                    </span>
                  )}
                </div>
                {!isEmpty(selectedSeats) ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.map((seat) => (
                      <Tag key={seat.maGhe} color="red" className="font-semibold">
                        {seat.tenGhe}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-text-secondary italic">
                    {t("booking:noSeatsSelected")}
                  </span>
                )}
              </div>

              <Divider className="my-3 border-border" />

              {/* Popcorn & Beverages Concession Combos */}
              <div>
                <span className="text-text-secondary font-semibold text-xs block mb-2 uppercase tracking-wider">
                  🍿 Combo Bắp Nước Rạp Phim
                </span>
                <div className="space-y-2">
                  {combos.map((combo) => (
                    <div
                      key={combo.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-background border border-border text-xs"
                    >
                      <div className="flex-1 pr-2">
                        <p className="font-bold text-text-primary">
                          {combo.icon} {combo.name}
                        </p>
                        <p className="text-[10px] text-text-secondary line-clamp-1">{combo.desc}</p>
                        <p className="text-[11px] font-semibold text-primary">{combo.price.toLocaleString()} VNĐ</p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-surface border border-border rounded-md px-1.5 py-0.5">
                        <button
                          onClick={() => handleComboChange(combo.id, -1)}
                          disabled={combo.quantity <= 0}
                          className="w-5 h-5 rounded flex items-center justify-center bg-border text-text-primary hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-border text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-bold text-text-primary">{combo.quantity}</span>
                        <button
                          onClick={() => handleComboChange(combo.id, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center bg-primary text-white hover:bg-primary-hover text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Divider className="my-3 border-border" />

              {userLogin && (
                <div className="flex justify-between items-center text-xs text-text-secondary">
                  <span>{t("booking:userAccount")}</span>
                  <span className="font-semibold text-text-primary flex items-center gap-1">
                    <UserOutlined className="text-primary" />
                    {userLogin.taiKhoan}
                  </span>
                </div>
              )}

              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-base font-bold text-text-primary">{t("booking:totalPrice")}</span>
                <span className="text-2xl font-extrabold text-primary">
                  {(totalPrice + comboTotal).toLocaleString()} <span className="text-xs font-normal">VNĐ</span>
                </span>
              </div>

              <Button
                type="primary"
                block
                size="large"
                loading={isBooking}
                onClick={handleBookTicket}
                className="bg-primary hover:bg-primary-hover font-bold h-12 mt-4 text-base shadow-lg shadow-primary/30 border-none"
              >
                {t("booking:confirmBooking")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingTicket;