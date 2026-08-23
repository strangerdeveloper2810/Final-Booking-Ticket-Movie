import { type FC } from "react";
import { Avatar, Skeleton, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useGetMovieCreditsQuery, getTMDBImageUrl } from "@cinefix/api-client";

interface CastSliderProps {
  tmdbId?: number | string;
}

/**
 * EN: Displays the Cast & Crew avatar slider showing real actor profile photos,
 * real names, and movie character names.
 * VI: Hiển thị slider Dàn Diễn Viên với ảnh đại diện thật của diễn viên,
 * tên thật và tên nhân vật trong phim.
 */
const CastSlider: FC<CastSliderProps> = ({ tmdbId }) => {
  const { data: credits, isLoading } = useGetMovieCreditsQuery(tmdbId || 0, {
    skip: !tmdbId,
  });

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  const castList = credits?.cast || [];

  if (castList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
        <span>🎭</span> Dàn Diễn Viên (Cast & Crew)
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20">
        {castList.slice(0, 12).map((actor: any) => {
          const profileUrl = actor.profile_path
            ? getTMDBImageUrl(actor.profile_path, "w500")
            : undefined;

          return (
            <div
              key={actor.id || actor.credit_id}
              className="flex flex-col items-center text-center w-28 shrink-0 bg-surface p-3 rounded-xl border border-border hover:border-primary transition-all duration-300 shadow-sm"
            >
              <Avatar
                size={64}
                src={profileUrl}
                icon={<UserOutlined />}
                className="bg-primary/20 border-2 border-primary/30 mb-2 shadow"
              />
              <span className="font-bold text-xs text-text-primary line-clamp-1 w-full">
                {actor.name}
              </span>
              <span className="text-[10px] text-text-secondary line-clamp-1 w-full mt-0.5">
                {actor.character ? `vai ${actor.character}` : "Diễn viên"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CastSlider;
