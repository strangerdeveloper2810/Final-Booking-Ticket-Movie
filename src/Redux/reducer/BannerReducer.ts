import { http } from "./../../util/setting";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
  extraReducers(builder) {
    // pending: đang xử lý,
    // fullfiled: đã xử lý thành công
    // reject: xử lý thất bại
    builder.addCase(
      getAllBannerApi.fulfilled,
      (state: BannerState, action: PayloadAction<Banner[]>) => {
        state.arrBanner = action.payload;
        console.log(action.payload);
      }
    );
  },
});

export default BannerReducer.reducer;

export const getAllBannerApi = createAsyncThunk(
  "BannerReducer/getAllBannerApi",
  async () => {
    const result = await http.get(`/api/QuanLyPhim/LayDanhSachBanner`);
    return result.data.content;
  }
);
