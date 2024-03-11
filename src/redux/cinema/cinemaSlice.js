import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // thay đổi #1
  cinema: null,
};

// thay đổi #1 tên slice
export const cinemaSlice = createSlice({
  // thay đổi #1
  name: "cinema",
  initialState,
  reducers: {
    // thay đổi #1
    doSetCinema: (state, action) => {
      state.isLoading = false;
      state.cinema = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

// thay đổi #1
export const { doSetCinema } = cinemaSlice.actions;

export default cinemaSlice.reducer;
