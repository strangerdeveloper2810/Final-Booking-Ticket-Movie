import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tag } from "antd";
import { DanhSachPhim, LstLichChieuTheoPhim, LstCumRap } from "../redux/cinema/ListCinemaType";
import { formatScheduleMovie } from "shared/utils/common";
import { APP_ROUTES } from "shared/constants/routes";

interface ListMovieProps {
  cinema: LstCumRap;
}

const ListMovie: React.FC<ListMovieProps> = ({ cinema }) => {
  const navigate = useNavigate();

  if (!cinema.danhSachPhim || cinema.danhSachPhim.length === 0) {
    return (
      <div className="py-8 text-center text-[#9AA0B4]">
        Chưa có lịch chiếu cho cụm rạp này.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      {cinema.danhSachPhim.map((movie: DanhSachPhim) => (
        <div
          key={movie.maPhim}
          className="bg-[#0B0D12] p-4 rounded-xl border border-[#262B3A] flex flex-col sm:flex-row gap-4 hover:border-[#F2545B]/30 transition-colors"
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
                  className="text-base font-bold text-[#F5F6FA] hover:text-[#F2545B] transition-colors cursor-pointer"
                  onClick={() => navigate(APP_ROUTES.DETAIL(movie.maPhim))}
                >
                  {movie.tenPhim}
                </h4>
              </div>
              <p className="text-xs text-[#9AA0B4] mb-3">
                {cinema.tenCumRap} - {cinema.diaChi}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#9AA0B4] font-medium block mb-2">Lịch chiếu khả dụng:</span>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                {movie.lstLichChieuTheoPhim.slice(0, 12).map((schedule: LstLichChieuTheoPhim, idx: number) => (
                  <Button
                    key={idx}
                    size="small"
                    type="dashed"
                    onClick={() => navigate(APP_ROUTES.BOOKING(schedule.maLichChieu))}
                    className="bg-[#0B0D12] text-[#F2545B] border-[#F2545B]/40 hover:bg-[#F2545B] hover:text-white font-mono text-xs rounded-md"
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
