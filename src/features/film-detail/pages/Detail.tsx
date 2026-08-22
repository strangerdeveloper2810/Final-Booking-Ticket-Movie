import React, { useState, useEffect, useCallback } from "react";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import { useParams, useNavigate } from "react-router-dom";
import { PlayCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { Image, Button, Modal, Tabs, Tag, Rate, Empty } from "antd";
import { useTranslation } from "react-i18next";
import { FilmDetail } from "../redux/types/FilmDetail";
import {
  CalendarMovieTheaterFilm,
  HeThongRapChieu,
} from "../redux/types/CalendarFilmType";
import filmDetailServiceInstance from "../services/FlimDetailService";
import managementServiceInstance from "../services/ManagementMovieService";
import { formatScheduleMovie } from "shared/utils/common";
import { APP_ROUTES } from "shared/constants/routes";
import { HTTP_STATUS } from "shared/constants/appConstants";
import SEO from "shared/components/SEO/SEO";

const Detail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["detail", "common"]);

  const [detailFilm, setDetailFilm] = useState<FilmDetail>();
  const [calendarMovieTheaterFilm, setCalendarMovieTheaterFilm] = useState<CalendarMovieTheaterFilm>();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      if (id) {
        const param = { maPhim: id };

        const detailRes = await filmDetailServiceInstance.getFilmDetail(param);
        if (get(detailRes, "status") === HTTP_STATUS.OK) {
          setDetailFilm(get(detailRes, "data.content"));
        }

        const calendarRes = await managementServiceInstance.getInfoCanlendarFilm(param);
        if (get(calendarRes, "status") === HTTP_STATUS.OK) {
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
              <p className="font-bold text-text-primary text-sm line-clamp-1">
                {get(theaterComplex, "tenCumRap", "")}
              </p>
              <p className="text-xs text-text-secondary line-clamp-1">
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
                  onClick={() => navigate(APP_ROUTES.BOOKING(get(theater, "maLichChieu", "")))}
                  className="bg-background text-primary border-primary/40 hover:bg-primary hover:text-white font-mono text-sm py-2 h-auto rounded-lg"
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

  const movieJsonLd = detailFilm
    ? {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: detailFilm.tenPhim,
        image: detailFilm.hinhAnh,
        description: detailFilm.moTa,
        aggregateRating: detailFilm.danhGia
          ? {
              "@type": "AggregateRating",
              ratingValue: detailFilm.danhGia,
              bestRating: "10",
              ratingCount: "100",
            }
          : undefined,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-background pb-16 transition-colors">
      <SEO
        title={detailFilm?.tenPhim ? `${detailFilm.tenPhim} - ${t("detail:showtimesTitle")}` : t("detail:showtimesTitle")}
        description={detailFilm?.moTa || t("detail:descriptionPlaceholder")}
        image={detailFilm?.hinhAnh}
        jsonLd={movieJsonLd}
      />

      {/* Hero Backdrop Banner */}
      <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-30"
          style={{ backgroundImage: `url(${detailFilm?.hinhAnh})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <div className="relative max-w-screen-xl mx-auto px-4 md:px-6 py-12 w-full grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="w-64 h-96 rounded-xl overflow-hidden shadow-2xl border-2 border-border group">
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
              {detailFilm?.hot && <Tag color="#F2545B" className="font-semibold">{t("common:hot")}</Tag>}
              {detailFilm?.dangChieu && <Tag color="#FFC857" className="font-semibold text-black">{t("common:nowShowing")}</Tag>}
              {detailFilm?.sapChieu && <Tag color="#52c41a" className="font-semibold">{t("common:comingSoon")}</Tag>}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight">
              {detailFilm?.tenPhim}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-text-secondary">
              {detailFilm?.ngayKhoiChieu && (
                <div className="flex items-center gap-1">
                  <CalendarOutlined className="text-primary" />
                  <span>
                    {new Date(detailFilm.ngayKhoiChieu).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
              {detailFilm?.danhGia && (
                <div className="flex items-center gap-2">
                  <Rate disabled defaultValue={detailFilm.danhGia / 2} allowHalf />
                  <span className="text-secondary font-bold">
                    {detailFilm.danhGia}/10
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm md:text-base text-text-secondary line-clamp-4 leading-relaxed max-w-3xl">
              {detailFilm?.moTa || t("detail:descriptionPlaceholder")}
            </p>

            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={() => setIsTrailerOpen(true)}
                className="bg-primary hover:bg-primary-hover font-semibold h-12 px-6 rounded-lg shadow-lg shadow-primary/20 border-none"
              >
                {t("detail:watchTrailer")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 mt-10">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-text-primary">{t("detail:showtimesTitle")}</h2>
          <div className="h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 md:p-6 shadow-xl transition-colors">
          {isEmpty(calendarSystem) ? (
            <Empty description={<span className="text-text-secondary">{t("detail:noShowtimes")}</span>} />
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
