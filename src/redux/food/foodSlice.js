import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // thay đổi #1
  food: null,
};

// thay đổi #1 tên slice
export const foodSlice = createSlice({
  // thay đổi #1
  name: "food",
  initialState,
  reducers: {
    // thay đổi #1
    doSetFood: (state, action) => {
      state.isLoading = false;
      state.food = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

// thay đổi #1
export const { doSetFood } = foodSlice.actions;

export default foodSlice.reducer;
