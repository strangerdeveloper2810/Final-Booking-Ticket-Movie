import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Film } from "./FilmType";
import { initialFilmList } from "./FilmListConstants";

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
