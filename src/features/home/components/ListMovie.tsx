import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { DanhSachPhim, LstLichChieuTheoPhim } from "../redux/cinema/ListCinemaType";
import { formatScheduleMovie } from "shared/utils/common";
import { APP_ROUTES } from "shared/constants/routes";
import { ListMovieProps } from "../types/home.types";

const ListMovie: React.FC<ListMovieProps> = ({ cinema }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["home", "common"]);

  if (!cinema.danhSachPhim || cinema.danhSachPhim.length === 0) {
    return (
      <div className="py-8 text-center text-text-secondary">
        Chưa có lịch chiếu cho cụm rạp này.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      {cinema.danhSachPhim.map((movie: DanhSachPhim) => (
        <div
          key={movie.maPhim}
          className="bg-background p-4 rounded-xl border border-border flex flex-col sm:flex-row gap-4 hover:border-primary/30 transition-colors"
        >
          <img
            src={movie.hinhAnh}
            alt={movie.tenPhim}
            className="w-full sm:w-28 h-36 object-cover rounded-lg flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/200/300";
            }}
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag color="#F2545B">2D</Tag>
                <h4
                  className="text-base font-bold text-text-primary hover:text-primary transition-colors cursor-pointer"
                  onClick={() => navigate(APP_ROUTES.DETAIL(movie.maPhim))}
                >
                  {movie.tenPhim}
                </h4>
              </div>
              <p className="text-xs text-text-secondary mb-3">
                {cinema.tenCumRap} - {cinema.diaChi}
              </p>
            </div>

            <div>
              <span className="text-xs text-text-secondary font-medium block mb-2">
                {t("home:availableSchedules")}
              </span>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                {movie.lstLichChieuTheoPhim.slice(0, 12).map((schedule: LstLichChieuTheoPhim, idx: number) => (
                  <Button
                    key={idx}
                    size="small"
                    type="dashed"
                    onClick={() => navigate(APP_ROUTES.BOOKING(schedule.maLichChieu))}
                    className="bg-background text-primary border-primary/40 hover:bg-primary hover:text-white font-mono text-xs rounded-md"
                  >
                    {formatScheduleMovie(schedule.ngayChieuGioChieu)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ListMovie);
