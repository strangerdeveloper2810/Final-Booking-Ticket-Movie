import { PayloadAction, createSlice } from "@reduxjs/toolkit";
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
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const LoadingSagaAction = LoadingReducer.actions;

export default LoadingReducer.reducer;
