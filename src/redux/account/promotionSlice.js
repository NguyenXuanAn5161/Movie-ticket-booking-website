import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // can thay doi
  // thay đổi #1
  promotion: null,
};

// thay đổi #1 tên slice
export const promotionSlice = createSlice({
  // thay đổi #1
  name: "promotion",
  initialState,
  reducers: {
    // thay đổi #1
    doSetPromotion: (state, action) => {
      state.isLoading = false;
      state.promotion = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

export const { doSetPromotion } = promotionSlice.actions;

export default promotionSlice.reducer;
