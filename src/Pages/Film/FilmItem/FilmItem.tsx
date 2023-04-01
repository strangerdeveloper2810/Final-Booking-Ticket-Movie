import React from "react";
import { Card } from "antd";
import { Film } from "Redux/types/FilmType";
const { Meta } = Card;
interface FilmItemType {
  filmItem: Film;
}

const FilmItem: React.FC<FilmItemType> = ({ filmItem }: FilmItemType) => {
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<img alt={filmItem.biDanh} src={filmItem.hinhAnh} />}
    >
      <Meta title={filmItem.tenPhim} description={filmItem.moTa} />
    </Card>
  );
};

export default React.memo(FilmItem);
