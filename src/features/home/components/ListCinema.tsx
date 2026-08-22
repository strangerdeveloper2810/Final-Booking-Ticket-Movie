import React, { FC, useMemo } from "react";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import ListMovie from "./ListMovie";
import {
  ListCinema as ListCinemaType,
  LstCumRap,
} from "../redux/cinema/ListCinemaType";
import { useGetCinemasQuery } from "shared/services/movieApi";

const ListCinema: FC = () => {
  const { data: listCinema = [] } = useGetCinemasQuery();
  const { t } = useTranslation(["home", "common"]);

  const tabItems = useMemo(() => {
    if (!listCinema || !Array.isArray(listCinema)) return [];
    return listCinema.map((cinemaSystem: ListCinemaType) => ({
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
          items={(cinemaSystem.lstCumRap || []).map((clusterCinema: LstCumRap, index: number) => ({
            label: (
              <div className="text-left py-1 pr-2 max-w-[200px]">
                <p className="font-bold text-text-primary text-sm line-clamp-1">
                  {clusterCinema.tenCumRap}
                </p>
                <p className="text-xs text-text-secondary line-clamp-1">
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
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
          {t("home:cinemaTitle")}
        </h2>
        <div className="h-1 w-16 bg-primary rounded-full mt-2" />
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 md:p-6 shadow-xl transition-colors">
        <Tabs
          tabPosition="left"
          className="main-cinema-tabs"
          items={tabItems}
        />
      </div>
    </section>
  );
};

export default ListCinema;
