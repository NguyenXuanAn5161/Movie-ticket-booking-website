import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // can thay doi
  // thay đổi #1
  seat: null,
};

// thay đổi #1 tên slice
export const seatSlice = createSlice({
  // thay đổi #1
  name: "seat",
  initialState,
  reducers: {
    // thay đổi #1
    doSetSeat: (state, action) => {
      state.isLoading = false;
      state.seat = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

export const { doSetSeat } = seatSlice.actions;

export default seatSlice.reducer;
