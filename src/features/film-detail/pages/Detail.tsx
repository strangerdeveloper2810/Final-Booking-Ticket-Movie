import { type FC, useState, useEffect } from "react";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import { useParams, useNavigate } from "react-router-dom";
import { PlayCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { Image, Button, Modal, Tabs, Tag, Rate, Empty } from "antd";
import { useTranslation } from "react-i18next";
import { FilmDetail } from "@cinefix/types";
import {
  CalendarMovieTheaterFilm,
  HeThongRapChieu,
} from "../redux/types/CalendarFilmType";
import filmDetailServiceInstance from "../services/FlimDetailService";
import managementServiceInstance from "../services/ManagementMovieService";
import { parseScheduleMovie, formatLocalizedDate, APP_ROUTES, HTTP_STATUS } from "@cinefix/utils";
import {
  fetchTMDBMovieDetails,
  fetchTMDBMovieSearch,
  getTMDBImageUrl,
  TMDBMovieDetail,
} from "@cinefix/api-client";
import { SEO } from "@cinefix/ui";
import CastSlider from "../components/CastSlider";
import MovieGallery from "../components/MovieGallery";
import MovieReviews from "../components/MovieReviews";
import SimilarMovies from "../components/SimilarMovies";

/**
 * EN: Film detail page. Shows a movie's hero banner (poster, rating, synopsis, trailer) and its
 * full showtime schedule grouped by cinema chain -> cinema cluster -> showtime, letting the user
 * jump straight into the booking flow for a specific showtime.
 * VI: Trang chi tiết phim. Hiển thị banner đầu trang (poster, đánh giá, mô tả, trailer) và toàn
 * bộ lịch chiếu được nhóm theo hệ thống rạp -> cụm rạp -> suất chiếu, cho phép người dùng đặt vé
 * trực tiếp cho một suất chiếu cụ thể.
 * @returns EN: the rendered film detail page. VI: trang chi tiết phim đã được render.
 */
const Detail: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["detail", "common"]);

  const [detailFilm, setDetailFilm] = useState<FilmDetail>();
  const [calendarMovieTheaterFilm, setCalendarMovieTheaterFilm] = useState<CalendarMovieTheaterFilm>();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const param = { maPhim: id };

        let cybDetail: FilmDetail | undefined;

        // 1. Try Cybersoft API
        try {
          const detailRes = await filmDetailServiceInstance.getFilmDetail(param);
          if (get(detailRes, "status") === HTTP_STATUS.OK) {
            cybDetail = get(detailRes, "data.content");
          }
        } catch (e) {
          // Cybersoft detail not found for this ID (e.g. TMDB movie ID)
        }

        try {
          const calendarRes = await managementServiceInstance.getInfoCanlendarFilm(param);
          if (get(calendarRes, "status") === HTTP_STATUS.OK) {
            setCalendarMovieTheaterFilm(get(calendarRes, "data.content"));
          }
        } catch (e) {
          // Cybersoft calendar not found
        }

        // 2. Fetch TMDB Movie Details
        let tmdbData: TMDBMovieDetail | null = await fetchTMDBMovieDetails(id, i18n.language);

        if (!tmdbData && cybDetail?.tenPhim) {
          tmdbData = await fetchTMDBMovieSearch(cybDetail.tenPhim, i18n.language);
        }

        // 3. Construct or Merge Detail Data
        if (cybDetail) {
          const youtubeVideo = tmdbData?.videos?.results?.find(
            (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
          ) || tmdbData?.videos?.results?.[0];
          const tmdbTrailerUrl = youtubeVideo ? `https://www.youtube.com/watch?v=${youtubeVideo.key}` : "";

          setDetailFilm({
            ...cybDetail,
            moTa:
              cybDetail.moTa && cybDetail.moTa !== "Mô tả phim đang được cập nhật..."
                ? cybDetail.moTa
                : tmdbData?.overview || cybDetail.moTa,
            hinhAnh: cybDetail.hinhAnh || getTMDBImageUrl(tmdbData?.poster_path),
            trailer: cybDetail.trailer || tmdbTrailerUrl,
            danhGia: cybDetail.danhGia || (tmdbData?.vote_average ? Math.round(tmdbData.vote_average) : 10),
          });
        } else if (tmdbData) {
          // TMDB-only movie (e.g., ID = 969681)
          const youtubeVideo = tmdbData.videos?.results?.find(
            (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
          ) || tmdbData.videos?.results?.[0];
          const trailerUrl = youtubeVideo ? `https://www.youtube.com/watch?v=${youtubeVideo.key}` : "";

          setDetailFilm({
            maPhim: tmdbData.id,
            tenPhim: tmdbData.title,
            biDanh: tmdbData.original_title || tmdbData.title,
            trailer: trailerUrl,
            hinhAnh: getTMDBImageUrl(tmdbData.poster_path, "w500"),
            moTa: tmdbData.overview || "Mô tả phim đang được cập nhật...",
            maNhom: "GP00",
            ngayKhoiChieu: tmdbData.release_date || new Date().toISOString(),
            danhGia: tmdbData.vote_average ? Math.round(tmdbData.vote_average) : 8,
            hot: true,
            dangChieu: true,
            sapChieu: false,
          });
        }
      } catch (error) {
        console.error("Error fetching film detail:", error);
      }
    };
    fetchData();
  }, [id, i18n.language]);

  /**
   * EN: Navigates to the booking flow for a specific showtime.
   * VI: Điều hướng sang luồng đặt vé cho một suất chiếu cụ thể.
   * @param maLichChieu - EN: the showtime's unique id (Cybersoft API field name). VI: mã lịch chiếu (tên trường từ API Cybersoft).
   */
  const handleBookingTicket = (maLichChieu: number | string) => {
    navigate(APP_ROUTES.BOOKING(maLichChieu));
  };

  // EN: Builds JSON-LD structured data for SEO (movie rich snippets). KNOWN LIMITATION:
  // `ratingCount` is a fixed placeholder ("100"), not a real field from the API. The Cybersoft
  // film-detail response only exposes `danhGia` (a single rating value out of 10) — there is no
  // vote/review-count field to source this from. Search engines consuming this markup will see
  // an inaccurate rating count until a real source for it is available.
  // VI: Xây dựng dữ liệu có cấu trúc JSON-LD phục vụ SEO (rich snippet cho phim). HẠN CHẾ ĐÃ BIẾT:
  // `ratingCount` là giá trị cố định ("100"), không phải trường dữ liệu thật từ API. Response chi
  // tiết phim của Cybersoft chỉ có `danhGia` (một giá trị đánh giá trên thang điểm 10) — không có
  // trường số lượt đánh giá/bình chọn để lấy dữ liệu này. Công cụ tìm kiếm đọc dữ liệu này sẽ thấy
  // số lượt đánh giá không chính xác cho đến khi có nguồn dữ liệu thật.
  const movieJsonLd = detailFilm
    ? {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: detailFilm.tenPhim,
        image: detailFilm.hinhAnh,
        description: detailFilm.moTa,
        datePublished: detailFilm.ngayKhoiChieu,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: detailFilm.danhGia,
          bestRating: "10",
          ratingCount: "100",
        },
      }
    : undefined;

  /**
   * EN: Builds the Ant Design `Tabs` `items` for the showtime schedule: one tab per cinema chain
   * (heThongRapChieu), each rendering its cinema clusters (cumRapChieu) and their showtimes
   * (lichChieuPhim). The nested `map` calls intentionally mirror the API's existing 3-level
   * grouping (chain -> cluster -> showtime) rather than being reshaped with `groupBy` — the data
   * already arrives pre-grouped from the backend, so regrouping it here would add complexity
   * without removing real duplication, and risks subtly changing what's rendered in this
   * UI-critical path.
   * VI: Xây dựng `items` cho `Tabs` của Ant Design để hiển thị lịch chiếu: mỗi tab tương ứng một
   * hệ thống rạp (heThongRapChieu), bên trong hiển thị các cụm rạp (cumRapChieu) và suất chiếu
   * (lichChieuPhim) của cụm rạp đó. Các `map` lồng nhau cố tình đi theo đúng cấu trúc phân cấp 3
   * tầng có sẵn từ API (hệ thống rạp -> cụm rạp -> suất chiếu) thay vì tái cấu trúc bằng
   * `groupBy` — dữ liệu đã được nhóm sẵn từ backend, nên việc nhóm lại ở đây chỉ làm tăng độ phức
   * tạp mà không loại bỏ được sự trùng lặp thực sự, đồng thời có nguy cơ vô tình làm thay đổi kết
   * quả hiển thị ở phần giao diện quan trọng này.
   * @returns EN: an array of Ant Design `TabsProps["items"]` entries, or an empty array when
   * there are no cinema chains to show. VI: một mảng các phần tử `TabsProps["items"]` của Ant
   * Design, hoặc mảng rỗng nếu không có hệ thống rạp nào để hiển thị.
   */
  const renderScheduleTabItems = () => {
    const listCinemas = get(calendarMovieTheaterFilm, "heThongRapChieu", []);
    if (isEmpty(listCinemas)) return [];

    return map(listCinemas, (cinemaSystem: HeThongRapChieu) => ({
      label: (
        <div className="flex items-center gap-2 p-1">
          <img
            src={cinemaSystem.logo}
            alt={cinemaSystem.tenHeThongRap}
            className="w-8 h-8 object-contain rounded-full bg-white/10 p-1"
          />
          <span className="font-semibold text-text-primary text-sm">
            {cinemaSystem.tenHeThongRap}
          </span>
        </div>
      ),
      key: cinemaSystem.maHeThongRap,
      children: (
        <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2">
          {map(cinemaSystem.cumRapChieu, (cluster) => (
            <div
              key={cluster.maCumRap}
              className="bg-surface border border-border rounded-xl p-4 space-y-4"
            >
              <div className="flex items-start gap-3 border-b border-border pb-3">
                <img
                  src={cluster.hinhAnh || cinemaSystem.logo}
                  alt={cluster.tenCumRap}
                  className="w-12 h-12 object-cover rounded-lg border border-border"
                />
                <div>
                  <h3 className="font-bold text-text-primary text-base">
                    {cluster.tenCumRap}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-1">
                    {cluster.diaChi}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                  {t("detail:availableShowtimes")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {map(cluster.lichChieuPhim, (schedule) => {
                    const parsed = parseScheduleMovie(schedule.ngayChieuGioChieu);
                    return (
                      <button
                        key={schedule.maLichChieu}
                        onClick={() => handleBookingTicket(schedule.maLichChieu)}
                        className="group flex flex-col items-center bg-background hover:bg-primary border border-border hover:border-primary px-3.5 py-2 rounded-lg transition-all duration-200 shadow-sm hover:scale-105"
                      >
                        <span className="text-[11px] font-medium text-text-secondary group-hover:text-white/80">
                          📅 {parsed.date}
                        </span>
                        <span className="text-sm font-bold text-primary group-hover:text-white mt-0.5">
                          {parsed.time}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-16 transition-colors">
      <SEO
        title={detailFilm?.tenPhim ? `${detailFilm.tenPhim} - ${t("detail:showtimesTitle")}` : t("detail:showtimesTitle")}
        description={detailFilm?.moTa ? `${detailFilm.tenPhim} - ${detailFilm.moTa}` : t("detail:descriptionPlaceholder")}
        image={detailFilm?.hinhAnh}
        type="video.movie"
        jsonLd={movieJsonLd}
      />

      {/* Hero Backdrop Banner */}
      <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-30"
          style={{ backgroundImage: `url(${detailFilm?.hinhAnh})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

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
                    {formatLocalizedDate(detailFilm.ngayKhoiChieu, i18n.language)}
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

      {/* Showtimes & Cinemas Section */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 mt-12 space-y-12">
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary mb-6">
            {t("detail:showtimesTitle")}
          </h2>

          {!isEmpty(calendarMovieTheaterFilm?.heThongRapChieu) ? (
            <div className="bg-surface border border-border rounded-xl p-4 md:p-6 shadow-xl transition-colors">
              <Tabs
                tabPosition="top"
                className="detail-cinema-tabs"
                items={renderScheduleTabItems()}
              />
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-xl p-12 text-center">
              <Empty description={t("detail:noShowtimes")} />
            </div>
          )}
        </div>

        {/* TMDB Enriched Sections */}
        <CastSlider tmdbId={detailFilm?.maPhim} />
        <MovieGallery tmdbId={detailFilm?.maPhim} />
        <MovieReviews tmdbId={detailFilm?.maPhim} />
        <SimilarMovies tmdbId={detailFilm?.maPhim} />
      </div>

      {/* Trailer Video Modal */}
      <Modal
        title={detailFilm?.tenPhim}
        open={isTrailerOpen}
        onCancel={() => setIsTrailerOpen(false)}
        footer={null}
        width={800}
        centered
        destroyOnClose
      >
        {detailFilm?.trailer ? (
          <div className="relative pt-[56.25%] w-full rounded-lg overflow-hidden bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={detailFilm.trailer.replace("watch?v=", "embed/")}
              title={detailFilm.tenPhim}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <Empty description={t("detail:noTrailer")} />
        )}
      </Modal>
    </div>
  );
};

export default Detail;
