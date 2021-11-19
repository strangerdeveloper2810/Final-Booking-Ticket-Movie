import React from "react";
import Slider from "react-slick";
import styleSlick from "./MultipleRowSlick.module.css";
import Film_Flip from "../Film/Film_Flip";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_FILM_DANG_CHIEU,
  SET_FILM_SAP_CHIEU,
} from "../../redux/actions/types/QuanLyPhimType";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styleSlick['slick-prev']}`}
      style={{ ...style, display: "block", right: '8px' }}
      onClick={onClick}
    >
    </div>

  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styleSlick['slick-prev']}`}

      style={{ ...style, display: "block", left: '-21px' }}
      onClick={onClick}
    >
    </div>
  );
}

const settings = {
  dots: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,
  infinity: true,
  arrows: true,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,

  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};


const MultipleRowSlick = (props) => {
  const dispatch = useDispatch();
  const { dangChieu, sapChieu } = useSelector(
    (state) => state.QuanLyPhimReducer
  );

  const renderFilms = () => {
    return props.arrFilm.slice(0, 12).map((item, index) => {
      return (
        <div className="mt-3" key={index}>
          <Film_Flip item={item} />
        </div>
      );
    });
  };
  let activeClassDC = dangChieu === true ? "active_Film" : "none_active_Film";

  let activeClassSC = sapChieu === true ? "active_Film" : "none_active_Film";

  console.log("activeSC", activeClassSC);


  return (
    <div>
      <button className={`${styleSlick[activeClassDC]} px-8 py-3 font-semibold rounded bg-gray-800 text-white mr-2`} onClick={() => {
        const action = { type: SET_FILM_DANG_CHIEU }
        dispatch(action);
      }}>PHIM ĐANG CHIẾU</button>

      <button className={`${styleSlick[activeClassSC]} px-8 py-3 font-semibold rounded bg-white text-gray-800 border-gray-800 border`} onClick={() => {
        const action = { type: SET_FILM_SAP_CHIEU }
        dispatch(action);
      }}>PHIM SẮP CHIẾU</button>


      <Slider {...settings} >
        {renderFilms()}
      </Slider>

    </div>
  );
};

export default MultipleRowSlick;
