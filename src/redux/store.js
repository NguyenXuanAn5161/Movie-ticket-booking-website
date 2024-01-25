import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../redux/account/accountSlice";
import counterReducer from "../redux/counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    account: accountReducer,
  },
});
