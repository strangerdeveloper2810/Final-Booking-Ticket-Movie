import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ListCinema } from "./ListCinemaType";
import { initialListCinema } from "./ListCinemaConstants";

export type ListCinemaState = {
  arrListCinema: ListCinema[];
};

const initialState: ListCinemaState = {
  arrListCinema: initialListCinema || [],
};

const ListCinemaSagaReducer = createSlice({
  name: "ListCinemaSagaReducer",
  initialState,
  reducers: {
    getAllListCinema: (
      state: ListCinemaState,
      action: PayloadAction<ListCinema[]>
    ) => {
      state.arrListCinema = action.payload;
    },
  },
});

export const ListCinemaAction = ListCinemaSagaReducer.actions;
export default ListCinemaSagaReducer.reducer;
