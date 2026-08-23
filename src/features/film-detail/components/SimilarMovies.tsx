import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Tag, Skeleton } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useGetSimilarMoviesQuery, getTMDBImageUrl } from "@cinefix/api-client";
import { APP_ROUTES } from "@cinefix/utils";

interface SimilarMoviesProps {
  tmdbId?: number | string;
}

/**
 * EN: Displays recommended / similar movies for film exploration.
 * VI: Hiển thị danh sách các bộ phim tương tự/gợi ý để người dùng khám phá.
 */
const SimilarMovies: FC<SimilarMoviesProps> = ({ tmdbId }) => {
  const navigate = useNavigate();

  const { data: similarMovies = [], isLoading } = useGetSimilarMoviesQuery(tmdbId || 0, {
    skip: !tmdbId,
  });

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  if (similarMovies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
        🍿 Phim Cùng Thể Loại Gợi Ý (Similar Movies)
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {similarMovies.slice(0, 6).map((movie: any) => {
          const posterUrl = getTMDBImageUrl(movie.poster_path, "w500");

          return (
            <Card
              key={movie.id}
              hoverable
              onClick={() => navigate(APP_ROUTES.DETAIL(movie.id))}
              cover={
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[11px] font-bold text-yellow-400 flex items-center gap-1">
                    <StarFilled /> {movie.vote_average ? movie.vote_average.toFixed(1) : "8.0"}
                  </div>
                </div>
              }
              className="bg-surface border-border overflow-hidden p-0"
              bodyStyle={{ padding: "10px" }}
            >
              <h4 className="font-bold text-text-primary text-xs line-clamp-1">
                {movie.title}
              </h4>
              <span className="text-[10px] text-text-secondary">
                {movie.release_date ? movie.release_date.substring(0, 4) : "2024"}
              </span>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarMovies;
