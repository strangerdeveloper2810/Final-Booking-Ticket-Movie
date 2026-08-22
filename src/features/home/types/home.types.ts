import { Film } from "../redux/filmList/FilmType";
import { LstCumRap } from "../redux/cinema/ListCinemaType";

// EN: Props for the FilmItem card component — the film record it should render.
// VI: Props cho component thẻ FilmItem — bản ghi phim cần hiển thị.
export interface FilmItemProps {
  filmItem: Film;
}

// EN: Props for the ListMovie component — a single cinema cluster whose scheduled films
// (and showtimes) should be listed.
// VI: Props cho component ListMovie — một cụm rạp với các phim (và suất chiếu) đang có
// lịch chiếu cần được liệt kê.
export interface ListMovieProps {
  cinema: LstCumRap;
}

// EN: Props for the ListCinema section component; `className` is an optional styling hook.
// VI: Props cho component mục ListCinema; `className` là hook CSS tùy chọn.
export interface ListCinemaProps {
  className?: string;
}
