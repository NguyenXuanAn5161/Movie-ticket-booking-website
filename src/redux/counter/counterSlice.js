import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  // can thay doi
  seconds: 0,
  isRunning: false,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    doSetIsRunning: (state, action) => {
      state.isRunning = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { doSetIsRunning } = counterSlice.actions;

export default counterSlice.reducer;
