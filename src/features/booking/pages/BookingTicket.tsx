import React, { useEffect, useMemo, useCallback } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Tag, Modal, Divider } from "antd";
import { UserOutlined, ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "app/store";
import { GET_TICKET_API, BOOK_TICKET_API } from "../redux/BookingTicketActionTypes";
import { BookingTicketAction } from "../redux/BookingTicket.reducer";
import { DanhSachGhe, ThongTinPhim } from "../redux/BookingTicketType";
import LoadingNew from "shared/components/LoadingNew/LoadingNew";
import { APP_ROUTES } from "shared/constants/routes";
import { SeatType } from "shared/constants/appConstants";
import SEO from "shared/components/SEO/SEO";

const BookingTicket: React.FC = () => {
  const { maLichChieu } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["booking", "common"]);

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
        title: t("booking:loginRequired"),
        content: t("booking:loginRequiredMessage"),
        okText: t("common:login"),
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
  }, [userLogin, selectedSeats, maLichChieu, dispatch, navigate, t]);

  if (isEmpty(bookingDetail) || !thongTinPhim) {
    return <LoadingNew />;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <SEO
        title={`Đặt Vé Phim ${thongTinPhim.tenPhim}`}
        description={`Đặt vé phim ${thongTinPhim.tenPhim} tại ${thongTinPhim.tenCumRap} - ${thongTinPhim.tenRap}.`}
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
          </div>

          {/* Seat Grid */}
          <div className="bg-surface border border-border rounded-xl p-4 sm:p-6 overflow-x-auto transition-colors">
            <div className="grid grid-cols-10 sm:grid-cols-16 gap-2 min-w-[500px]">
              {danhSachGhe.map((seat) => {
                const isSelected = selectedSeats.some(
                  (s) => s.maGhe === seat.maGhe
                );
                const isVip = seat.loaiGhe === SeatType.VIP;
                const isOccupied = seat.daDat;

                let seatStyle = "bg-background border-border text-text-primary hover:border-primary";
                if (isOccupied) {
                  seatStyle = "bg-border border-transparent text-text-secondary cursor-not-allowed opacity-60";
                } else if (isSelected) {
                  seatStyle = "bg-primary border-primary text-white shadow-md shadow-primary/40 font-bold scale-105";
                } else if (isVip) {
                  seatStyle = "bg-background border-secondary text-secondary hover:bg-secondary/10";
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
            <Divider className="border-border my-6" />
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded border border-border bg-background" />
                <span>{t("booking:standardSeat")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded border border-secondary bg-background" />
                <span className="text-secondary">{t("booking:vipSeat")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded border border-primary bg-primary" />
                <span className="text-primary">{t("booking:selectedSeat")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-border" />
                <span>{t("booking:occupiedSeat")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary Panel */}
        <div className="space-y-6">
          <Card className="bg-surface border-border text-text-primary sticky top-24 transition-colors">
            <h2 className="text-xl font-bold text-text-primary mb-4 pb-3 border-b border-border">
              {t("booking:bookingInfo")}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-secondary">{t("booking:movie")}</span>
                <span className="font-semibold text-text-primary text-right max-w-[180px]">
                  {thongTinPhim.tenPhim}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-secondary">{t("booking:cinemaComplex")}</span>
                <span className="font-medium text-text-primary text-right max-w-[180px]">
                  {thongTinPhim.tenCumRap}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-secondary">{t("booking:theater")}</span>
                <span className="font-medium text-text-primary">
                  {thongTinPhim.tenRap}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-secondary">{t("booking:showtime")}</span>
                <span className="font-medium text-secondary">
                  {thongTinPhim.gioChieu} - {thongTinPhim.ngayChieu}
                </span>
              </div>

              <div className="py-2 border-b border-border">
                <span className="text-text-secondary block mb-2">{t("booking:selectedSeats")}</span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {isEmpty(selectedSeats) ? (
                    <span className="text-xs italic text-text-secondary">{t("booking:noSeatsSelected")}</span>
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
                <span className="text-text-secondary font-semibold">{t("booking:totalPrice")}</span>
                <span className="text-2xl font-extrabold text-primary">
                  {totalPrice.toLocaleString()} đ
                </span>
              </div>

              {userLogin && (
                <div className="p-3 bg-background rounded-lg border border-border text-xs text-text-secondary">
                  <p className="flex items-center gap-1">
                    <UserOutlined className="text-primary" />
                    {t("booking:userAccount")} <span className="text-text-primary font-medium">{userLogin.hoTen}</span>
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
                className="bg-primary hover:bg-primary-hover font-bold h-12 text-base mt-4 shadow-lg shadow-primary/20 border-none"
              >
                {isEmpty(selectedSeats) ? t("booking:selectSeatsFirst") : t("booking:confirmBooking")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingTicket;