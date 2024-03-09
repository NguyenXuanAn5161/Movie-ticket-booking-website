import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../redux/account/accountSlice";
import userReducer from "../redux/account/userSlice";
import promotionReducer from "./account/promotionSlice";
import foodCategoryReducer from "./food/foodCategorySlice";
import foodReducer from "./food/foodSlice";
import movieGenreReducer from "./movie/movieGenreSlice";
import movieReducer from "./movie/movieSlice";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    user: userReducer,
    movie: movieReducer,
    movieGenre: movieGenreReducer,
    promotion: promotionReducer,
    food: foodReducer,
    foodCategory: foodCategoryReducer,
  },
});
