import { GET_ALL_CINEMA } from "Redux/constant/CinemaConstants";
import { AppDispatch, RootState } from "Redux/store";
import _ from "lodash";
import React, { Children, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DanhSachPhim,
  FilmDetail,
  ListCinema as ListCinemaType,
  LstCumRap,
} from "Redux/types/ListCinemaType";
import { Tabs } from "antd";

interface propsDetail {
  maPhim: any;
}

const CinemaDetail = (props: propsDetail) => {
  const { maPhim } = props;
  const dispatch: AppDispatch = useDispatch();
  const listCinema = useSelector(
    (state: RootState) => state.ListCinema.arrListCinema
  );
  useEffect(() => {
    dispatch({
      type: GET_ALL_CINEMA,
    });
  }, []);

  const renderCinemaTabs = React.useCallback(() => {
    return _.map(listCinema, (cinemaSystem: ListCinemaType) => {
      return {
        label: (
          <img
            src={cinemaSystem.logo}
            alt={cinemaSystem.tenHeThongRap}
            className="rounded-full"
            width={50}
          />
        ),
        key: cinemaSystem.maHeThongRap,
        // Children:
        Children: <h3>hi</h3>,
      };
    });
  }, []);
  return <Tabs tabPosition="left" items={renderCinemaTabs()} />;
};
export default React.memo(CinemaDetail);
