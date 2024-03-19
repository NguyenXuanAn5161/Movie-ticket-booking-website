import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // can thay doi
  // thay đổi #1
  schedule: null,
};

// thay đổi #1 tên slice
export const scheduleSlice = createSlice({
  // thay đổi #1
  name: "schedule",
  initialState,
  reducers: {
    // thay đổi #1
    doSetSchedule: (state, action) => {
      state.isLoading = false;
      state.schedule = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

export const { doSetSchedule } = scheduleSlice.actions;

export default scheduleSlice.reducer;
