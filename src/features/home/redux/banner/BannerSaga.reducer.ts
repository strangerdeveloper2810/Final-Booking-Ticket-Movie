import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Banner } from "./BannerType";
import { initialBanner } from "./BannerConstants";

export type BannerState = {
  arrBanner: Banner[];
};

const initialState: BannerState = {
  arrBanner: initialBanner,
};

/**
 * EN: Redux Toolkit slice holding the banner list state. The `getAllBanner` reducer
 * replaces the stored list with the payload; the direct property assignment below is an
 * Immer draft mutation (RTK's standard idiom), not a plain object mutation, so it is
 * intentionally left as-is rather than rewritten with lodash.
 * VI: Slice Redux Toolkit lưu trạng thái danh sách banner. Reducer `getAllBanner` thay thế
 * danh sách hiện có bằng payload; phép gán trực tiếp bên dưới là một mutation trên Immer
 * draft (idiom chuẩn của RTK), không phải mutation object thông thường, nên được giữ
 * nguyên thay vì viết lại bằng lodash.
 */
const BannerSagaReducer = createSlice({
  name: "Banner",
  initialState,
  reducers: {
    getAllBanner(state: BannerState, action: PayloadAction<Banner[]>) {
      state.arrBanner = action.payload;
    },
  },
});

export const BannerSagaAction = BannerSagaReducer.actions;
export default BannerSagaReducer.reducer;
