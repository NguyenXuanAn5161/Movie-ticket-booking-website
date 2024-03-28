import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // thay đổi #1
  room: null,
};

// thay đổi #1 tên slice
export const roomSlice = createSlice({
  // thay đổi #1
  name: "room",
  initialState,
  reducers: {
    // thay đổi #1
    doSetRoom: (state, action) => {
      state.isLoading = false;
      state.room = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

// thay đổi #1
export const { doSetRoom } = roomSlice.actions;

export default roomSlice.reducer;
