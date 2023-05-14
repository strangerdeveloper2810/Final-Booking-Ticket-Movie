import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Film } from "Redux/types/FilmType";
import { initialFilmList } from "./../../constanst/FilmList";
export type FilmState = {
  arrFilm: Film[];
};

const initialState: FilmState = {
  arrFilm: initialFilmList || [],
};

const FilmListSagaReducer = createSlice({
  name: "FilmListSagaReducer",
  initialState,
  reducers: {
    getAllFlim: (state: FilmState, action: PayloadAction<Film[]>) => {
      state.arrFilm = action.payload;
    },
  },
});

export const FilmListAction = FilmListSagaReducer.actions;

export default FilmListSagaReducer.reducer;
