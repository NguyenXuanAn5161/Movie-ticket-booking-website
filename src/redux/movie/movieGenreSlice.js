import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // thay đổi #1
  movieGenre: null,
};

// thay đổi #1 tên slice
export const movieGenreSlice = createSlice({
  // thay đổi #1
  name: "movieGenre",
  initialState,
  reducers: {
    // thay đổi #1
    doSetMovieGenre: (state, action) => {
      state.isLoading = false;
      state.movieGenre = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

// thay đổi #1
export const { doSetMovieGenre } = movieGenreSlice.actions;

export default movieGenreSlice.reducer;
