import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Banner } from "Redux/types/BannerType";
import { initialBanner } from "constants/banner";

export type BannerState = {
  arrBanner: Banner[];
};
const initialState: BannerState = {
  arrBanner: initialBanner,
};

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
