import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // can thay doi
  // thay đổi #1
  price: null,
};

// thay đổi #1 tên slice
export const priceSlice = createSlice({
  // thay đổi #1
  name: "price",
  initialState,
  reducers: {
    // thay đổi #1
    doSetPrice: (state, action) => {
      state.isLoading = false;
      state.price = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

export const { doSetPrice } = priceSlice.actions;

export default priceSlice.reducer;
