import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Film } from "./FilmType";
import { initialFilmList } from "./FilmListConstants";

export type FilmState = {
  arrFilm: Film[];
};

const initialState: FilmState = {
  arrFilm: initialFilmList || [],
};

/**
 * EN: Redux Toolkit slice holding the film list state. The `getAllFlim` reducer replaces
 * the stored list with the payload; the direct property assignment below is an Immer
 * draft mutation (RTK's standard idiom), not a plain object mutation, so it is
 * intentionally left as-is rather than rewritten with lodash.
 * VI: Slice Redux Toolkit lưu trạng thái danh sách phim. Reducer `getAllFlim` thay thế
 * danh sách hiện có bằng payload; phép gán trực tiếp bên dưới là một mutation trên Immer
 * draft (idiom chuẩn của RTK), không phải mutation object thông thường, nên được giữ
 * nguyên thay vì viết lại bằng lodash.
 */
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
