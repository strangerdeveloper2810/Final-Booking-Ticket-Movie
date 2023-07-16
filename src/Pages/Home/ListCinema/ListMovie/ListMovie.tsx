import React from "react";
import {
  DanhSachPhim,
  LstCumRap,
  LstLichChieuTheoPhim,
} from "Redux/types/ListCinemaType";
import { formatScheduleMovie } from "util/common";

type ListMovieType = {
  cinema: LstCumRap;
};

const ListMovie: React.FC<ListMovieType> = ({ cinema }) => {
  return (
    <div className="wrap-list-movie">
      {cinema.danhSachPhim.map((movie: DanhSachPhim, index: number) => (
        <div className="wrap-movie" key={index}>
          <img src={movie.hinhAnh} alt={movie.tenPhim} />
          <div className="movie-info">
            <div className="movie-name">{movie.tenPhim}</div>
            <div className="schedule">
              {movie.lstLichChieuTheoPhim.map(
                (schedule: LstLichChieuTheoPhim, index: number) => (
                  <div className="item" key={index}>
                    {formatScheduleMovie(schedule.ngayChieuGioChieu)}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ListMovie);
