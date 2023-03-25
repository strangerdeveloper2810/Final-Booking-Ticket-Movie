import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "Redux/store";
import { Col, Row } from "antd";
import ListFilm from "./FilmList";
import { Film } from "Redux/types/FilmType";

const Films: React.FC = () => {
  const ListFilmState = useSelector(
    (state: RootState) => state.FlimListSaga.arrFilm
  );
  const renderListFilm = () => {
    return ListFilmState.map((filmItem, index) => (
      <Col span={8} key={index}>
        <ListFilm film={filmItem} />
      </Col>
    ));
  };
  return <Row gutter={16}>{renderListFilm()}</Row>;
};

export default React.memo(Films);
