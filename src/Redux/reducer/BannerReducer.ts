import { createSlice } from "@reduxjs/toolkit";
import { Banner } from "Redux/types/BannerType";
import { initialBanner } from "constanst/banner";

export type BannerState = {
  arrBanner: Banner[];
};
const initialState: BannerState = {
  arrBanner: initialBanner,
};

const BannerReducer = createSlice({
  name: "BannerReducer",
  initialState,
  reducers: {},
});

export const {} = BannerReducer.actions;

export default BannerReducer.reducer;
