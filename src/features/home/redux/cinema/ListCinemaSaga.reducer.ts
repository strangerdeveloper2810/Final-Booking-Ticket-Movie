import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ListCinema } from "./ListCinemaType";
import { initialListCinema } from "./ListCinemaConstants";

export type ListCinemaState = {
  arrListCinema: ListCinema[];
};

const initialState: ListCinemaState = {
  arrListCinema: initialListCinema || [],
};

/**
 * EN: Redux Toolkit slice holding the cinema-system list state. The `getAllListCinema`
 * reducer replaces the stored list with the payload; the direct property assignment below
 * is an Immer draft mutation (RTK's standard idiom), not a plain object mutation, so it is
 * intentionally left as-is rather than rewritten with lodash.
 * VI: Slice Redux Toolkit lưu trạng thái danh sách hệ thống rạp. Reducer
 * `getAllListCinema` thay thế danh sách hiện có bằng payload; phép gán trực tiếp bên dưới
 * là một mutation trên Immer draft (idiom chuẩn của RTK), không phải mutation object thông
 * thường, nên được giữ nguyên thay vì viết lại bằng lodash.
 */
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
