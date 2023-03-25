import React from "react";
import { Card } from "antd";
import { Film } from "Redux/types/FilmType";
const { Meta } = Card;
export type ListFilmType = {
  film: Film;
};
const ListFilm: React.FC = ({ film }: ListFilmType) => {
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
      }
    >
      <Meta title="Europe Street beat" description="www.instagram.com" />
    </Card>
  );
};

export default ListFilm;
