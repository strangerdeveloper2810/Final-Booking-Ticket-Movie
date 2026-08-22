import React, { FC, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import { Tabs } from "antd";
import { AppDispatch, RootState } from "app/store";
import { GET_ALL_CINEMA } from "../redux/cinema/CinemaActionTypes";
import ListMovie from "./ListMovie";
import {
  ListCinema as ListCinemaType,
  LstCumRap,
} from "../redux/cinema/ListCinemaType";

const ListCinema: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const listCinema = useSelector(
    (state: RootState) => state.ListCinema.arrListCinema
  );

  useEffect(() => {
    if (isEmpty(listCinema)) {
      dispatch({ type: GET_ALL_CINEMA });
    }
  }, [listCinema, dispatch]);

  const renderCinemaTabs = useCallback(() => {
    return map(listCinema, (cinemaSystem: ListCinemaType) => ({
      label: (
        <div className="flex items-center justify-center p-1">
          <img
            src={cinemaSystem.logo}
            alt={cinemaSystem.tenHeThongRap}
            className="w-10 h-10 object-contain rounded-full bg-white/10 p-1 hover:scale-110 transition-transform"
          />
        </div>
      ),
      key: cinemaSystem.maHeThongRap,
      children: (
        <Tabs
          tabPosition="left"
          className="cinema-cluster-tabs"
          items={cinemaSystem.lstCumRap.map((clusterCinema: LstCumRap, index: number) => ({
            label: (
              <div className="text-left py-1 pr-2 max-w-[200px]">
                <p className="font-bold text-[#F5F6FA] text-sm line-clamp-1">
                  {clusterCinema.tenCumRap}
                </p>
                <p className="text-xs text-[#9AA0B4] line-clamp-1">
                  {clusterCinema.diaChi}
                </p>
              </div>
            ),
            key: `${index + 1}`,
            children: <ListMovie cinema={clusterCinema} />,
          }))}
        />
      ),
    }));
  }, [listCinema]);

  return (
    <section id="cinemas" className="py-10">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#F5F6FA] tracking-tight">
          Hệ Thống Rạp Chiếu
        </h2>
        <div className="h-1 w-16 bg-[#F2545B] rounded-full mt-2" />
      </div>

      <div className="bg-[#151822] border border-[#262B3A] rounded-xl p-4 md:p-6 shadow-xl">
        <Tabs
          tabPosition="left"
          className="main-cinema-tabs"
          items={renderCinemaTabs()}
        />
      </div>
    </section>
  );
};

export default ListCinema;
