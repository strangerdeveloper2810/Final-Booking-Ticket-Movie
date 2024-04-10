import { GET_FILM_DETAIL } from "Redux/constant/FilmConstants";
import { AppDispatch, RootState } from "Redux/store";
import { Button } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CinemaDetail from "./CinemaDetail";

const Detail: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  let { id }: any = useParams();

  const filmDetail = useSelector(
    (state: RootState) => state.FilmDetail.filmDetail
  );

  const getFilmDetail = React.useCallback(() => {
    dispatch({
      type: GET_FILM_DETAIL,
      maPhim: id,
    });
  }, []);
  React.useEffect(() => {
    getFilmDetail();
  }, []);

  return (
    <>
      <div className="film-info">
        <h2>Trang chủ | {filmDetail.tenPhim}</h2>
        <div className="flex space-x-2">
          <div
            className="film-outlook w-1/3 space-x-2 space-y-2"
            style={{
              background: "#fff",
              padding: "20px",
            }}
          >
            <div className="film-image  space-x-3 bg-gray-100">
              <img
                className="w-100 "
                src={filmDetail.hinhAnh}
                style={{
                  width: "100%",
                  height: "500px",
                }}
              ></img>
            </div>
          </div>
          <div className="">
            <h3>{filmDetail.tenPhim}</h3>
            <p>{filmDetail.moTa}</p>
            <p>Ngày khởi chiếu: {filmDetail.ngayKhoiChieu}</p>
            <div className="film-detail-buttons flex space-x-3">
              <Button>Xem trailer</Button>
              <Button>Mua vé ngay</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="theater-info">
        <CinemaDetail maPhim={id} />
      </div>
    </>
  );
};

export default Detail;
