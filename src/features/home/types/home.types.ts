import { Film } from "../redux/filmList/FilmType";
import { LstCumRap } from "../redux/cinema/ListCinemaType";

export interface FilmItemProps {
  filmItem: Film;
}

export interface ListMovieProps {
  cinema: LstCumRap;
}

export interface ListCinemaProps {
  className?: string;
}
