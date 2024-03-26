import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // can thay doi
  // thay đổi #1
  priceDetail: null,
};

// thay đổi #1 tên slice
export const priceDetailSlice = createSlice({
  // thay đổi #1
  name: "priceDetail",
  initialState,
  reducers: {
    // thay đổi #1
    doSetPriceDetail: (state, action) => {
      state.isLoading = false;
      state.priceDetail = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

export const { doSetPriceDetail } = priceDetailSlice.actions;

export default priceDetailSlice.reducer;
