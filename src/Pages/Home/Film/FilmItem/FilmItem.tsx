import React from "react";
import { useNavigate } from "react-router-dom";
import { Film } from "Redux/types/FilmType";
import Star from "Components/Star";

interface FilmItemType {
  filmItem: Film;
}

const FilmItem: React.FC<FilmItemType> = ({ filmItem }: FilmItemType) => {
  const navigate = useNavigate();

  const handleClick = React.useCallback(() => {
    navigate(`/detail/${filmItem.maPhim}`);
  }, [navigate, filmItem.maPhim]);

  return (
    <div className="w-10/12 ml-5 mt-10 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <img
        className="rounded-t-lg"
        src={filmItem.hinhAnh}
        alt={filmItem.biDanh}
        style={{ width: "350px", height: "350px", objectFit: "cover" }}
      />

      <div className="px-5 pb-5">
        <h5 className="filmTitle text-sm font-semibold tracking-tight text-gray-900 dark:text-white mt-2">
          {filmItem.tenPhim}
        </h5>

        <Star />

        <div className="flex items-center justify-center">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleClick}
          >
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FilmItem);
