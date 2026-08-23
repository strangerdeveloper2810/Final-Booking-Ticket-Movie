import { type FC } from "react";
import { Tag } from "antd";

export interface Genre {
  id: string;
  name: string;
  emoji: string;
}

export const MOVIE_GENRES: Genre[] = [
  { id: "ALL", name: "Tất Cả Phim", emoji: "🎬" },
  { id: "ACTION", name: "Hành Động", emoji: "💥" },
  { id: "COMEDY", name: "Hài Hước", emoji: "😂" },
  { id: "DRAMA", name: "Tâm Lý", emoji: "🎭" },
  { id: "HORROR", name: "Kinh Dị", emoji: "👻" },
  { id: "SCIFI", name: "Viễn Tưởng", emoji: "🚀" },
  { id: "ROMANCE", name: "Tình Cảm", emoji: "❤️" },
  { id: "ANIMATION", name: "Hoạt Hình", emoji: "🦄" },
];

interface GenreFilterBarProps {
  selectedGenre: string;
  onSelectGenre: (genreId: string) => void;
}

/**
 * EN: Genre filter tags component for filtering movies on the homepage.
 * VI: Component nhãn lọc thể loại phim trên trang chủ.
 */
const GenreFilterBar: FC<GenreFilterBarProps> = ({ selectedGenre, onSelectGenre }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {MOVIE_GENRES.map((genre) => {
        const isSelected = selectedGenre === genre.id;

        return (
          <button
            key={genre.id}
            onClick={() => onSelectGenre(genre.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shrink-0 border ${
              isSelected
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105"
                : "bg-surface text-text-secondary border-border hover:border-primary/50 hover:text-text-primary"
            }`}
          >
            <span>{genre.emoji}</span>
            <span>{genre.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default GenreFilterBar;
