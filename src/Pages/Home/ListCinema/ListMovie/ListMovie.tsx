import React from "react";
import _ from "lodash"
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
  const renderDanhSachPhim = React.useMemo(()=> {
    const danhSachPhim = _.get(cinema, "danhSachPhim", [])
    return _.map(danhSachPhim,(movie: DanhSachPhim, index: number) => (
      <div className="wrap-movie" key={movie.maPhim}>
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
    ))
  }, [_.isEmpty(cinema)]);  
  return (
    <div className="wrap-list-movie">
      {renderDanhSachPhim}
    </div>
  );
};

export default ListMovie;
