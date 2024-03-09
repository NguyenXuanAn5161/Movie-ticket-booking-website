import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // thay đổi #1
  foodCategory: null,
};

// thay đổi #1 tên slice
export const foodCategorySlice = createSlice({
  // thay đổi #1
  name: "foodCategory",
  initialState,
  reducers: {
    // thay đổi #1
    doSetFoodCategory: (state, action) => {
      state.isLoading = false;
      state.foodCategory = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

// thay đổi #1
export const { doSetFoodCategory } = foodCategorySlice.actions;

export default foodCategorySlice.reducer;
