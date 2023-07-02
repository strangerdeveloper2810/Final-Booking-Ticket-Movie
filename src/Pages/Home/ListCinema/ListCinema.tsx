import React from "react";
import { Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "Redux/store";
import { GET_ALL_CINEMA } from "Redux/constant/CinemaConstants";
import {
  ListCinema as ListCinemaType,
  LstCumRap,
} from "Redux/types/ListCinemaType";

type TabPosition = "left";

const ListCinema: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const listCinema = useSelector(
    (state: RootState) => state.ListCinema.arrListCinema
  );
  const [tabPosition] = React.useState<TabPosition>("left");

  const getListCinemaSaga = React.useCallback(() => {
    dispatch({
      type: GET_ALL_CINEMA,
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (listCinema.length === 0) {
      getListCinemaSaga();
    }
  }, [listCinema.length, getListCinemaSaga]);

  const renderCinemaTabs = React.useCallback(() => {
    return listCinema.map((cinemaSystem: ListCinemaType) => {
      const tab = {
        label: (
          <img
            src={cinemaSystem.logo}
            alt={cinemaSystem.tenHeThongRap}
            className="rounded-full"
            width={50}
          />
        ),
        key: cinemaSystem.maHeThongRap,
        children: (
          <>
            {/* {cinemaSystem.lstCumRap.map((clusterCinema:LstCumRap) => {
              const clusterCinemaTab = {
                label: (
                  <>
                    <img
                      src={clusterCinema.hinhAnh}
                      alt={cinemaSystem.tenHeThongRap}
                      className="rounded-full"
                      width={50}
                    />
                    <div>{clusterCinema.tenCumRap}</div>
                  </>
                ),
                key: clusterCinema.maCumRap,
              };
              return clusterCinemaTab;
            })} */}
            Hello
          </>
        ),
      };
      return tab;
    });
  }, [listCinema]);

  return <Tabs tabPosition={tabPosition} items={renderCinemaTabs()} />;
};

export default ListCinema;
