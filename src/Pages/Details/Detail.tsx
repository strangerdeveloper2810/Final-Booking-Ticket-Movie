import _ from "lodash"
import React from "react";
import { useParams } from "react-router-dom";
import { PlayCircleOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import { FilmDetail } from "Redux/types/FilmDetail";
import { ListCinema, LstCumRap } from "Redux/types/ListCinemaType"
import filmDetailServiceInstance from "services/FlimDetailService";
import managementServiceInstance from "services/ManagementMovieService";

const { Meta } = Card;
type TabPosition = "left";

const Detail: React.FC = () => {
  const { id } = useParams();

  const [detailFilm, setDetailFilm] = React.useState<FilmDetail>();

  const [calendarMovieTheaterFilm, setCalendarMovieTheaterFilm] = React.useState<ListCinema[]>([]);

  const [tabPosition] = React.useState<TabPosition>("left");

  React.useEffect(() => {
    if (id) {
      fetchDetailFilm();
      fetchCalendarFilm();
    }
  }, []);

  const fetchDetailFilm = async () => {
    const param = {
      maPhim: id
    }

    const res = await filmDetailServiceInstance.getFilmDetail(param);

    try {
      if (_.get(res, "status", 400)) {
        setDetailFilm(_.get(res, "data.content", {}))
      }
    }
    catch (error) {
      console.log("request failed", error);
    }
  }

  const fetchCalendarFilm = async () => {
    const param = {
      maPhim: id
    }

    const res = await managementServiceInstance.getInfoCanlendarFilm(param);
    try {
      if (_.get(res, "status", 400 || 500)) {
        setCalendarMovieTheaterFilm([
          _.get(res, "data.content", [])
        ])
      }
    }
    catch (error) {
      console.log("error", error);
    }
  }

  // const renderCinemaTabs = React.useCallback(() => {
  //   return _.map(calendarMovieTheaterFilm, (cinemaSystem: ListCinema) => {
  //     const tab = {
  //       label: (
  //         <img
  //           src={cinemaSystem.logo}
  //           alt={cinemaSystem.tenHeThongRap}
  //           className="rounded-full"
  //           width={50}
  //         />
  //       ),
  //       key: cinemaSystem.maHeThongRap,
  //       children: (
  //         <Tabs
  //           tabPosition={tabPosition}
  //           items={_.map(cinemaSystem.lstCumRap, (clusterCinema: LstCumRap, index: number) => {
  //             const clusterCinemaTab = {
  //               label: (
  //                 <>
  //                   <img
  //                     src={cinemaSystem.logo}
  //                     alt={clusterCinema.tenCumRap}
  //                     className="rounded-full"
  //                     width={50}
  //                   />
  //                   <div>{clusterCinema.tenCumRap}</div>
  //                 </>
  //               ),
  //               key: `${index + 1}`,
  //               // children: renderMovieByCinema(clusterCinema),
  //             };
  //             return clusterCinemaTab;
  //           })}
  //         />
  //       ),
  //     };
  //     return tab;
  //   });
  // }, [calendarMovieTheaterFilm, tabPosition]);


  const renderCinemaTabs = React.useCallback(() => {
    return _.map(calendarMovieTheaterFilm, (cinemaSystem: ListCinema) => {
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
            items={_.map(cinemaSystem.lstCumRap, (clusterCinema: LstCumRap, index: number) => {
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
                // children: renderMovieByCinema(clusterCinema),
              };
              return clusterCinemaTab;
            })}
          />
        ),
      };
      return tab;
    });
  }, [calendarMovieTheaterFilm, tabPosition]);


  console.log(calendarMovieTheaterFilm);

  return (
    <div className="">
      <Card
        style={{ width: 300 }}
        cover={
          <img
            alt={detailFilm?.tenPhim}
            src={detailFilm?.hinhAnh}
          />
        }
        actions={[
          <PlayCircleOutlined key="play trailer" onClick={() => window.open(`${detailFilm?.trailer}`)} />
        ]}
      >
        <Meta
          title={detailFilm?.tenPhim}
          description={detailFilm?.moTa}
        />
      </Card>

      <Tabs tabPosition={tabPosition} items={renderCinemaTabs()} />;
    </div>

  );
};

export default Detail;
