import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // can thay doi
  // thay đổi #1
  promotionLine: null,
};

// thay đổi #1 tên slice
export const promotionLineSlice = createSlice({
  // thay đổi #1
  name: "promotionLine",
  initialState,
  reducers: {
    // thay đổi #1
    doSetPromotionLine: (state, action) => {
      state.isLoading = false;
      state.promotionLine = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

export const { doSetPromotionLine } = promotionLineSlice.actions;

export default promotionLineSlice.reducer;
