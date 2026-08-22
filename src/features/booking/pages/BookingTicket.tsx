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
        onOk: () => navigate("/login"),
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

          {/* Screen Banner */}
          <div className="relative py-4 text-center">
            <div className="h-3 w-full bg-gradient-to-r from-transparent via-[#F2545B] to-transparent rounded-t-full shadow-lg shadow-[#F2545B]/30 mb-2" />
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
                const isVip = seat.loaiGhe === "Vip";
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
                <div className="w-5 h-5 rounded border border-[#262B3A] bg-[#151822]" />
                <span>Ghế thường</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded border border-[#FFC857] bg-[#151822]" />
                <span>Ghế VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#F2545B]" />
                <span>Ghế đang chọn</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#262B3A] opacity-60" />
                <span>Ghế đã được đặt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary Sidebar */}
        <div>
          <div className="bg-[#151822] border border-[#262B3A] rounded-xl p-6 sticky top-20 space-y-6 shadow-xl">
            <div className="flex gap-4">
              <img
                src={thongTinPhim.hinhAnh}
                alt={thongTinPhim.tenPhim}
                className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-[#F5F6FA] text-base leading-tight mb-2">
                  {thongTinPhim.tenPhim}
                </h3>
                <p className="text-xs text-[#9AA0B4]">{thongTinPhim.tenCumRap}</p>
                <p className="text-xs text-[#9AA0B4]">{thongTinPhim.tenRap}</p>
              </div>
            </div>

            <Divider className="border-[#262B3A] my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-[#9AA0B4]">Ghế đã chọn:</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[180px]">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((seat) => (
                      <Tag key={seat.maGhe} color="#F2545B" className="font-mono m-0">
                        {seat.tenGhe}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-xs text-[#9AA0B4] italic">Chưa chọn ghế</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#9AA0B4]">Tài khoản đặt:</span>
                <span className="font-medium text-[#F5F6FA] flex items-center gap-1">
                  <UserOutlined className="text-[#F2545B]" />
                  {userLogin?.hoTen || "Khách"}
                </span>
              </div>
            </div>

            <Divider className="border-[#262B3A] my-4" />

            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-[#9AA0B4]">Tổng tiền:</span>
              <span className="text-2xl font-extrabold text-[#F2545B]">
                {totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>

            <Button
              type="primary"
              block
              size="large"
              loading={isBooking}
              disabled={selectedSeats.length === 0}
              onClick={handleConfirmBooking}
              className="bg-[#F2545B] hover:bg-[#FF6B72] font-semibold h-12 text-base shadow-lg shadow-[#F2545B]/30"
            >
              Xác Nhận Đặt Vé ({selectedSeats.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTicket;