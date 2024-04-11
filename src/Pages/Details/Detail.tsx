import _ from "lodash"
import React from "react";
import { useParams } from "react-router-dom";
import { FilmDetail } from "Redux/types/FilmDetail";
import filmDetailServiceInstance from "services/FlimDetailService";


const Detail: React.FC = () => {
  const { id } = useParams();

  const [detailFilm, setDetailFilm] = React.useState<FilmDetail | {}>({});

  React.useEffect(() => {
    if (id) {
      fetchDetailFilm();
    }
  }, []);

  const fetchDetailFilm = async () => {
    const res = await filmDetailServiceInstance.getFilmDetail(id);

    try {
      if (_.get(res, "status", 400)) {
        setDetailFilm(_.get(res, "data.content", {}))
      }
    }
    catch (error) {
      console.log("request failed", error);
    }
  }

  console.log(detailFilm);

  return (
    <div>

    </div>

  );
};

export default Detail;
