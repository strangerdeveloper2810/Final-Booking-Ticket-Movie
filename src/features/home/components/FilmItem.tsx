import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Tag } from "antd";
import { useTranslation } from "react-i18next";
import Star from "shared/components/Star/Star";
import { APP_ROUTES } from "shared/constants/routes";
import { FilmItemProps } from "../types/home.types";

/**
 * EN: Card that displays a single film's poster, title, description, and rating, with a
 * "book now" call to action that navigates to that film's detail page.
 * VI: Thẻ hiển thị poster, tên phim, mô tả và đánh giá của một phim, kèm nút "đặt vé ngay"
 * để điều hướng tới trang chi tiết của phim đó.
 * @param filmItem - EN: the film record to render. VI: bản ghi phim cần hiển thị.
 */
const FilmItem: FC<FilmItemProps> = ({ filmItem }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["home", "common"]);

  const handleBooking = () => {
    navigate(APP_ROUTES.DETAIL(filmItem.maPhim));
  };

  return (
    <Card
      hoverable
      className="bg-surface border-border overflow-hidden flex flex-col h-full rounded-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 shadow-md"
      styles={{ body: { padding: "16px", display: "flex", flexDirection: "column", flex: 1 } }}
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
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
            {filmItem.hot && <Tag color="#F2545B" className="font-semibold">{t("common:hot")}</Tag>}
            {filmItem.dangChieu && <Tag color="#FFC857" className="font-semibold text-black">{t("common:nowShowing")}</Tag>}
          </div>
        </div>
      }
    >
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-text-primary line-clamp-1 group-hover:text-primary transition-colors mb-1">
            {filmItem.tenPhim}
          </h3>
          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-2">
            {filmItem.moTa ? filmItem.moTa : t("home:noDescription")}
          </p>
          <div className="flex items-center gap-1">
            <Star />
            <span className="text-xs text-secondary font-semibold ml-1">
              {filmItem.danhGia ? `${filmItem.danhGia}/10` : "8/10"}
            </span>
          </div>
        </div>

        <Button
          type="primary"
          block
          onClick={handleBooking}
          className="bg-primary hover:bg-primary-hover font-semibold h-10 mt-2 border-none shadow-md shadow-primary/20"
        >
          {t("home:bookNow")}
        </Button>
      </div>
    </Card>
  );
};

export default FilmItem;
