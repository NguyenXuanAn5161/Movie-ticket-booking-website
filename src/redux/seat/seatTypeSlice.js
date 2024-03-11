import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // can thay doi
  // thay đổi #1
  seatType: null,
};

// thay đổi #1 tên slice
export const seatTypeSlice = createSlice({
  // thay đổi #1
  name: "seatType",
  initialState,
  reducers: {
    // thay đổi #1
    doSetSeatType: (state, action) => {
      state.isLoading = false;
      state.seatType = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

export const { doSetSeatType } = seatTypeSlice.actions;

export default seatTypeSlice.reducer;
