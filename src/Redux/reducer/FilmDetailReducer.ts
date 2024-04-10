import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Detail } from 'Redux/types/FilmDetail';
import { constant } from 'lodash';
export type FilmDetailState = {
  filmDetail:Detail,
}
const initialState : FilmDetailState= {
filmDetail:{
  biDanh: "",
  dangChieu: false,
  danhGia: 0,
  hinhAnh:"",
  hot: false,
  maNhom:"",
  maPhim:0,
  moTa:"",
  ngayKhoiChieu: "",
  sapChieu:false,
  tenPhim:"",
  trailer: ""
   },
}

const FilmDetailReducer = createSlice({
  name: "FilmDetailReducer",
  initialState,
  reducers: {
    getFilmDetail:(state:FilmDetailState,action:PayloadAction<Detail>)=>{
      console.log("payload",action.payload);
       state.filmDetail = action.payload;
    }
  }
});

export const GetFilmDetailAction = FilmDetailReducer.actions

export default FilmDetailReducer.reducer;
