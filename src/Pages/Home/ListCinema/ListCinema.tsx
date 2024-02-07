import React from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash"
import { AppDispatch, RootState } from "Redux/store";
import { Tabs } from "antd";
import { GET_ALL_CINEMA } from "Redux/constant/CinemaConstants";
import ListMovie from "./ListMovie";
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
    if (_.isEmpty(listCinema)) {
      getListCinemaSaga();
    }
  }, [_.isEmpty(listCinema), getListCinemaSaga]);

  const renderMovieByCinema = React.useCallback((cinema: LstCumRap) => {
    return <ListMovie cinema={cinema} />;
  }, []);

  const renderCinemaTabs = React.useCallback(() => {
    return _.map(listCinema, (cinemaSystem: ListCinemaType) => {
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
          <Tabs
            tabPosition={tabPosition}
            items={cinemaSystem.lstCumRap.map(
              (clusterCinema: LstCumRap, index: number) => {
                const clusterCinemaTab = {
                  label: (
                    <>
                      <img
                        src={cinemaSystem.logo}
                        alt={clusterCinema.tenCumRap}
                        className="rounded-full"
                        width={50}
                      />
                      <div>{clusterCinema.tenCumRap}</div>
                    </>
                  ),
                  key: `${index + 1}`,
                  children: renderMovieByCinema(clusterCinema),
                };
                return clusterCinemaTab;
              }
            )}
          />
        ),
      };
      return tab;
    });
  }, [listCinema, tabPosition, renderMovieByCinema]);

  return <Tabs tabPosition={tabPosition} items={renderCinemaTabs()} />;
};

export default React.memo(ListCinema);
