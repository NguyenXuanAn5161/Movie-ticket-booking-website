import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../redux/account/accountSlice";
import userReducer from "../redux/account/userSlice";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    user: userReducer,
  },
});
