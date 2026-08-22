import React, { useState, useEffect, useCallback } from "react";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import { useParams, useNavigate } from "react-router-dom";
import { PlayCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { Image, Button, Modal, Tabs, Tag, Rate, Empty } from "antd";
import { toast } from "react-toastify";
import { FilmDetail } from "../redux/types/FilmDetail";
import {
  CalendarMovieTheaterFilm,
  HeThongRapChieu,
} from "../redux/types/CalendarFilmType";
import filmDetailServiceInstance from "../services/FlimDetailService";
import managementServiceInstance from "../services/ManagementMovieService";
import { formatScheduleMovie } from "shared/utils/common";

const Detail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detailFilm, setDetailFilm] = useState<FilmDetail>();
  const [calendarMovieTheaterFilm, setCalendarMovieTheaterFilm] = useState<CalendarMovieTheaterFilm>();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      if (id) {
        const param = { maPhim: id };

        const detailRes = await filmDetailServiceInstance.getFilmDetail(param);
        if (get(detailRes, "status") === 200) {
          setDetailFilm(get(detailRes, "data.content"));
        }

        const calendarRes = await managementServiceInstance.getInfoCanlendarFilm(param);
        if (get(calendarRes, "status") === 200) {
          setCalendarMovieTheaterFilm(get(calendarRes, "data.content"));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getEmbedYoutubeUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  const calendarSystem = get(calendarMovieTheaterFilm, "heThongRapChieu", []);

  const tabItems = map(calendarSystem, (calendar: HeThongRapChieu) => ({
    label: (
      <div className="p-1">
        <img
          src={get(calendar, "logo", "")}
          alt={get(calendar, "maHeThongRap", "")}
          className="w-12 h-12 object-contain rounded-full bg-white/10 p-1"
        />
      </div>
    ),
    key: calendar.maHeThongRap,
    children: (
      <Tabs
        tabPosition="left"
        items={map(get(calendar, "cumRapChieu", []), (theaterComplex, index) => ({
          label: (
            <div className="text-left py-1 pr-2 max-w-[220px]">
              <p className="font-bold text-[#F5F6FA] text-sm line-clamp-1">
                {get(theaterComplex, "tenCumRap", "")}
              </p>
              <p className="text-xs text-[#9AA0B4] line-clamp-1">
                {get(theaterComplex, "diaChi", "")}
              </p>
            </div>
          ),
          key: `${index + 1}`,
          children: (
            <div className="flex flex-wrap gap-3 py-4 max-h-[400px] overflow-y-auto">
              {map(get(theaterComplex, "lichChieuPhim", []), (theater: any, idx: number) => (
                <Button
                  key={idx}
                  type="dashed"
                  onClick={() => navigate(`/booking/${get(theater, "maLichChieu", "")}`)}
                  className="bg-[#0B0D12] text-[#F2545B] border-[#F2545B]/40 hover:bg-[#F2545B] hover:text-white font-mono text-sm py-2 h-auto rounded-lg"
                >
                  <span className="font-bold mr-1">{get(theater, "tenRap", "")}:</span>
                  {formatScheduleMovie(get(theater, "ngayChieuGioChieu", ""))}
                </Button>
              ))}
            </div>
          ),
        }))}
      />
    ),
  }));

  return (
    <div className="w-full pb-16">
      {/* Backdrop Hero Header */}
      <div className="relative w-full min-h-[450px] bg-[#151822] flex items-center overflow-hidden">
        {detailFilm?.hinhAnh && (
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30 scale-110"
            style={{ backgroundImage: `url(${detailFilm.hinhAnh})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/70 to-transparent" />

        <div className="relative max-w-screen-xl mx-auto px-4 md:px-6 py-12 w-full grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="w-64 h-96 rounded-xl overflow-hidden shadow-2xl border-2 border-[#262B3A] group">
              <Image
                src={detailFilm?.hinhAnh}
                alt={detailFilm?.tenPhim}
                className="w-full h-full object-cover"
                fallback="https://picsum.photos/300/450"
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {detailFilm?.hot && <Tag color="#F2545B" className="font-semibold">HOT</Tag>}
              {detailFilm?.dangChieu && <Tag color="#FFC857" className="font-semibold text-black">ĐANG CHIẾU</Tag>}
              {detailFilm?.sapChieu && <Tag color="#52c41a" className="font-semibold">SẮP CHIẾU</Tag>}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[#F5F6FA] tracking-tight">
              {detailFilm?.tenPhim}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[#9AA0B4]">
              {detailFilm?.ngayKhoiChieu && (
                <div className="flex items-center gap-1">
                  <CalendarOutlined className="text-[#F2545B]" />
                  <span>
                    {new Date(detailFilm.ngayKhoiChieu).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
              {detailFilm?.danhGia && (
                <div className="flex items-center gap-2">
                  <Rate disabled defaultValue={detailFilm.danhGia / 2} allowHalf />
                  <span className="text-[#FFC857] font-bold">{detailFilm.danhGia}/10</span>
                </div>
              )}
            </div>

            <p className="text-sm md:text-base text-[#9AA0B4] leading-relaxed max-w-2xl">
              {detailFilm?.moTa || "Chưa có mô tả chi tiết cho bộ phim này."}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={() => {
                  if (detailFilm?.trailer) {
                    setIsTrailerOpen(true);
                  } else {
                    toast.error("Phim chưa cập nhật trailer!");
                  }
                }}
                className="bg-[#F2545B] hover:bg-[#FF6B72] font-semibold flex items-center"
              >
                Xem Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 mt-10">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#F5F6FA]">Lịch Chiếu Phim</h2>
          <div className="h-1 w-16 bg-[#F2545B] rounded-full mt-2" />
        </div>

        <div className="bg-[#151822] border border-[#262B3A] rounded-xl p-4 md:p-6 shadow-xl">
          {isEmpty(calendarSystem) ? (
            <Empty description={<span className="text-[#9AA0B4]">Hiện chưa có lịch chiếu cho phim này.</span>} />
          ) : (
            <Tabs tabPosition="left" items={tabItems} />
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      <Modal
        title={detailFilm?.tenPhim || "Trailer"}
        open={isTrailerOpen}
        onCancel={() => setIsTrailerOpen(false)}
        footer={null}
        width={800}
        destroyOnClose
        centered
      >
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full rounded-lg"
            src={getEmbedYoutubeUrl(detailFilm?.trailer)}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal>
    </div>
  );
};

export default Detail;
