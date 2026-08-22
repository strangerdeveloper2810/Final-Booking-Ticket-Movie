import React, { useEffect, useMemo, useCallback } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Tag, Modal, Divider } from "antd";
import { UserOutlined, ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { AppDispatch, RootState } from "app/store";
import { GET_TICKET_API, BOOK_TICKET_API } from "../redux/BookingTicketActionTypes";
import { BookingTicketAction } from "../redux/BookingTicket.reducer";
import { DanhSachGhe, ThongTinPhim } from "../redux/BookingTicketType";
import LoadingNew from "shared/components/LoadingNew/LoadingNew";
import { APP_ROUTES } from "shared/constants/routes";
import { SeatType } from "shared/constants/appConstants";

const BookingTicket: React.FC = () => {
  const { maLichChieu } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const bookingDetail = useSelector((state: RootState) =>
    get(state, "Booking.bookingDetail", {})
  );
  const selectedSeats: DanhSachGhe[] = useSelector(
    (state: RootState) => state.Booking.selectedSeats || []
  );
  const isBooking = useSelector((state: RootState) =>
    get(state, "Booking.isBooking", false)
  );
  const { userLogin } = useSelector((state: RootState) => state.UserSaga);

  useEffect(() => {
    if (maLichChieu) {
      dispatch({
        type: GET_TICKET_API,
        payload: maLichChieu,
      });
    }

    return () => {
      dispatch(BookingTicketAction.removeDetailBookingTicket());
    };
  }, [maLichChieu, dispatch]);

  const thongTinPhim: ThongTinPhim | undefined = useMemo(
    () => get(bookingDetail, "thongTinPhim"),
    [bookingDetail]
  );
  const danhSachGhe: DanhSachGhe[] = useMemo(
    () => get(bookingDetail, "danhSachGhe", []),
    [bookingDetail]
  );

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum: number, seat: DanhSachGhe) => sum + (seat.giaVe || 0), 0);
  }, [selectedSeats]);

  const handleSeatClick = useCallback(
    (seat: DanhSachGhe) => {
      if (seat.daDat) return;
      dispatch(BookingTicketAction.toggleSelectSeat(seat));
    },
    [dispatch]
  );

  const handleConfirmBooking = useCallback(() => {
    if (!userLogin) {
      Modal.confirm({
        title: "Yêu cầu đăng nhập",
        content: "Bạn cần đăng nhập để thực hiện đặt vé xem phim.",
        okText: "Đăng nhập",
        cancelText: "Hủy",
        onOk: () => navigate(APP_ROUTES.LOGIN),
      });
      return;
    }

    if (isEmpty(selectedSeats) || !maLichChieu) return;

    const payload = {
      maLichChieu: Number(maLichChieu),
      danhSachVe: selectedSeats.map((seat) => ({
        maGhe: seat.maGhe,
        giaVe: seat.giaVe,
      })),
    };

    dispatch({
      type: BOOK_TICKET_API,
      payload,
    });
  }, [userLogin, selectedSeats, maLichChieu, dispatch, navigate]);

  if (isEmpty(bookingDetail) || !thongTinPhim) {
    return <LoadingNew />;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Screen & Seat Map Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Showtime Info Bar */}
          <Card className="bg-[#151822] border-[#262B3A] text-[#F5F6FA]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-[#F5F6FA]">
                  {thongTinPhim.tenPhim}
                </h1>
                <p className="text-sm text-[#9AA0B4] flex items-center gap-2 mt-1">
                  <EnvironmentOutlined className="text-[#F2545B]" />
                  {thongTinPhim.tenCumRap} - {thongTinPhim.tenRap}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#FFC857] bg-[#FFC857]/10 px-3 py-1.5 rounded-lg border border-[#FFC857]/20">
                <ClockCircleOutlined />
                <span>
                  {thongTinPhim.ngayChieu} - {thongTinPhim.gioChieu}
                </span>
              </div>
            </div>
          </Card>

          {/* Curved Cinema Screen Header */}
          <div className="relative py-4 text-center">
            <div className="w-4/5 h-3 mx-auto bg-gradient-to-r from-transparent via-[#F2545B] to-transparent rounded-full shadow-lg shadow-[#F2545B]/50 mb-2" />
            <span className="text-xs uppercase font-semibold text-[#9AA0B4] tracking-widest">
              MÀN HÌNH
            </span>
          </div>

          {/* Seat Grid */}
          <div className="bg-[#151822] border border-[#262B3A] rounded-xl p-4 sm:p-6 overflow-x-auto">
            <div className="grid grid-cols-10 sm:grid-cols-16 gap-2 min-w-[500px]">
              {danhSachGhe.map((seat) => {
                const isSelected = selectedSeats.some(
                  (s) => s.maGhe === seat.maGhe
                );
                const isVip = seat.loaiGhe === SeatType.VIP;
                const isOccupied = seat.daDat;

                let seatStyle = "bg-[#151822] border-[#262B3A] text-[#F5F6FA] hover:border-[#F2545B]";
                if (isOccupied) {
                  seatStyle = "bg-[#262B3A] border-transparent text-[#9AA0B4] cursor-not-allowed opacity-60";
                } else if (isSelected) {
                  seatStyle = "bg-[#F2545B] border-[#F2545B] text-white shadow-md shadow-[#F2545B]/40 font-bold scale-105";
                } else if (isVip) {
                  seatStyle = "bg-[#151822] border-[#FFC857] text-[#FFC857] hover:bg-[#FFC857]/10";
                }

                return (
                  <button
                    key={seat.maGhe}
                    disabled={isOccupied}
                    onClick={() => handleSeatClick(seat)}
                    className={`h-8 sm:h-9 w-full rounded-md border text-xs font-mono transition-all flex items-center justify-center ${seatStyle}`}
                    title={`Ghế ${seat.tenGhe} (${isVip ? "VIP" : "Thường"}) - ${seat.giaVe.toLocaleString()}đ`}
                  >
                    {seat.tenGhe}
                  </button>
                );
              })}
            </div>

            {/* Seat Map Legend */}
            <Divider className="border-[#262B3A] my-6" />
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#9AA0B4]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded border border-[#262B3A] bg-[#151822]" />
                <span>Ghế thường</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded border border-[#FFC857] bg-[#151822]" />
                <span className="text-[#FFC857]">Ghế VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded border border-[#F2545B] bg-[#F2545B]" />
                <span className="text-[#F2545B]">Đang chọn</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#262B3A]" />
                <span>Đã đặt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary Panel */}
        <div className="space-y-6">
          <Card className="bg-[#151822] border-[#262B3A] text-[#F5F6FA] sticky top-24">
            <h2 className="text-xl font-bold text-[#F5F6FA] mb-4 pb-3 border-b border-[#262B3A]">
              Thông Tin Đặt Vé
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-[#262B3A]">
                <span className="text-[#9AA0B4]">Phim:</span>
                <span className="font-semibold text-[#F5F6FA] text-right max-w-[180px]">
                  {thongTinPhim.tenPhim}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#262B3A]">
                <span className="text-[#9AA0B4]">Cụm rạp:</span>
                <span className="font-medium text-[#F5F6FA] text-right max-w-[180px]">
                  {thongTinPhim.tenCumRap}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#262B3A]">
                <span className="text-[#9AA0B4]">Rạp:</span>
                <span className="font-medium text-[#F5F6FA]">
                  {thongTinPhim.tenRap}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#262B3A]">
                <span className="text-[#9AA0B4]">Suất chiếu:</span>
                <span className="font-medium text-[#FFC857]">
                  {thongTinPhim.gioChieu} - {thongTinPhim.ngayChieu}
                </span>
              </div>

              <div className="py-2 border-b border-[#262B3A]">
                <span className="text-[#9AA0B4] block mb-2">Ghế đang chọn:</span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {isEmpty(selectedSeats) ? (
                    <span className="text-xs italic text-[#9AA0B4]">Chưa chọn ghế nào</span>
                  ) : (
                    selectedSeats.map((seat) => (
                      <Tag key={seat.maGhe} color="#F2545B" className="font-mono text-xs">
                        Ghế {seat.tenGhe}
                      </Tag>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-between py-3 items-center">
                <span className="text-[#9AA0B4] font-semibold">Tổng tiền:</span>
                <span className="text-2xl font-extrabold text-[#F2545B]">
                  {totalPrice.toLocaleString()} đ
                </span>
              </div>

              {userLogin && (
                <div className="p-3 bg-[#0B0D12] rounded-lg border border-[#262B3A] text-xs text-[#9AA0B4]">
                  <p className="flex items-center gap-1">
                    <UserOutlined className="text-[#F2545B]" />
                    Tài khoản đặt: <span className="text-[#F5F6FA] font-medium">{userLogin.hoTen}</span>
                  </p>
                </div>
              )}

              <Button
                type="primary"
                size="large"
                block
                loading={isBooking}
                disabled={isEmpty(selectedSeats)}
                onClick={handleConfirmBooking}
                className="bg-[#F2545B] hover:bg-[#FF6B72] font-bold h-12 text-base mt-4 shadow-lg shadow-[#F2545B]/20"
              >
                {isEmpty(selectedSeats) ? "Vui lòng chọn ghế" : "Thanh Toán Ngay"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingTicket;