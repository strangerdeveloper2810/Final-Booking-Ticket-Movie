import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Tag, Rate, Empty, Spin } from "antd";
import { SearchOutlined, StarFilled, CalendarOutlined, FireOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { fetchTMDBMovieSearch, TMDBMovie, getTMDBImageUrl } from "@cinefix/api-client";
import { http, GROUP_ID, APP_ROUTES, formatLocalizedDate } from "@cinefix/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: FC<SearchModalProps> = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cybersoftMovies, setCybersoftMovies] = useState<any[]>([]);
  const [tmdbMovies, setTmdbMovies] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["home", "common"]);

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setTmdbMovies([]);
      return;
    }

    const fetchAllCybersoft = async () => {
      try {
        const res = await http.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${GROUP_ID}`);
        if (res?.data?.content) {
          setCybersoftMovies(res.data.content);
        }
      } catch (e) {
        console.error("Failed to load Cybersoft movie list for search:", e);
      }
    };
    fetchAllCybersoft();
  }, [open]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setTmdbMovies([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await fetchTMDBMovieSearch(searchTerm.trim(), i18n.language);
        if (results && (results as any).id) {
          setTmdbMovies([results as any]);
        } else {
          const tmdbLang = i18n.language === "vi" ? "vi-VN" : "en-US";
          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
              searchTerm.trim()
            )}&language=${tmdbLang}&api_key=4f4ed37c0266d140f686ee11fe3ac57e`
          );
          if (res.ok) {
            const data = await res.json();
            setTmdbMovies(data?.results?.slice(0, 6) || []);
          }
        }
      } catch (e) {
        console.error("TMDB search error:", e);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, i18n.language]);

  const filteredCybersoft = searchTerm.trim()
    ? cybersoftMovies.filter((m) =>
        m.tenPhim?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : cybersoftMovies.slice(0, 4);

  const handleSelectMovie = (movieId: number | string) => {
    onClose();
    navigate(APP_ROUTES.DETAIL(movieId));
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      destroyOnClose
      closeIcon={null}
      className="search-modal-custom"
    >
      <div className="space-y-4 pt-2">
        <Input
          prefix={<SearchOutlined className="text-xl text-primary mr-2" />}
          placeholder={t("common:searchPlaceholder", {
            defaultValue: "Tìm kiếm tên phim, diễn viên, từ khóa... (Esc để thoát)",
          })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
          autoFocus
          className="rounded-xl bg-background border-border text-base py-3"
          suffix={
            <Tag color="red" className="font-mono text-xs cursor-pointer">
              ESC
            </Tag>
          }
        />

        <div className="max-h-[500px] overflow-y-auto pr-1 custom-scrollbar space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FireOutlined className="text-primary text-sm" />
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-text-secondary">
                {t("home:cybersoftMovies", { defaultValue: "Phim Rạp Đang Có Lịch Chiếu" })}
              </h4>
            </div>

            {filteredCybersoft.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCybersoft.slice(0, 6).map((movie) => (
                  <div
                    key={movie.maPhim}
                    onClick={() => handleSelectMovie(movie.maPhim)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-surface hover:bg-surface-hover border border-border hover:border-primary/50 transition-all cursor-pointer group"
                  >
                    <img
                      src={movie.hinhAnh}
                      alt={movie.tenPhim}
                      className="w-14 h-20 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://picsum.photos/200/300";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                        {movie.tenPhim}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <Tag color="#F2545B" className="font-semibold text-[10px] m-0">
                          2D
                        </Tag>
                        <span className="text-xs text-secondary font-bold flex items-center gap-1">
                          <StarFilled className="text-xs text-[#FFC857]" />
                          {movie.danhGia || 9}/10
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary truncate mt-1">
                        📅 {movie.ngayKhoiChieu ? formatLocalizedDate(movie.ngayKhoiChieu, i18n.language) : "Đang chiếu"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-secondary italic">Không tìm thấy phim rạp khớp với từ khóa.</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <StarFilled className="text-[#FFC857] text-sm" />
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-text-secondary">
                  TMDB Global Database
                </h4>
              </div>
              {isLoading && <Spin size="small" />}
            </div>

            {tmdbMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tmdbMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie.id)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-surface hover:bg-surface-hover border border-border hover:border-primary/50 transition-all cursor-pointer group"
                  >
                    <img
                      src={getTMDBImageUrl(movie.poster_path, "w500")}
                      alt={movie.title}
                      className="w-14 h-20 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://picsum.photos/200/300";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                        {movie.title}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <Tag color="#FFC857" className="font-bold text-black text-[10px] m-0">
                          ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "8.0"}
                        </Tag>
                      </div>
                      <p className="text-[11px] text-text-secondary truncate mt-1">
                        📅 {movie.release_date ? formatLocalizedDate(movie.release_date, i18n.language) : "2024"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm.trim() && !isLoading ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy phim TMDB thích hợp." />
            ) : (
              <p className="text-xs text-text-secondary italic">Nhập từ khóa bất kỳ để khám phá dữ liệu phim điện ảnh thế giới từ TMDB.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
