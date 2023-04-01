import React from "react";
import { useSelector } from "react-redux";
import { Col, Row } from "antd";
import { RootState } from "Redux/store";
import FilmItem from "./FilmItem";
const FilmList: React.FC = () => {
  const filmList = useSelector(
    (state: RootState) => state.FlimListSaga.arrFilm
  );
  const renderFilmItem = () => {
    return filmList.map((film, index) => (
      <Col span={8} key={film.maPhim}>
        <FilmItem filmItem={film} />
      </Col>
    ));
  };
  return (
    <React.Fragment>
      <Row gutter={16}>{renderFilmItem()}</Row>
    </React.Fragment>
  );
};

export default React.memo(FilmList);
