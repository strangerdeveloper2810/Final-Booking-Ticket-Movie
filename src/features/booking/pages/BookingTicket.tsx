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

  const handleSelectSeat = useCallback(
    (seat: DanhSachGhe) => {
      if (seat.daDat) return;
      dispatch(BookingTicketAction.toggleSelectSeat(seat));
    },
    [dispatch]
  );

  const handleBookTicket = useCallback(() => {
    if (isEmpty(userLogin)) {
      Modal.confirm({
        title: t("booking:loginRequired"),
        content: t("booking:loginRequiredMessage"),
        okText: t("auth:login"),
        cancelText: t("common:backToHome"),
        onOk: () => navigate(APP_ROUTES.LOGIN),
      });
      return;
    }

    if (isEmpty(selectedSeats)) {
      Modal.warning({
        title: t("booking:selectSeatsFirst"),
      });
      return;
    }

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
          </div>

          {/* Seat Grid */}
          <div className="bg-surface border border-border rounded-xl p-4 sm:p-6 overflow-x-auto transition-colors">
            <div className="grid grid-cols-10 sm:grid-cols-16 gap-2 min-w-[500px]">
              {danhSachGhe.map((seat) => {
                const isSelected = selectedSeats.some(
                  (s) => s.maGhe === seat.maGhe
                );
                const isOccupied = seat.daDat;
                const isVip = seat.loaiGhe === SeatType.VIP;

                let seatClasses =
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-semibold text-xs flex items-center justify-center transition-all duration-200 shadow-sm ";

                if (isOccupied) {
                  seatClasses += "bg-gray-500 text-white cursor-not-allowed opacity-60";
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

                return (
                  <button
                    key={seat.maGhe}
                    disabled={isOccupied}
                    onClick={() => handleSelectSeat(seat)}
                    className={seatClasses}
                    title={`${seat.tenGhe} (${seat.loaiGhe}) - ${seat.giaVe?.toLocaleString()} VNĐ`}
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
                <span className="text-text-secondary block mb-2">{t("booking:selectedSeats")}</span>
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
                  {totalPrice.toLocaleString()} <span className="text-xs font-normal">VNĐ</span>
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