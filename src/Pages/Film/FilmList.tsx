import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch } from "Redux/store";
import { Col, Row } from "antd";
import { RootState } from "Redux/store";
import { GET_ALL_FILM } from "Redux/constant/FilmConstants";
import FilmItem from "./FilmItem";
const FilmList: React.FC = () => {
  const filmList = useSelector(
    (state: RootState) => state.FlimListSaga.arrFilm
  );
  // const dispatch = useDispatch<AppDispatch>();
  // const getFilmSaga = () => {
  //   dispatch({
  //     type: GET_ALL_FILM,
  //   });
  // };
  // React.useEffect(() => {
  //   getFilmSaga();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const renderFilmItem = () => {
    return filmList.map((film, index) => (
      <Col
        xs={{ span: 5, offset: 1 }}
        lg={{ span: 6, offset: 2 }}
        key={film.maPhim}
      >
        <FilmItem filmItem={film} />
      </Col>
    ));
  };
  return (
    <React.Fragment>
      <Row gutter={[32, 32]}>{renderFilmItem()}</Row>
    </React.Fragment>
  );
};

export default React.memo(FilmList);
