import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  // can thay doi
  user: {
    email: "",
    phone: "",
    fullName: "",
    role: "",
    avatar: "",
    id: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    doSetUser: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {},
});

export const { doSetUser } = userSlice.actions;

export default userSlice.reducer;
