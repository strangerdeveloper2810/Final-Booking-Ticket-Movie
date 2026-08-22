import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { DanhSachPhim, LstLichChieuTheoPhim } from "../redux/cinema/ListCinemaType";
import { parseScheduleMovie } from "shared/utils/common";
import { APP_ROUTES } from "shared/constants/routes";
import { ListMovieProps } from "../types/home.types";

const ListMovie: FC<ListMovieProps> = ({ cinema }) => {
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
                <Tag color="#F2545B" className="font-semibold">2D</Tag>
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
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {movie.lstLichChieuTheoPhim.slice(0, 12).map((schedule: LstLichChieuTheoPhim, idx: number) => {
                  const { date, time } = parseScheduleMovie(schedule.ngayChieuGioChieu);
                  return (
                    <button
                      key={idx}
                      onClick={() => navigate(APP_ROUTES.BOOKING(schedule.maLichChieu))}
                      className="group flex items-center gap-2 bg-surface hover:bg-primary border border-border hover:border-primary px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all text-xs cursor-pointer"
                    >
                      <span className="text-text-secondary group-hover:text-white font-medium flex items-center gap-1">
                        <CalendarOutlined className="text-primary group-hover:text-white text-[11px]" />
                        {date}
                      </span>
                      <span className="bg-primary/10 group-hover:bg-white/20 text-primary group-hover:text-white font-mono font-bold px-1.5 py-0.5 rounded text-[11px]">
                        {time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListMovie;
