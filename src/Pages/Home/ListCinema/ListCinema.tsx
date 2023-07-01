import React from "react";
import { Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "Redux/store";
import { GET_ALL_CINEMA } from "Redux/constant/CinemaConstants";

type TabPosition = "left";

interface Tab {
  label: React.ReactNode;
  key: string;
}

const ListCinema: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const ListCinema = useSelector(
    (state: RootState) => state.ListCinema.arrListCinema
  );
  const [tabPosition] = React.useState<TabPosition>("left");

  const getListCinemaSaga = React.useCallback(() => {
    dispatch({
      type: GET_ALL_CINEMA,
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (ListCinema.length === 0) {
      getListCinemaSaga();
    }
  }, [ListCinema.length, getListCinemaSaga]);

  const renderCinemaTabs = React.useCallback(() => {
    return ListCinema.map((cinemaSystem) => {
      const tab: Tab = {
        label: (
          <img
            src={cinemaSystem.logo}
            alt={cinemaSystem.tenHeThongRap}
            className="rounded-full"
            width={50}
          />
        ),
        key: cinemaSystem.maHeThongRap,
      };
      return tab;
    });
  }, [ListCinema]);

  return <Tabs tabPosition={tabPosition} items={renderCinemaTabs()} />;
};

export default ListCinema;
