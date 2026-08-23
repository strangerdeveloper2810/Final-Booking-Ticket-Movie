import { type FC } from "react";
import { Card, Avatar, Rate, Skeleton } from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetMovieReviewsQuery, getTMDBImageUrl } from "@cinefix/api-client";

interface MovieReviewsProps {
  tmdbId?: number | string;
}

/**
 * EN: Displays audience reviews and ratings for a movie.
 * VI: Hiển thị đánh giá và nhận xét của khán giả về bộ phim.
 */
const MovieReviews: FC<MovieReviewsProps> = ({ tmdbId }) => {
  const { data: reviews = [], isLoading } = useGetMovieReviewsQuery(tmdbId || 0, {
    skip: !tmdbId,
  });

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 3 }} />;
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
        <MessageOutlined className="text-primary" /> Đánh Giá Khán Giả ({reviews.length})
      </h3>

      <div className="space-y-3">
        {reviews.slice(0, 4).map((review: any) => {
          const authorDetails = review.author_details || {};
          const avatarPath = authorDetails.avatar_path;
          const avatarUrl = avatarPath
            ? avatarPath.startsWith("/http")
              ? avatarPath.substring(1)
              : getTMDBImageUrl(avatarPath, "w500")
            : undefined;

          const ratingScore = authorDetails.rating ? authorDetails.rating / 2 : 4.5;

          return (
            <Card
              key={review.id}
              className="bg-surface border-border shadow-sm hover:border-primary/50 transition-all"
            >
              <div className="flex gap-4 items-start">
                <Avatar
                  size={44}
                  src={avatarUrl}
                  icon={<UserOutlined />}
                  className="bg-primary/20 shrink-0 border border-primary/30"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-text-primary text-sm">
                      {review.author || "Khán Giả Phim"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Rate disabled allowHalf value={ratingScore} className="text-xs text-yellow-500" />
                      <span className="text-xs text-text-secondary">
                        {review.created_at ? dayjs(review.created_at).format("DD/MM/YYYY") : ""}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                    {review.content}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MovieReviews;
