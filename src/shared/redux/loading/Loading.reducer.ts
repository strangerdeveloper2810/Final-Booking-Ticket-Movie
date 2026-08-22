import { PayloadAction, createSlice } from "@reduxjs/toolkit";

/**
 * EN: Shape of the global loading slice — a single boolean flag toggled
 * while a Redux-Saga-driven request is in flight (e.g. login/register).
 * VI: Cấu trúc của slice loading toàn cục — một cờ boolean duy nhất được
 * bật/tắt trong lúc một request do Redux-Saga xử lý đang chạy (vd. đăng
 * nhập/đăng ký).
 */
export type LoadingType = {
  isLoading: boolean;
};

const initialState: LoadingType = {
  isLoading: false,
};

const LoadingReducer = createSlice({
  name: "LoadingReducer",
  initialState,
  reducers: {
    // EN: Direct mutation here is safe and intentional — createSlice wraps
    // reducers with Immer, which turns this "mutation" into an immutable
    // update under the hood.
    // VI: Việc gán trực tiếp ở đây an toàn và có chủ đích — createSlice bọc
    // reducer bằng Immer, nên "mutation" này thực chất được chuyển thành một
    // cập nhật bất biến (immutable) phía dưới.
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

/**
 * EN: Action creators for the loading slice (currently just `setLoading`),
 * dispatched by saga workers to flip the spinner on/off around a request.
 * VI: Các action creator của slice loading (hiện chỉ có `setLoading`), được
 * các saga worker dispatch để bật/tắt spinner quanh một request.
 */
export const LoadingSagaAction = LoadingReducer.actions;

export default LoadingReducer.reducer;
