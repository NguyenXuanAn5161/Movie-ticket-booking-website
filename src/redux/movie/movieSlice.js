import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // thay đổi #1
  movie: null,
};

// thay đổi #1 tên slice
export const movieSlice = createSlice({
  // thay đổi #1
  name: "movie",
  initialState,
  reducers: {
    // thay đổi #1
    doSetMovie: (state, action) => {
      state.isLoading = false;
      state.movie = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

// thay đổi #1
export const { doSetMovie } = movieSlice.actions;

export default movieSlice.reducer;
