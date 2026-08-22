import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Tag } from "antd";
import { Film } from "../redux/filmList/FilmType";
import Star from "shared/components/Star/Star";
import { APP_ROUTES } from "shared/constants/routes";

interface FilmItemProps {
  filmItem: Film;
}

const FilmItem: React.FC<FilmItemProps> = ({ filmItem }) => {
  const navigate = useNavigate();

  const handleBooking = useCallback(() => {
    navigate(APP_ROUTES.DETAIL(filmItem.maPhim));
  }, [navigate, filmItem.maPhim]);

  return (
    <Card
      hoverable
      className="bg-[#151822] border-[#262B3A] overflow-hidden flex flex-col h-full rounded-xl transition-all duration-300 hover:border-[#F2545B]/50 hover:-translate-y-1"
      bodyStyle={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}
      cover={
        <div className="relative h-72 overflow-hidden group">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={filmItem.hinhAnh}
            alt={filmItem.tenPhim}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/300/400";
            }}
          />
          <div className="absolute top-3 right-3">
            {filmItem.hot && <Tag color="#F2545B" className="font-semibold">HOT</Tag>}
            {filmItem.dangChieu && <Tag color="#FFC857" className="font-semibold text-black">ĐANG CHIẾU</Tag>}
          </div>
        </div>
      }
    >
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#F5F6FA] line-clamp-1 group-hover:text-[#F2545B] transition-colors mb-1">
            {filmItem.tenPhim}
          </h3>
          <p className="text-xs text-[#9AA0B4] line-clamp-2 leading-relaxed mb-2">
            {filmItem.moTa || "Phim chiếu rạp đặc sắc..."}
          </p>
          <div className="flex items-center gap-1">
            <Star />
            <span className="text-xs text-[#FFC857] font-semibold ml-1">
              {filmItem.danhGia ? `${filmItem.danhGia}/10` : "8/10"}
            </span>
          </div>
        </div>

        <Button
          type="primary"
          block
          onClick={handleBooking}
          className="bg-[#F2545B] hover:bg-[#FF6B72] font-semibold h-10 mt-2"
        >
          Đặt vé ngay
        </Button>
      </div>
    </Card>
  );
};

export default React.memo(FilmItem);
