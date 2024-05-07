import _ from "lodash"
import React from "react";
import { useParams } from "react-router-dom";
import { PlayCircleOutlined, StarFilled } from '@ant-design/icons';
import { Card, Tabs, Tag } from 'antd';
import { toast } from "react-toastify";
import { FilmDetail } from "Redux/types/FilmDetail";
import { CalendarMovieTheaterFilm, HeThongRapChieu } from "Redux/types/CalendarFilmType";
import filmDetailServiceInstance from "services/FlimDetailService";
import managementServiceInstance from "services/ManagementMovieService";
import { formatScheduleMovie } from "util/common";
const { Meta } = Card;
type TabPosition = "left";

const Detail: React.FC = () => {
  const { id } = useParams();

  const [detailFilm, setDetailFilm] = React.useState<FilmDetail>();

  const [calendarMovieTheaterFilm, setCalendarMovieTheaterFilm] = React.useState<CalendarMovieTheaterFilm>();

  const [tabPosition] = React.useState<TabPosition>("left");

  React.useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      if (id) {
        const detailRes = await fetchDetailFilm();
        if (_.get(detailRes, "status", 400)) {
          setDetailFilm(_.get(detailRes, "data.content", {}));
        }

        const calendarRes = await fetchCalendarFilm();
        if (_.get(calendarRes, "status", 400 || 500)) {
          setCalendarMovieTheaterFilm(_.get(calendarRes, "data.content", []));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDetailFilm = async () => {
    const param = {
      maPhim: id
    }

    return await filmDetailServiceInstance.getFilmDetail(param);
  }

  const fetchCalendarFilm = async () => {
    const param = {
      maPhim: id
    }

    return await managementServiceInstance.getInfoCanlendarFilm(param);
  }

  const renderFilmCalendar = () => {
    const calendarSystem = _.get(calendarMovieTheaterFilm, "heThongRapChieu", [])
    return _.map(calendarSystem, (calendar: HeThongRapChieu) => {
      const tab = {
        label: (
          <img
            src={_.get(calendar, "logo", "")}
            alt={_.get(calendar, "maHeThongRap", "")}
            className="rounded-full"
            width={50}
          />
        ),
        key: calendar.maHeThongRap,
        children: (
          <Tabs
            tabPosition={tabPosition}
            items={_.map(_.get(calendar, "cumRapChieu", []), (theaterComplex, index) => {
              const clusterCinemaTab = {
                label: (
                  <>
                    <img src={_.get(theaterComplex, "hinhAnh", "")} alt={_.get(theaterComplex, "tenCumRap", "")}
                      className="rounded-full"
                      width={50}
                    />
                    <Tag color="green" className="mt-5">{_.get(theaterComplex, "tenCumRap", "")}</Tag>
                  </>
                ),
                key: `${index + 1}`,
                children: (
                  <>
                    {
                      _.map(_.get(theaterComplex, "lichChieuPhim", []), (theater) => (
                        <>
                          <Tag color="magenta" >{_.get(theater, "tenRap", "")}</Tag>
                          <Tag color="cyan">{formatScheduleMovie(_.get(theater, "ngayChieuGioChieu", ""))}</Tag>
                        </>
                      ))
                    }
                  </>
                )
              }
              return clusterCinemaTab;
            })}
          />
        )
      };
      return tab;
    })
  }

  const playTrailerFilm = () => {
    if (detailFilm?.trailer.includes("https://www.youtube.com/watch?")) {
      window.open(`${detailFilm?.trailer}`)
    } else {
      toast.error("Not Trailer")
    }
  }

  return (
    <div>
      <div className="flex justify-center mt-6">
        <Card
          className="w-96 mb-10"
          cover={
            <img
              alt={detailFilm?.tenPhim}
              src={detailFilm?.hinhAnh}
              className="h-fit"
            />
          }
          actions={[
            <PlayCircleOutlined key="play trailer" onClick={playTrailerFilm} />
          ]}>
          <Tag color="geekblue">Tên Phim: {_.get(detailFilm, "tenPhim", "")}</Tag>

        </Card>
        <div>

        </div>
      </div>
      <Tabs tabPosition={tabPosition} items={renderFilmCalendar()} />
    </div>

  );
};

export default Detail;
